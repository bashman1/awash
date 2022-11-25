import {Injectable, ViewChild} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {startWith} from "rxjs/operators";
import { IonRouterOutlet, Platform, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { Network } = Plugins



@Injectable()
export class CommonFunctions {
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  // payment history
  private paymentHistoryStatus = new BehaviorSubject(true);
  paymentHistory = this.paymentHistoryStatus.asObservable();

  constructor(
    private platform: Platform,
    private router: Router,
    public alertController: AlertController,
    public toastController: ToastController,
    public loadingController: LoadingController,
  ){
    
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
  toUpper(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(word) {
          if(word[0]){
            console.log("First capital letter: "+word[0]);
            console.log("remain letters: "+ word.substr(1));
            return word[0].toUpperCase() + word.substr(1);
          }
            
        })
        .join(' ');
     }

  /**
   * Back Button Close App
   * @param url 
   */
  backButtonCloseApp(url){
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === url) {
        // this.platform.exitApp(); 
        // this.router.navigate(['/menu/main']);
        // or if that doesn't work, try
        navigator['app'].exitApp();
      } else {
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

  /**
   * Back Button Redirectr
   * @param current_url 
   * @param redirect_url 
   */
  backButtonRedirect(current_url, redirect_url){
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === current_url) {
        // this.platform.exitApp(); 
        this.router.navigate([redirect_url]);
        // or if that doesn't work, try
        // navigator['app'].exitApp();
      } else {
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

  /**
   * Alert method
   * @param header 
   * @param subHeader 
   * @param message 
   * @param button 
   */
  async presentAlert(header, subHeader, message, button) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [button]
    });

    await alert.present();
  }


  /**
   * Toast messge nofication automatic ending
   * @param message 
   * @param duration 
   * @author bashMan
   */
  async presentToast(message, duration, color) {
    console.log('toast')
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'middle'
    });
    toast.present();
  }


  /**
   * Loading method to handle time lag on quering database
   * @param message 
   * @param duration 
   * @param mode  "ios", "md"
   * @param spinner "bubbles", "circles","circular", "crescent","dots","lines", "lines-small"
   */
  async presentLoading(message, duration, mode, spinner) {
    const loading = await this.loadingController.create({
      message: message,
      duration: duration,
      mode: mode,
      spinner:spinner,
    });
    await loading.present();
  }

    /**
 * Dynamic Toast message notification 
 * @param message 
 * @param duration 
 */
async feedback(message, duration, color) {
  const toast = await this.toastController.create({
    message:message,
    duration: duration,
    color: color,
    position: 'top'
  });
  toast.present();
}
  /*
  * Format Currency On Key Press Using the Field ID
  * */
  formatCurrency(id: string) {
    document.getElementById(id).addEventListener('input', event =>
      // @ts-ignore
      event.target.value = (parseInt(event.target.value.replace(/[^\d]+/gi, '')) || 0).toLocaleString('en-US')
    );
  }
  /**
   * Closing the loading 
   */
  async closeLoading(){
   await this.loadingController.dismiss();
  }

/**
 * Internet connectivity status
 */
  async checkNetworkConectivity(){
    let handler = Network.addListener('networkStatusChange', (status) => {
      console.log("Network status changed", status);
    });

    let status = await Network.getStatus();
    if(status.connected){

    }else{
      this.closeLoading();
      this.presentAlert("Connectivity", "Internet Connection", "Please check internet connection and try again", "ok");
    }
  
    console.log(status)
  }

 
  /** 
   * set status of payment history pages
   * @param status 
   */
  updatePaymentHistoryStatus(status:any){
    this.paymentHistoryStatus.next(status);
  }



}