import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {FormGroup,FormBuilder,FormControl,Validators, ReactiveFormsModule} from "@angular/forms";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ModalController, Platform, IonRouterOutlet, LoadingController } from "@ionic/angular";
import { LoginModalPage } from "../login-modal/login-modal.page";
import { Plugins } from '@capacitor/core';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx'
// import { Network } from '@ionic-native/network';

const { Device,SplashScreen} = Plugins;


@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})

export class LoginPage extends LoginService {
  // loginForm: FormGroup;
  serviceCode: String;
  request: String;
  deviceId:String;
  showLoader: boolean;
  status:boolean;
  // network:any;
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;


  validation_messages = {
    userName: [
      { type: "required", message: "Username is required." },
      {
        type: "pattern",
        message: "Email must be in this format your@email.com"
      }
    ],

    password: [{ type: "required", message: "Password is required." }]
  };

  constructor(
    private router: Router,
    public modalController: ModalController,
    public http: HttpClient,
    public helper: HelperService,
   
    private loginService: LoginService,
    // private fb: FormBuilder,
    public loaderService: LoaderServiceService,
     public commonFunction: CommonFunctions,
     private screenOrientation: ScreenOrientation,
     private platform: Platform,
     public loadingController: LoadingController
    //  public network: Network
  ) 
  
  {

    super(http,helper, loadingController) 

    
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/login') {
        // this.platform.exitApp(); 
  
        // or if that doesn't work, try
        navigator['app'].exitApp();
      } else {
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

 ngOnInit() {
    super.ngOnInit();
    // this.login();
this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.getDeviceDetails();

  }


  async getDeviceDetails(){
    const info = await Device.getInfo();
      this.deviceId = info.uuid;
         this.checkDeviceId(this.deviceId);  
      }


  async login() {
    // console.log("Modal Pressed");
    const modal = await this.modalController.create({
      component: LoginModalPage,

      componentProps: {
        'status': this.status,
        'deviceNo': this.deviceId,
      }

    });
    
    // console.log(this.status)
   // console.log(modal)
    return await modal.present();
  }


  checkDeviceId(Id){
     console.log("Here chack device")
    let postData = {deviceId:Id};

    var controller = this;
 
     this.sendRequestToServer(
       "MobileAppManagement",
       "checkMobileUserType",
       JSON.stringify(postData),   
       function (response) {
        if(response.returnCode===0){
          controller.status = response.returnData;
          
        }else{
          
        }
       },
       function (err) {
        //  console.log( err.message)//Error handler
       }
     );
   }

   
   handleResponse(response,request){
     
    let data = response.returnData
    console.log("login resp: "+ JSON.stringify(response));
    if(response.returnCode!=0){
      let data = {title:"Authentication Error", message:response.returnMessage};
      console.log(data)
      return;
    }else{
      if(request=="login"){
        //console.log(response.returnData);
        if(this.status==false){
          //redirect to customer dashboard with his menu
        }else{
          //redirect to agent dashboard
          this.router.navigate(['/menu']);

        }
        

      }
    }

    let respData = response.returnData;
  }

  // getCurrentorientation(){
  //   console.log(this.screenOrientation.type);
  // }

  // async lockScreen(){
  //   this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  // }

  // unlockScreen(){
  //   this.screenOrientation.unlock();
  // }



}
