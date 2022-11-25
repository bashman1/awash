import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { Platform, ToastController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
// import { ToastController } from '@ionic/angular';


declare var navigator; 
declare var Connection: any;
@Injectable({
  providedIn: 'root'
})
export class LoaderServiceService {
public netStat:any=null;
  constructor(
    public toastController: ToastController,
  ) {}
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  display(value: boolean) {
    console.log("changing to " + value)
    this.status.next(value);
  }
  closePopUp(id: any){
    document.getElementById(id).style.display="none";
  }
  showElement(id: any){
    document.getElementById(id).style.display="inline";
  }
  setInnerHtml(id: any,message:any){
    document.getElementById(id).innerHTML = message;
  }

  async presentToast(color, message) {
    const toast = await this.toastController.create({
        message,
        duration: 5000,
        position: 'top',
        color
    });
    toast.present();
}



}
