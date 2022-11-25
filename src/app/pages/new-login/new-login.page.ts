import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  ModalController,
  Platform,
  LoadingController,
  AlertController,
  NavController,
  IonRouterOutlet,
  MenuController,
} from "@ionic/angular";
import { Plugins } from "@capacitor/core";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "src/app/services/helper.service";
import { LoginService } from "src/app/services/login.service";
import { LoaderServiceService } from "src/app/services/loader-service.service";
import { CommonFunctions } from "src/app/services/CommonFunctions";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LoginModalPage } from '../login-modal/login-modal.page';
import { post } from "jquery";

const { Device, SplashScreen, Storage, Clipboard } = Plugins;

@Component({
  selector: "app-new-login",
  templateUrl: "./new-login.page.html",
  styleUrls: ["./new-login.page.scss"]
})
export class NewLoginPage extends LoginService {
  validation_messages = { 
    userName: [
      { type: "required", message: "Account number is required." },
      {
        type: "pattern",
        message: "Email must be in this format your@email.com"
      }
    ],

    password: [{ type: "required", message: "Password is required." }],
    customerNumber: [
      { type: "required", message: "Member Number is required." }
    ],
    pin: [
      { type: "required", message: "Password is required." }
      // { type: 'pattern', message: 'Pin length should be of 5 digits' }
    ],
    custNo: [{ type: "required", message: "Member Number is required." }],
    Rpin: [
      { type: "required", message: "Create a password." },
      { type: "minLength", message: "The length should be of 5 digits" },
      // { type: 'maxLength(7)', message: 'The length should be of 5 digits'},
      {
        type: "pattern",
        message:
          "Password must contain at least one lowercase, one upper case one number and at least eight characters long"
      }
    ],
    token:[
      { type: "required", message:"Please enter token sent to your email"}
    ],
    confirmPin: [
      { type: "required", message: "Please confirm your password." },
      { type: "minLength", message: "The length should be of 5 digits" },
      { type: "length", message: "The length should be of 5 digits" },
      // { type: 'maxLength(5)', message: 'The length should be of 5 digits'},
      { type: "pattern", message: "Passwords do not match" }
    ]
  };

