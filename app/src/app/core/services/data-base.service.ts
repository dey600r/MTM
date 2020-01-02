import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

import { MotoModel, ConfigurationModel } from '@models/index';

import { ConstantsTable, ActionDB } from '@utils/index';

import { SqlService } from './sql.service';

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  motos = new BehaviorSubject([]);
  configuration = new BehaviorSubject([]);
  constructor(private plt: Platform,
              private sqlitePorter: SQLitePorter,
              private sqlite: SQLite,
              private http: HttpClient,
              private sqlService: SqlService) { }

  initDB() {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'mtm.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }

  seedDatabase() {
    this.database.executeSql(`SELECT * FROM ${ConstantsTable.TABLE_MTM_MOTO}`, []).then(initDB => {
      console.log(`NEXT DEPLOY DB`); // INIT DB
      this.http.get('assets/db/nextDeployDB.sql', { responseType: 'text'}).subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql).then(result => {
          this.loadAllTables();
          this.dbReady.next(true);
        })
        // tslint:disable-next-line: no-shadowed-variable
        .catch(e => console.error(`Error launching next deploy data base: ${e}`));
      });
    }).catch(e => {
      console.log(`INIT DB`); // INIT DB
      this.http.get('assets/db/initTableDB.sql', { responseType: 'text'}).subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql).then(result => {
          this.loadAllTables();
          this.dbReady.next(true);
        })
        // tslint:disable-next-line: no-shadowed-variable
        .catch(e => console.error(`Error launching initialize data base: ${e}`));
      });
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getMotos(): Observable<MotoModel[]> {
    return this.motos.asObservable();
  }

  getConfigurations(): Observable<ConfigurationModel[]> {
    return this.configuration.asObservable();
  }

  loadAllTables() {
    this.loadAllDataTable(ConstantsTable.TABLE_MTM_MOTO);
    this.loadAllDataTable(ConstantsTable.TABLE_MTM_CONFIGURATION);
  }

  loadAllDataTable(table: string) {
    return this.database.executeSql(this.sqlService.getSql(table), []).then(data => {
      this.loadDataOnObserver(table, data);
    });
  }

  loadDataOnObserver(table: string, data: any[]) {
    switch (table) {
      case ConstantsTable.TABLE_MTM_MOTO:
        this.motos.next(this.sqlService.mapDataToObserver(table, data));
        break;
      case ConstantsTable.TABLE_MTM_CONFIGURATION:
        this.configuration.next(this.sqlService.mapDataToObserver(table, data));
        break;
    }
  }

  saveMoto(moto: MotoModel, action: ActionDB) {
    let sqlDB: string;
    let dataDB: any[];
    switch (action) {
      case ActionDB.create:
        sqlDB = this.sqlService.insertSqlMoto();
        dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth];
        break;
      case ActionDB.update:
        sqlDB = this.sqlService.updateSqlMoto();
        dataDB = [moto.model, moto.brand, moto.year, moto.km, moto.configuration.id, moto.kmsPerMonth, moto.id];
        break;
      case ActionDB.delete:
        sqlDB = '';
        break;
    }
    return this.database.executeSql(sqlDB, dataDB).then(data => {
            this.loadAllDataTable(ConstantsTable.TABLE_MTM_MOTO);
      }).catch(e => console.error(`Error saving moto: ${e.message}`));
  }

  // getMoto(id: string): Promise<MotoModel> {
  //   return this.database.executeSql('SELECT * FROM mtmMoto WHERE id = ?', [id]).then(data => {
  //     let skills = [];
  //     if (data.rows.item(0).skills !== '') {
  //       skills = JSON.parse(data.rows.item(0).skills);
  //     }

  //     return {
  //       id: data.rows.item(0).id,
  //       model: data.rows.item(0).model,
  //       brand: data.rows.item(0).brand,
  //       year: data.rows.item(0).year
  //      };
  //   });
  // }

  // deleteDeveloper(id) {
  //   return this.database.executeSql('DELETE FROM developer WHERE id = ?', [id]).then(_ => {
  //     this.loadDevelopers();
  //     this.loadProducts();
  //   });
  // }

  // updateDeveloper(dev: Dev) {
  //   let data = [dev.name, JSON.stringify(dev.skills), dev.img];
  //   return this.database.executeSql(`UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`, data).then(data => {
  //     this.loadDevelopers();
  //   })
  // }

  // loadProducts() {
  //   let query = 'SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId';
  //   return this.database.executeSql(query, []).then(data => {
  //     let products = [];
  //     if (data.rows.length > 0) {
  //       for (var i = 0; i < data.rows.length; i++) {
  //         products.push({ 
  //           name: data.rows.item(i).name,
  //           id: data.rows.item(i).id,
  //           creator: data.rows.item(i).creator,
  //          });
  //       }
  //     }
  //     this.products.next(products);
  //   });
  // }
 
  // addProduct(name, creator) {
  //   let data = [name, creator];
  //   return this.database.executeSql('INSERT INTO product (name, creatorId) VALUES (?, ?)', data).then(data => {
  //     this.loadProducts();
  //   });
  // }
}
