import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { LoginService } from 'src/app/services/login.service';
import { HelperService } from 'src/app/services/helper.service';
// import { HttpClient } from 'selenium-webdriver/http';
import { HttpClient } from '@angular/common/http';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { Plugins } from '@capacitor/core';
// import { async } from 'q';
import { JsonObject } from 'json2typescript';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';
// import { platform } from 'process';
import { Platform } from '@ionic/angular';
// import { SSL_OP_ALL } from 'constants';
// import { ShowHidePasswordModule } from 'ngx-show-hide-password';

const { Storage } = Plugins;
const { Clipboard } = Plugins;
const { Device } = Plugins;


declare var navigator;
declare var Connection: any;
@Component({
 selector: 'app-login-modal',
 templateUrl: './login-modal.page.html',
 styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage extends LoginService {

 // @Input() status: string;
 // @Input() deviceNo: string;


 validation_messages = {


     newPassword: [
       { type: 'required', message: 'New password is required.' },
       { type: 'pattern', message: 'Password must contain at least one lowercase, one upper case one number and at least eight characters long' }
     ],
     confirmPin: [
       { type: 'required', message: 'Please confirm your pin.' },
       { type: 'minLength', message: 'The length should be of 5 digits'},
       { type: 'length', message: 'The length should be of 5 digits'},
       { type: 'pattern', message: 'Passwords do not match' }

     ]
   };


   resetPassword: FormGroup;
//   registrationForm: FormGroup;
//   // Status: any;
//   displayAgent: any = 'none';
//   displayCustomer: any = 'none';
//   displayCustomerRegistration: any = 'none';
//   loginbtn: any = 'block';
//   customerData: any;
//   institutionData: any;
//  // user: AppUser;
//   customerImage: any;
//   deviceId: any;
//   loading: any;
//   netStat: any;
//   net: Boolean = false;
//   deviceNumber: String;
//   status: any;
//   deviceNo: String;
//   tempPass:any;

   token:any;
   custNo:any;

 constructor(
   public modalController: ModalController,
   private router: Router,
   private navParams: NavParams,
   public http: HttpClient,
   public helper: HelperService,
   private fb: FormBuilder,
   public loaderService: LoaderServiceService,
   public commonFunction: CommonFunctions,
   private authService: AuthService,
   public navCtrl: NavController,
   private alertCtrl: AlertController,
   public  loadingController: LoadingController,
   private screenOrientation: ScreenOrientation,
   private platform: Platform,

   ) {
     super(http, helper, loadingController);
 //  alert( this.loaderService.netStat);
   // if (navParams.get('status')) {
   //   this.displayAgent = 'block';
   // } else if (!navParams.get('status')) {
   //   this.displayCustomer = 'block';
   // } else {
   //   // this.alertMessage('Connection Error', 'Please try again later');
   // }

   this.token = navParams.get('token');
   this.custNo = navParams.get('custNo');
 }




  ngOnInit() {
   super.ngOnInit();

   this.resetPassword = this.fb.group({
     newPassword: new FormControl(null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$')])),
     confirmPassword:new FormControl(null, Validators.compose([Validators.required])),
   },
   {
     validator: this.MatchPassword
   }
   )

 }

 private MatchPassword(AC: AbstractControl) {
   const newPassword = AC.get('newPassword').value; // to get value in input tag
   const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
   if (newPassword !== confirmPassword) {
     //  console.log('false');
     AC.get('confirmPassword').setErrors({ MatchPassword: true });
   } else {
     //  console.log('true')
     AC.get('confirmPassword').setErrors(null);
   }
 }

 closeModal() {this.modalController.dismiss(); }

 passReset(){
  
   let auth = {
     token: this.token,
     username: this.custNo,
     type: 'mobile'
   }, requestData={
     password:this.resetPassword.controls['newPassword'].value,
     custNo:this.custNo
   };
   const postData = {
     auth,
     requestData,
   };
   let that = this;
   this.sendRequestToServer(
     'MobileAppManagement',
     'customerResetPassword',
     JSON.stringify(postData),
     function(response) {
       that.handleResponseResetPassword(response);
     },
     function(err) {
       console.log(err.message); // Error handler
     }
   );
 }


 handleResponseResetPassword(response){
   this.resetPassword.reset();
   console.log(response);
   if(response.returnCode !==0){
     alert('error')
   }else{
     this.closeModal();
   }
 }

 rendomPasswordGenerator(keyLength) {
   var i, newPassWord = '', characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

   var charactersLength = characters.length;

   for (i = 0; i < keyLength; i++) {
     newPassWord += characters.substr(Math.floor((Math.random() * charactersLength) + 1), 1);
   }

   return newPassWord;
 }

}
