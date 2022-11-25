import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { ModalController, LoadingController, Platform, AlertController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage extends LoginService {
  fogotPasswordForm:FormGroup;
  resetPasswordForm: FormGroup;
  tokenSent:Boolean= false;
  token_allowed:Boolean=true;
  isCreatePasswordSeen: boolean=false;
  isConfirmPasswordSeen: boolean=false
  validation_messages = {
    userName: [
      { type: "required", message: "Member number is required." },
      {type: "pattern", message: "Email must be in this format your@email.com"}
    ],
    token:[
      { type: "required", message:"Please enter token sent to your email"}
    ],
    password: [
      {
        type: "required",
        message:"Password is required",
      },
      {
        type: "pattern",
        message:
          "Password must contain at least one lowercase, one upper case one number and at least eight characters long"
      }
    ],
   }

  constructor(
    private router: Router,
    public modalController: ModalController,
    public http: HttpClient,
    public helper: HelperService,
    private fb: FormBuilder,
    public loadingController: LoadingController,
    private loginService: LoginService,
    // private fb: FormBuilder,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    // private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private alertCtrl: AlertController,
    private authService: AuthService,
    public navCtrl: NavController,
    // private platform: Platform
  ) { 
    super(http, helper, loadingController);
    this.commonFunction.backButtonCloseApp('/forgot-password');
  }

  ngOnInit() {
    this.fogotPasswordForm = this.fb.group({
      userName: new FormControl(null, Validators.compose([Validators.required])),
    });

    this.resetPasswordForm = this.fb.group({
      userName: new FormControl(null, Validators.compose([Validators.required])),
      token:new FormControl(null, Validators.compose([Validators.required])),
      password:new FormControl(null, Validators.compose([Validators.required,  Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")])),
      confirm_password:new FormControl(null),
    },
    { 
      validator: this.ConfirmPassword
    })

  }


  private ConfirmPassword(AC: AbstractControl){
    const newPassword = AC.get("password").value; // to get value in input tag
    const confirmPassword = AC.get("confirm_password").value; // to get value in input tag
    if (newPassword !== confirmPassword) {
      AC.get("confirm_password").setErrors({ ConfirmPassword: true });
    } else {
      AC.get("confirm_password").setErrors(null);
    }
  }

  forgotPassword(){
    let userName = this.fogotPasswordForm.controls['userName'].value
    if(userName==null){
      this.commonFunction.presentToast("Please fill in Member Number", 3000,'');
      return
    }

    let that= this, requestData,postData;
    requestData={
      custNo: userName.trim(),
      password:this.rendomPasswordGenerator(8),
    }
    postData={
      requestData:requestData,
      purpose:'NEW_PASSWORD'
  
    }

    this.sendRequestToServer(
      'MobileAppManagement',
      'sendPasswordCreationOrResetToken',
      JSON.stringify(postData),
      function(response){
        that.handleResponseForgotPassword(response);
        console.log(response);
      },
      function(err) {
        //  console.log( err.message)//Error handler
        that.commonFunction.presentAlert('Process Failed', 'Error','Try Agein', 'Ok');
      });
  }

  handleResponseForgotPassword(response){
    console.log(response);
    if(response.returnCode!==0){
      this.commonFunction.presentAlert("Reset Password", "Error", response.returnMessage, 'ok')
    }else{
      this.commonFunction.presentToast(response.returnMessage, 7000, '');
      this.tokenSent = true;
      if(response.returnData.allowPinToken){
        this.token_allowed = true;
      }else{
        this.token_allowed=false;
        this.resetPasswordForm.controls['token'].setValue(this.fogotPasswordForm.controls['userName'].value);
      }
      // this.commonFunction.presentAlert('Reset Password', 'Successful','Temporary password has been sent to your email. Please be advised that you will be required to reset this password upon login','ok')
      // this.router.navigate(['/new-login']);
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

  backToLogIn(){
    this.router.navigate(['/new-login']);
    this.tokenSent = false;
  }

  resetPassword(){
    let userName = this.resetPasswordForm.controls['userName'].value
    if(userName==null){
      this.commonFunction.presentToast("Please fill in Customer Number", 3000,'');
      return
    }

    let that= this, requestData,postData;
    requestData={
      custNo: userName.trim(),
      token: this.resetPasswordForm.controls['token'].value,
      password: this.resetPasswordForm.controls['password'].value,
      purpose:'NEW_PASSWORD'
    }
    postData={
      requestData:requestData,

  
    }

    this.sendRequestToServer(
      'MobileAppManagement',
      'updatePasswordWithToken',
      JSON.stringify(postData),
      function(response){
        that.handleResponseResetPassword(response);
        console.log(response);
      },
      function(err) {
        //  console.log( err.message)//Error handler
        that.commonFunction.presentAlert('Process Failed', 'Error','Try Agein', 'Ok');
      });
    
  }

  handleResponseResetPassword(response){
    if(response.returnCode!==0){
      this.commonFunction.presentAlert("Reset Password", "Error", response.returnMessage, 'ok')
    }else{
      this.commonFunction.presentToast(response.returnMessage, 7000, '');
      // this.tokenSent = true;
      // this.commonFunction.presentAlert('Reset Password', 'Successful','Temporary password has been sent to your email. Please be advised that you will be required to reset this password upon login','ok')
      this.router.navigate(['/new-login']);
    }

  }


  iHaveAToken(){
    this.tokenSent = true;
  }
}
