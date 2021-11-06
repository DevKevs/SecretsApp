import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  secrets: any = [];
  constructor(private database: DatabaseService, public modalController: ModalController) {
    this.database.createDatabase().then(() =>{
      this.getSecrets();
    });
  }

  ngOnInit() {
  }
  getSecrets(){
    this.database.getSecrets().then((data) =>{
      this.secrets = [];
      if (data.rows.length > 0){
        for (let i = 0; i < data.rows.length; i++) {
          this.secrets.push(data.rows.item(i));
        }
      }
    });
  }
  deleteSecret(id: number){
    this.database.deleteSecret(id).then((data)=>{
      alert(data);
      this.getSecrets();
    });
  }
  deleteAllSecrets(){
    this.database.deleteAll().then((data) => {
      alert(data);
      this.getSecrets();
    });
  }

  async presentModal(obj: any) {
    const modal = await this.modalController.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        entity: obj,
      }
    });
    return await modal.present();
  }
}
