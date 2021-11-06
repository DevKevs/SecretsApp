import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  dbObjet: SQLiteObject;
  table = {
    secrets: 'secretss',
  };
  constructor(private sqlite: SQLite) { }

  async createDatabase(){
    await this.sqlite.create({
      name: 'secretosDB',
      location: 'default',
    }).then((db: SQLiteObject) =>{
      this.dbObjet = db;
    }).catch((e)=>{
      alert('Error On create ' + JSON.stringify(e));
    });

    await this.createTables();
  }
  async createTables(){
    await this.dbObjet.executeSql(
      // eslint-disable-next-line max-len
      `CREATE TABLE IF NOT EXISTS ${this.table.secrets} (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre VARCHAR(255), fecha VARCHAR(55), descripcion VARCHAR(255), foto VARCHAR(1500), audio VARCHAR(1500))`,
      []
    );
  }

  async addSecret(obj: any){
    return this.dbObjet.executeSql(
      // eslint-disable-next-line max-len
      `INSERT INTO ${this.table.secrets} (nombre, fecha, descripcion, foto, audio) VALUES ('${obj.nombre}', '${obj.fecha}', '${obj.descripcion}', '${obj.foto}', '${obj.audio}')`,
      []
    ).then(() => 'secret created').catch((e) => 'Error on create secret ' + JSON.stringify(e));
  }
  async getSecrets(){
    return this.dbObjet.executeSql(
      `SELECT * FROM ${this.table.secrets}`,
      []
    ).then((res) => res).catch((e) => 'error on getting data ' + JSON.stringify(e));
  }
  async  deleteSecret(id: number){
    return this.dbObjet.executeSql(
      `DELETE FROM ${this.table.secrets} WHERE id = ${id}`,
      []
    ).then(() => 'Secret deleted').catch((e)=> 'error on delete secret ' + JSON.stringify(e));
  }
  async  deleteAll(){
    return this.dbObjet.executeSql(
      `DELETE FROM ${this.table.secrets}`,
      []
    ).then(() => 'Secrets deleted').catch((e)=> 'error on delete all secrets ' + JSON.stringify(e));
  }
}
