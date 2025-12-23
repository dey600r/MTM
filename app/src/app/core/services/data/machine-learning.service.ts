import { Injectable } from "@angular/core";
import { IIWeibullParams, IOptimalCostTime, IOptimalPredictiveMaintenance } from "@models/index";

@Injectable({
  providedIn: 'root'
})
export class MachineLearningService {

  // COMMON HELP NORMALIZATION AND INTERPOLATION
  interpolateValue(points: any[], x: number): number {
    const sorted = points
      .map(p => ({ x: Number(p.name), y: p.value }))
      .sort((a, b) => a.x - b.x);

    if (x <= sorted[0].x) return sorted[0].y;
    if (x >= sorted[sorted.length - 1].x) return sorted[sorted.length - 1].y;

    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = sorted[i];
      const p2 = sorted[i + 1];

      if (x >= p1.x && x <= p2.x) {
        const t = (x - p1.x) / (p2.x - p1.x);
        return p1.y + t * (p2.y - p1.y);
      }
    }

    return sorted[sorted.length - 1].y;
  }

  normalizeT(T: number): number {
    if (T < 500) return Math.round(T / 10) * 10;
    if (T < 2000) return Math.round(T / 100) * 100;
    if (T < 10000) return Math.round(T / 500) * 500;
    return Math.round(T / 1000) * 1000;
  }

  normalizeProbability(p: number): number {
    return Math.round(p * 1000) / 10; // 1 decimal
  }

  normalizeCost(c: number): number {
    if (c < 0.01) return Number(c.toFixed(4));
    if (c < 1) return Number(c.toFixed(2));
    return Math.round(c / 10) * 10;
  }

  // PROBABILITY MODELS - WEIBULL DISTRIBUTION

  //   BETA - β	Significado físico (motos)	Efecto en probabilidades
  // < 1	Fallos aleatorios (defectos, uso irregular)	Alta probabilidad temprana
  // = 1	Riesgo constante	Probabilidad crece lineal
  // 1–2	Desgaste progresivo	Probabilidad moderada al inicio
  // 2–3	Desgaste claro	Probabilidad baja al inicio, sube rápido
  // > 3	Fatiga fuerte	Probabilidad casi cero al inicio, muy alta al final

  //   Si subes beta, el modelo:
  // ↓ reduce probabilidad temprana
  // ↑ concentra los fallos al final
  // mueve T* a valores más altos
  // 📌 Si bajas beta, el modelo:
  // ↑ aumenta probabilidad temprana
  // ↓ hace el riesgo más plano
  // mueve T* hacia km más bajos

  // ETA - η es la escala, la “vida típica” de la pieza:
  //   En η km, el 63% de las piezas habrían fallado.
  // 📌 Si subes eta:
  // todas las probabilidades se desplazan a la derecha
  // la pieza “dura más”
  // T* sube
  // 📌 Si bajas eta:
  // la pieza “envejece antes”
  // la probabilidad crece antes
  // T* baja

  weibullSurvival(t: number, beta: number, eta: number) {
    return Math.exp(-Math.pow(t / eta, beta));
  }

  weibullFailureProbability(t: number, beta: number, eta: number): number {
      return 1 - this.weibullSurvival(t, beta, eta);
  }

  weibullLogLikelihood(beta: number, eta: number, failures: number[], censored: number[]) {
    // Failure events contribute full density; censored only contribute survival
    let logL = 0;

    for (const t of failures) {
      const term = Math.log(beta) - beta * Math.log(eta) + (beta - 1) * Math.log(t) - Math.pow(t / eta, beta);
      logL += term;
    }
    for (const t of censored) {
      logL += -Math.pow(t / eta, beta);
    }
    return logL;
  }

  limitsTEvents(failures: number[], censored: number[]): {min: number, max: number} {
    let minFail =Infinity, minCens = Infinity;
    let maxFail = 0, maxCens = 0;
    if(failures.length > 0) {
      minFail = Math.min(...failures);
      maxFail = Math.max(...failures);
    }
    if(censored.length > 0) {
      minCens = Math.min(...censored);
      maxCens = Math.max(...censored);
    }
    return {
      min:  (minFail < minCens ? minFail : minCens) * 0.8,
      max: (maxFail < maxCens ? maxCens : maxFail) * 1.2
    };
  }

  // Simple grid search MLE for beta and eta (suficiente para producción inicial)
  estimateWeibullParams(failures: number[], censored: number[]): IIWeibullParams {
    let best = { beta: 1.0, eta: 1000, logL: -Infinity };

    if (failures.length > 0 || censored.length > 0) {
      const {min: minEta, max: maxEta} = this.limitsTEvents(failures, censored);
      const steps = Math.floor((maxEta - minEta) / 200) + 1;
  
      // Modelo de probabilidades
      for (let beta = 0.5; beta <= 3.0; beta += 0.05) {
        // “¿Entre qué km puede estar la vida típica?”
        for (let eta = minEta; eta <= maxEta; eta += steps) {
          const logL = this.weibullLogLikelihood(beta, eta, failures, censored);
          if (logL > best.logL) best = { beta, eta, logL };
        } 
      }
    }

    return { beta: best.beta, eta: best.eta };
  }

  // CURRENT OPTIMAL CHANGE

  // ∫0→T S(t) dt numérico
  integrateS_numeric(beta: number, eta: number, T: number, steps = 2000) {
    const dt = T / steps;
    let total = 0.5 * (this.weibullSurvival(0, beta, eta) + this.weibullSurvival(T, beta, eta));
    for (let i = 1; i < steps; i++) total += this.weibullSurvival(i * dt, beta, eta);
    return total * dt;
  }

  // Coste medio por unidad de tiempo
  averageCostPerTime(T: number, beta: number, eta: number, Cp: number, Cf: number) {
    const ST = this.weibullSurvival(T, beta, eta);
    const numer = Cf * (1 - ST) + Cp * ST;
    const denom = this.integrateS_numeric(beta, eta, T);
    return numer / denom;
  }

  // Encuentra T óptimo
  findOptimalTCost(beta: number, eta: number, Cp: number, Cf: number, Tmin = 100, Tmax = eta * 3, steps = 200) {
    let best = { T: Tmin, cost: Infinity };
    for (let T = Tmin; T <= Tmax; T += steps) {
      const cost = this.averageCostPerTime(T, beta, eta, Cp, Cf);
      if (cost < best.cost) best = { T, cost };
    }
    return best;
  }

  findOptimalTProbability(beta: number, eta: number, failures: number[], censored: number[], steps: number = 10): IOptimalPredictiveMaintenance {
    let result: IOptimalPredictiveMaintenance = { optimal: null, dataPredictive: [] };
    result.optimal = this.findOptimalT(beta, eta, failures, censored);
    //console.log("T* óptimo (km):", Math.round(result.optimal.optimalT), "Coste medio:", result.optimal.optimalCostPerKm.toFixed(5), "Coste a los 10000km", (opt1.optimalCostPerKm * 10000).toFixed(2), `MIN: ${opt1.Tmin} & MAX: ${opt1.Tmax}`);

    const stepSize = Math.floor((result.optimal.Tmax - result.optimal.Tmin) / steps) + 1;

    for(let t=result.optimal.Tmin; t<=result.optimal.Tmax; t+= (stepSize)) {
      result.dataPredictive.push({ 
        T: this.normalizeT(t), 
        probability: this.normalizeProbability(this.weibullFailureProbability(t, beta, eta)),
        cost: this.normalizeCost(result.optimal.optimalCostPerKm * t)
      });
      //console.log(`\nProbabilidad de fallo en los próximos ${t} km:`, (probIn1000km * 100).toFixed(4) + "%");
    }
    return result;
  }

  findOptimalT(beta: number, eta: number, failures: number[], censored: number[], min: number = 0.1, max: number = 0.9): IOptimalCostTime {

    const avg = (arr: number[]) => arr.length ? arr.reduce((a,b)=>a+b)/arr.length : null;

    return this.findOptimalT_Optimized(beta, eta, avg(censored), avg(failures), min, max);
  }

  findOptimalT_Optimized(beta: number, eta: number, Cp: number, Cf: number, min: number, max: number): IOptimalCostTime {

    // 0) METHODS
    const findCDF = (beta: number, eta: number, per: number): number => { return eta * Math.pow(-Math.log(per), 1 / beta) };
    const findBestCostAtT = (best: { T: number, cost: number }, init: number, steps: number, max: number, min: number): any => {
      const coarseStepSize = (max - min) / steps;
      for (let i = init; i <= steps; i++) {
        const T = Tmin + i * coarseStepSize;
        const cost = this.averageCostPerTime(T, beta, eta, Cp, Cf);
        if (cost < best.cost) best = { T, cost };
      }
      return best;
    }

    // 1) ---- Selección automática ----

    // Tmin = donde la probabilidad de fallo ya es relevante (~10%)
    const Tmin = findCDF(beta, eta, max); // 10% CDF

    // Tmax = donde hay fallo casi seguro (~98%)
    const Tmax = findCDF(beta, eta, min); // 98% CDF

    // 2) ---- Búsqueda gruesa ----
    let best = { T: Tmin, cost: this.averageCostPerTime(Tmin, beta, eta, Cp, Cf) };

    best = findBestCostAtT(best, 1, 80, Tmax, Tmin); // 80 pasos - muy rapido

    // 3) ---- Refinamiento local alrededor del mínimo ----

    const window = eta * 0.1; // 10% alrededor del óptimo
    const fineMin = Math.max(Tmin, best.T - window);
    const fineMax = Math.min(Tmax, best.T + window);

    best = findBestCostAtT(best, 1, 200, fineMax, fineMin); // 200 pasos - más fino

    return {
      Tmin: this.normalizeT(Tmin),
      Tmax: this.normalizeT(Tmax),
      optimalT: this.normalizeT(best.T),
      optimalCostPerKm: this.normalizeCost(best.cost)
    };
  }

}