  deviceId: any;
  status:any;
  loginForm: FormGroup;
  registrationForm: FormGroup;
  sendTokenForm: FormGroup;
  createPasswordWithTokenForm: FormGroup;
  loading: any;
  customerImage: any;
  loginbtn: any = "block";
  displayCustomer: any = "block";
  displayCustomerRegistration: any = "none";
  displayAgent: any = "none";
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  token_allowed:boolean = true;
  token_sent: boolean = false;
  isPasswordSeen:boolean=false;
  isCreatePasswordSeen: boolean=false;
  isConfirmPasswordSeen: boolean=false

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
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    private alertCtrl: AlertController,
    private authService: AuthService,
    public navCtrl: NavController,
    private menu: MenuController,
    
  ) {
    super(http, helper, loadingController);

    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/new-login') {
        navigator['app'].exitApp();
      } else {
      }
    });

    // this.backButton();
  }

   async ngOnInit() {
    super.ngOnInit();
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    const info = await Device.getInfo();
    this.deviceId = info.uuid;
  

    this.sendTokenForm = this.fb.group({
      custNo: new FormControl('', Validators.compose([Validators.required])),
    });

    this.createPasswordWithTokenForm = this.fb.group({
      custNo: new FormControl(),
      token: new FormControl(),
      Rpin: new FormControl(),
      confirmPin: new FormControl()
    },
      {
        validator: this.ConfirmPassword
      }
      );

    this.loginForm = this.fb.group({
      userName: new FormControl(null),
      password: new FormControl(null),
      deviceId: new FormControl(this.deviceId),
      customerNumber: new FormControl(null),
      pin: new FormControl(null),
      status: new FormControl(null)
    });

    this.registrationForm = this.fb.group(
      {
        custNo: new FormControl(),
        confirmPin: new FormControl(),
        Rpin: new FormControl()
      },
      {
        validator: this.MatchPassword
      }
    );
    const usernameFormControl = this.loginForm.get("userName");
    const passwordFormControl = this.loginForm.get("password");
    const customerNumberFormControl = this.createPasswordWithTokenForm.get("custNo");
    const pinFormControl = this.createPasswordWithTokenForm.get("Rpin");
    const RpinFormControl = this.createPasswordWithTokenForm.get("confirmPin");
    const tokenControl = this.createPasswordWithTokenForm.get("token");
    const custNoControl = this.registrationForm.get("custNo");
    const RpinControl = this.registrationForm.get("Rpin");
    const confirmPinControl = this.registrationForm.get("confirmPin");



      custNoControl.setValidators([Validators.required]);
      RpinControl.setValidators([
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")
      ]);
      confirmPinControl.setValidators([
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")
      ]);

      usernameFormControl.setValidators(Validators.required);
      passwordFormControl.setValidators(Validators.required);

      customerNumberFormControl.setValidators([Validators.required]);
      tokenControl.setValidators([Validators.required]);
      pinFormControl.setValidators([Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")]);
      RpinFormControl.setValidators([Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")]);


   
  }

  private MatchPassword(AC: AbstractControl) {
    const newPassword = AC.get("Rpin").value; // to get value in input tag
    const confirmPassword = AC.get("confirmPin").value; // to get value in input tag
    if (newPassword !== confirmPassword) {
      AC.get("confirmPin").setErrors({ MatchPassword: true });
    } else {
      AC.get("confirmPin").setErrors(null);
    }
  }

  private ConfirmPassword(AC: AbstractControl){
    const newPassword = AC.get("Rpin").value; // to get value in input tag
    const confirmPassword = AC.get("confirmPin").value; // to get value in input tag
    if (newPassword !== confirmPassword) {
      AC.get("confirmPin").setErrors({ ConfirmPassword: true });
    } else {
      AC.get("confirmPin").setErrors(null);
    }
  }

  overlay(message) {
     this.loadingController
      .create({
        message: message, 
        duration: 10000
      })
      .then(overlay => {
        this.loading = overlay;
        this.loading.present();
      });
  }

  institutionSelfReg() {
    this.router.navigate(['/institution-self-registration']);
    
  }

  qrScanner(){
    this.router.navigate(['/qr-scanner']);
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Select Registration Type',
      inputs: [
        {
          name: 'customer-self-registration',
          type: 'radio',
          label: 'Member',
          value: 'customer-self-registration',
          checked: true
        },
        {
          name: 'institution-self-registration',
          type: 'radio',
          label: 'Institution',
          value: 'institution-self-registration'
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertData) => {
            if (alertData === 'institution-self-registration') {
              this.router.navigate(['/institution-self-registration-tab']);
            } else {
              this.router.navigate(['/self-registration']);


            }
          }
        }
      ]
    });

      await alert.present();
  }


  login() {
    
    this.loginForm.controls["status"].setValue(this.status)
    this.loginForm.controls["deviceId"].setValue(this.deviceId);
    // this.overlay("Authenticating....");
    let type = null;
    let requestData = this.loginForm.value;
    requestData.userName = requestData.userName.trim();
    if (this.loginForm.invalid) {
      return;
    }
    let postData = {
      requestData: requestData
    };

    var controller = this;

    this.sendRequestToServer(
      "MobileAppManagement",
      "login",
      JSON.stringify(postData),
      function(response) {
        controller.handleResponse(response, "login");
      },
      function(err) {
      }
    );
  }

  registration() {
   // this.overlay("Registering....");

    let requestData = this.registrationForm.value;
    requestData.custNo = requestData.custNo.trim();

    if (this.registrationForm.invalid) {
      return;
    }
    let postData = {
      requestData: requestData
    };

    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "registerCustomer",
      JSON.stringify(postData),
      function(response) {
        that.handleRegistration(response);
      },
      function(err) {
      }
    );
  }

  async customerLoginError(response) {
    // this.loading.dismiss();
    let data = {
      title: "Authentication Error",
      message: response.returnMessage
    };
    let alert = await this.alertCtrl.create({
      header: data.title,
      message: data.message,
      buttons: ["OK"]
    });
    alert.present();
  }

  async customerRegistrationError(response) {
    // this.loading.dismiss();
    let data = {
      title: "Registration Failed",
      message: response.returnMessage
    };
    let alert = await this.alertCtrl.create({
      header: data.title,
      message: data.message,
      buttons: ["OK"]
    });
    alert.present();
  }

  async customerRegistrationSuccess(response) {
    // this.loading.dismiss();
    let data = {
      title: "Registered Successfully",
      message: response.returnMessage
    };
    let alert = await this.alertCtrl.create({
      header: data.title,
      message: data.message,
      buttons: ["OK"]
    });
    alert.present();
  }

  writeToStorage(response, type) {
    let row = null;
    if (type === "customer") {
      row = {
        active: response.returnData.returnData.customerData.active,
        branchId: response.returnData.returnData.customerData.branchId,
        custNo: response.returnData.returnData.customerData.custNo,
        id: response.returnData.returnData.customerData.id,
        institution: response.returnData.returnData.customerData.institution,
        name: response.returnData.returnData.customerData.name,
        pin: response.returnData.returnData.customerData.pin,
        token: response.returnData.returnData.token,
        institutionName:
          response.returnData.returnData.institution.institutionName,
        theme: response.returnData.returnData.institution.theme,
        institutionRefNumber:
          response.returnData.returnData.institution.institutionRefNumber,
        custTypeId: response.returnData.returnData.customerData.custTypeId,
        username: response.returnData.returnData.userName,
        status:this.status,
        institutionTypeId: response.returnData.returnData.institution.institutionTypeId
      };
    } else {
      let respData = response.returnData.ReturnData.returnData;
      console.log(respData.institutionType, '---respData---');
    
      if (respData.institution && respData.institution !== null) {
    
        this.user.institution = respData.institution;
        this.user.branchName = respData.branchName;
        this.user.institutionId = respData.userData.instituition;
      }
      let userData = respData.userData;
      this.user.username = userData.userName;
      this.user.userData = userData;
      this.user.authenticationToken = respData.token;
      
      
      row = {
        username: userData.userName,
        token: respData.token,
        status: this.status,
        institutionId: respData.userData.instituition,
        institutionTypeId:respData.institutionType

      };
    }
    this.setObject(row);
  }

  async alertMessage(title, message) {
    let data = { title: title, message: message };
    let alert = await this.alertCtrl.create({
      header: data.title,
      message: data.message,
      buttons: ["OK"]
    });
    alert.present();
  }

  handleResponse(response, request) {
    if (response.returnCode !== 0) {
      
      this.customerLoginError(response);
      this.loginForm.controls["userName"].reset();
      this.loginForm.controls["password"].reset();
      this.loginForm.controls["customerNumber"].reset();
      this.loginForm.controls["pin"].reset();

      return;
    } else {
      let data = response.returnData;
      console.log(data, '---Data----');
      this.loginForm.reset();
      
      if (request == "login") {
        if (response.returnData.status == false) {
          
          if(response.returnData.returnData.customerData.resetRequired){
            this.openModal(data.returnData.token, response.returnData.returnData.customerData.custNo);
            return
          }
          this.writeToStorage(response, "customer");
          this.menuRestrict("customer");
          let auth = {
            token: response.returnData.returnData.token,
            username: response.returnData.returnData.customerData.custNo,
            type: "mobile"
          };
          console.log(auth);
          let postData = {
            auth: auth
          };
          var that = this;
          this.sendRequestToServer(
            "MobileAppManagement",
            "customerPic",
            JSON.stringify(postData),
            function(response) {
              that.handleResponseCustPic(response);
            },
            function(err) {
              
            }
          );
          console.log(auth);
        } else if (response.returnData.status == true) {
          if (data.licenseValue === false) console.log(data.licenseValue);
          this.helper.licenseStatus = data.licenseValue;
          this.writeToStorage(response, "agent");
          this.menuRestrict("agent");
        } else {
        }
      }
    }
    let respData = response.returnData;
  }

  async handleResponseCustPic(response) {
 console.log(response);
    if(response.returnData) {
      this.customerImage = response.returnData.custPhoto;

    }

    await Storage.set({
      key: "userPic",
      value: JSON.stringify({ customerImage: this.customerImage })
    });
  }

  handleRegistration(response) {
    // let data = response.returnData;

   
    if (response.returnCode !== 0) {
      this.customerRegistrationError(response);

      this.registrationForm.reset();
      // let data = {title: "Ragistration failed", message:response.returnMessage};
    
      return;
    } else {
      this.loginbtn = "block";
      this.displayCustomer = "block";
      this.displayCustomerRegistration = "none";
      this.customerRegistrationSuccess(response);
      
    }
  }

  handleResponseDetails(response) {
  
    this.customerImage = response.returnData.custPhoto;
  }

  register(event) {
    event.preventDefault();
    this.displayAgent = "none";
    this.displayCustomer = "none";
    this.loginbtn = "none";
    this.displayCustomerRegistration = "block";
  }

  async setObject(row) {
    await Storage.set({
      key: "userData",
      value: JSON.stringify(row)
    });
  }

  menuRestrict(value: string) {
    this.authService
      .user_check(value)
      .then(success => {
        if (success) {
          this.loginService.dismiss();       
          if(value === "customer") {
            this.navCtrl.navigateForward("/menu/home-tabs");
          }else if(value === "agent") {
            this.navCtrl.navigateForward("/menu/agent-dashboard");
          } else {
            console.log("no redirect")
          }
          
        }
        
      })
      .catch(async err => {
        console.log(err);
        let alert = await this.alertCtrl.create({
          message: "Please check your credentials" + err,
          buttons: ["OK"]
        });
        await alert.present();
      });
  }

  async uniqueNo() {
    let controller = this;
    let alert = await this.alertCtrl.create({
      header: "Device Number",
      message: this.deviceId,
      buttons: [
        {
          text: "Copy To Clipboard",
          handler: () => {
            controller.clipboard();
          }
        }
      ]
    });
    await alert.present();
  }

  async clipboard() {
    let device_number: string = this.deviceId;
 

    Clipboard.write({
      string: device_number
    });
  }

  async getDeviceDetails() {
    const info = await Device.getInfo();
    this.deviceId = info.uuid;
    this.checkDeviceId(this.deviceId);
    
  
    if (this.status == false) {
      this.displayCustomer = "block";
    } else if (this.status == true) {
      this.displayAgent = "block";
    }
  }

  async checkDeviceId(Id) {
    
    let postData = { deviceId: Id };

    var controller = this;

    this.sendRequestToServer(
      "MobileAppManagement",
      "checkMobileUserType",
      JSON.stringify(postData),
      async function(response) {
        if (response.returnCode === 0) {
          controller.status = await response.returnData;
        
        } else {
        }
      },
      function(err) {
      }
    );
  }

  selfReg() {
    // this.navCtrl.navigateForward("/self-registration");
    this.presentAlert();
  }

  backToLogIn(){
    this.displayAgent = "none";
    this.displayCustomer = "block";
    this.loginbtn = "block";
    this.displayCustomerRegistration = "none";
    this.token_allowed = true;
    this.token_sent = false;

  }


  async forgotPassword(event) {
    event.preventDefault();
    
    this.router.navigate(['/forgot-password']);
    // let userName = this.loginForm.controls['userName'].value
    // if(userName==null){
    //   this.commonFunction.presentToast("Please fill in Customer Number", 3000);
    //   return
    // }

    // let that= this, requestData,postData;
    // requestData={
    //   custNo: userName,
    //   password:this.rendomPasswordGenerator(8),
    // }
    // postData={
    //   requestData:requestData,
  
    // }

    // this.sendRequestToServer(
    //   'MobileAppManagement',
    //   'custNoToresetPassword',
    //   JSON.stringify(postData),
    //   function(response){
    //     that.handleResponseForgotPassword(response);
    //     console.log(response);
    //   },
    //   function(err) {
    //     //  console.log( err.message)//Error handler
    //     that.commonFunction.presentAlert('Process Failed', 'Error','Try Agein', 'Ok');
    //   });
  }


  handleResponseForgotPassword(response){
    if(response.returnCode!==0){
      this.commonFunction.presentAlert("Reset Password", "Error", response.returnMessage, 'ok')
    }else{
      this.commonFunction.presentAlert('Reset Password', 'Successful','Temporary password has been sent to your email. Please be advised that you will be required to reset this password upon login','ok')
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


  sendPasswordToken(){
    let that = this, postData, auth, requestData;
    auth={}

    if (this.sendTokenForm.invalid) {
      return;
    }

    requestData ={
      custNo: this.sendTokenForm.controls['custNo'].value,
      purpose: "NEW_ACCOUNT",
      auth: auth,
    }
    postData = {
      requestData
    }

    this.sendRequestToServer(
      "MobileAppManagement",
      "sendPasswordCreationOrResetToken",
      JSON.stringify(postData),
      function(response) {
        that.passwordTokenResponse(response);
      },
      function (err) {
        console.log(err)
      }
    )
  }

  passwordTokenResponse(response){
    console.log(response)
    if(response.returnCode !== 0){
      this.commonFunction.presentToast(response.returnMessage, 5000, 'danger');
    }else{
      //  token_allowed:boolean = true;
      // token_sent: boolean = false;
      this.createPasswordWithTokenForm.controls['custNo'].setValue(this.sendTokenForm.controls['custNo'].value);
      this.registrationForm.controls['custNo'].setValue(this.sendTokenForm.controls['custNo'].value);
      
      if (response.returnData.allowPinToken){
        this.commonFunction.presentToast(response.returnMessage, 5000, '');
        this.token_allowed = true;
        this.token_sent = true;
      }else{
        this.token_allowed = false;
        this.token_sent = true;
      }
    }
  }

  createPasswordWithToken(){
    let that = this, postData, auth, requestData;
    auth={}

    if (this.createPasswordWithTokenForm.invalid) {
      return;
    }
    requestData = this.createPasswordWithTokenForm.value
    requestData.purpose="NEW_ACCOUNT"
    requestData.auth= auth;
    requestData.password = requestData.Rpin;
    postData ={
      requestData
    }
    console.log(requestData);
    // alert(JSON.stringify(this.createPasswordWithTokenForm.controls['confirmPin'].errors));
    this.sendRequestToServer(
      "MobileAppManagement",
      "updatePasswordWithToken",
      JSON.stringify(postData),
      function(response){
        that.createPasswordResponse(response);
      },
      function (err) {
        console.log(err);
      }
    )
  }

  createPasswordResponse(response){
    if(response.returnCode != 0){
      this.commonFunction.presentToast(response.returnMessage, 5000, 'danger')
    }else{
      this.commonFunction.presentToast(response.returnMessage, 5000, '')
      this.registrationForm.reset();
      this.createPasswordWithTokenForm.reset();
      this.sendTokenForm.reset();
      this.loginbtn = "block";
      this.displayCustomer = "block";
      this.displayCustomerRegistration = "none";
      this.token_allowed = true;
      this.token_sent = false;
    }
  }





  async openModal(token, custNo) {
    const modal = await this.modalController.create({
      component: LoginModalPage,

      componentProps: {
        'token': token,
        'custNo': custNo,
      }

    });
    
    // console.log(this.status)
   // console.log(modal)
    return await modal.present();
  }


  iHaveAToken(){
    this.token_allowed = true;
    this.token_sent = true;
  }


  backButton() {
    const that = this;
    let lastTimeBackPress = 0;
    const timePeriodToExit = 2000;
    function onBackKeyDown(e) {
        e.preventDefault();
        e.stopPropagation();
        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
            navigator['app'].exitApp();
        } else {
            // that.menu.close();
            // that.modalController.dismiss();
            // alert(that.router.url);
            // if(that.router.url === "/menu/home"){

              that.commonFunction.presentToast("Press again to exit", 1000, '');
            //   lastTimeBackPress = new Date().getTime();

            // }else if( that.router.url=== "/account"){
            //   that.router.navigateByUrl('/menu/home');
            //   // return;
            // }else{
            //   // return;
            // }



        }
    }
    document.addEventListener('backbutton', onBackKeyDown, false);
  }


 
}
