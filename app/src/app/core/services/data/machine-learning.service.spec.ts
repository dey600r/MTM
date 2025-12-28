import { TestBed } from "@angular/core/testing";

// SERVICES
import { MachineLearningService } from "./machine-learning.service";

describe('MachineLearningService', () => {
    let service: MachineLearningService;

    beforeEach(() => {
        service = TestBed.inject(MachineLearningService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should interpolate points', () => {
        const points = [
            { name: '132', value: 2.3432},
            { name: '200', value: 4.12334},
        ];
        expect(service.interpolateValue(points, 100)).toEqual(2.3432);
        expect(service.interpolateValue(points, 150)).toEqual(2.8144135294117647);
        expect(service.interpolateValue(points, 250)).toEqual(4.12334);
    });

    it('should normalize number T', () => {
        expect(service.normalizeT(10.43242334)).toEqual(10);
        expect(service.normalizeT(1020.32123423)).toEqual(1000);
        expect(service.normalizeT(7234.342423)).toEqual(7000);
        expect(service.normalizeT(13432.342423)).toEqual(13000);
    });

    it('should normalize number Probability', () => {
        expect(service.normalizeProbability(0.43242334)).toEqual(43.2);
    });

    it('should normalize number Cost', () => {
        expect(service.normalizeCost(0.00043242334)).toEqual(0.0004);
        expect(service.normalizeCost(0.43242334)).toEqual(0.43);
        expect(service.normalizeCost(1.43242334)).toEqual(1.4);
        expect(service.normalizeCost(12.4353)).toEqual(10);
        expect(service.normalizeCost(432.543)).toEqual(430);
    });

    it('should calculate weibull survival form', () => {
        expect(service.weibullFailureProbability(1000, 1, 4500)).toEqual(0.19926259708319194);
        expect(service.weibullFailureProbability(1000, 3, 4500)).toEqual(0.01091394291161396);
        expect(service.weibullFailureProbability(1000, 1, 2000)).toEqual(0.3934693402873666);
        expect(service.weibullFailureProbability(1000, 3, 2000)).toEqual(0.11750309741540454);
    });

    it('should calculate best T', () => {
        expect(service.weibullLogLikelihood(1, 3000, [1500, 2000], [1000, 1200, 1100, 9500])).toEqual(-21.446068468633825);
        expect(service.weibullLogLikelihood(1, 1000, [1500, 2000], [1000, 1200, 1100, 9500])).toEqual(-30.115510557964274);
        expect(service.weibullLogLikelihood(3, 3000, [1500, 2000], [1000, 1200, 1100, 9500])).toEqual(-48.33899439455975);
        expect(service.weibullLogLikelihood(3, 1000, [1500, 2000], [1000, 1200, 1100, 9500])).toEqual(-882.2300614032919);
    });

    it('should estimate weibull form parameters (beta & eta)', () => {
        expect(service.estimateWeibullParams([1500, 2000], [1000, 1200, 1100, 9500])).toEqual({ beta: 1.0500000000000005, eta: 7928 });
    });

    it('should find optimal cost', () => {
        expect(service.findOptimalTCost(1, 3000, 100, 300)).toEqual({ T: 8900, cost: 0.1018089157434078 });
        expect(service.findOptimalTCost(1, 3000, 100, 300, 200, 5000, 100)).toEqual({ T: 5000, cost: 0.10776187769914636 });
        expect(service.findOptimalTCost(3, 3000, 100, 300, 200, 5000, 100)).toEqual({ T: 1900, cost: 0.08104034411459174 });
    });

    it('should find optimal probability', () => {
        const data = service.findOptimalTProbability(1, 3000, [1500, 2000], [1000, 1200, 1100, 9500])
        expect(data.dataPredictive.length).toEqual(10);
        expect(data.dataPredictive[0].T).toEqual(320);
        expect(data.dataPredictive[0].probability).toEqual(10.1);
        expect(data.dataPredictive[0].cost).toEqual(220);
        expect(data.optimal.Tmax).toEqual(7000);
        expect(data.optimal.Tmin).toEqual(320);
        expect(data.optimal.optimalCostPerKm).toEqual(0.7);
        expect(data.optimal.optimalT).toEqual(7000);
    });

    it('should find optimal T', () => {
        let data = service.findOptimalT(1, 3000, [1500, 2000], [1000, 1200, 1100, 9500]);
        expect(data.Tmax).toEqual(7000);
        expect(data.Tmin).toEqual(320);
        expect(data.optimalCostPerKm).toEqual(0.7);
        expect(data.optimalT).toEqual(7000);
        data = service.findOptimalT(1, 3000, [1500, 2000], [1000, 1200, 1100, 9500], 0.2, 0.7);
        expect(data.Tmax).toEqual(5000);
        expect(data.Tmin).toEqual(1100);
        expect(data.optimalCostPerKm).toEqual(0.85);
        expect(data.optimalT).toEqual(5000);
    });
});