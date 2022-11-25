import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(    
    private alertCtrl:AlertController,
    ) { }

  async logMessage(title,message){
    let data = {title:title, message:message};
    let alert =await this.alertCtrl.create({
      header:data.title,        
      message:data.message,
      buttons:['OK']
    });
    alert.present();
  }
}
