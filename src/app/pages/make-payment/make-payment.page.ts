import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ModalController, Platform, IonRouterOutlet, ToastController, NavController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';

import { Plugins } from '@capacitor/core';

const { Storage, Browser  } = Plugins; 

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.page.html',
  styleUrls: ['./make-payment.page.scss'],
})
export class MakePaymentPage extends LoginService {
  validation_messages = {
    paymentMethod:[
      {type: 'required', message:'Please select Channel'} 
    ],
    phoneNumber:[
      // {type: 'required', message:'Phone Number is required'},
      // {type:'pattern', message: 'Please fill in a valid phone number'}
    ],
    amount:[
      {type: 'required', message:'Amount is required'}, 
      {type: 'max', message: 'The amount has to below 4,000,000'},
      {type: 'min', message: 'The amount should be above 1,000'}
    ],
    customerNumber:[
      {type: 'required', message:'Member Number is required'} 
    ],
  }

  paymentForm: FormGroup;
  channelLogo:any;
  token:any;
  branchId:any;
  custNo:any;
  id:any;
  name:any;
  institution:any;
  institutionName:any;
  custTypeId: any;
  customPopoverOptions:any;

  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;

  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    private fb: FormBuilder,
    public platform: Platform,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    public toastController: ToastController,
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public alertController: AlertController,
  ) { 
    super(http, helper, loadingController);

    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        this.router.navigate(['/menu/home-tabs/tabs/home']);
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

  async ngOnInit() {
    super.ngOnInit();

         //#################### Get Storage Data #####################################
         const ret = await Storage.get({ key: 'userData' });
         const user = JSON.parse(ret.value);
         this.token=user.token;
         this.branchId = user.branchId;
         this.custNo=user.custNo;
         this.id=user.id;
         this.name= user.name;
         this.institution = user.institution;
         this.institutionName = user.institutionName;
         this.custTypeId= user.custTypeId;
         console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||')
         console.log(user)
         //#################### End Storage Data #####################################
     
         this.paymentForm = this.fb.group({
          /* 
            amount
            customerNumber
            firstName
            lastName
            network  --> "AIRTEL":"MTN"
            payment_method --> "AIRTEL MONEY":"MTN MONEY"
            phoneNumber --> phoneNumber
            reason
             */
            payment_method: new FormControl(null, Validators.compose([Validators.required])), //"AIRTEL MONEY":"MTN MONEY"
            phoneNumber: new FormControl(),
            amount: new FormControl(null, Validators.compose([
                Validators.required,
                // Validators.min(1000),
                // Validators.max(4000000)
            ])),
            customerNumber: new FormControl(null, Validators.required),
            fullName: [''],
            firstName: new FormControl(),
            lastName: new FormControl(),
            email: new FormControl(),
            customerAccountNumber: new FormControl(),
            product: new FormControl(),
            network: new FormControl(),
            reason: new FormControl('Deposit')
        });
    
        this.paymentForm.controls['customerNumber'].setValue(this.custNo);
        this.getProducts();
  }

  /**
 * Channel Code on selection change
 * @param event 
 */
onChannelChange(event){
  console.log(event.target.value,"event.target.value");
  if (event.detail.value === 'MTN MONEY') {
    this.channelLogo = '../../assets/img/mtn_money.jpg';
} else if (event.detail.value === 'AIRTEL MONEY') {
    this.channelLogo = '../../assets/img/airtel_money.jpg';
} else {
    this.channelLogo = null;
}


  this.paymentForm.controls.phoneNumber.clearValidators();
  if (event.target.value === 'AIRTEL MONEY') {

    this.paymentForm.controls.phoneNumber.setValidators([
        Validators.required,
        Validators.pattern('^07[0|5|4]{1}[0-9]{7}$')
    ]);
    this.validation_messages.phoneNumber = [
        {type: 'required', message: 'Phone Number is required a'},
        {type: 'pattern', message: 'Provide a valid Airtel number 070******* or 075******* or 074*******'}
    ];
    this.paymentForm.controls.network.setValue("AIRTEL")
    console.log(this.paymentForm.controls.network);

} else if (event.target.value === 'MTN MONEY') {

    this.paymentForm.controls.phoneNumber.setValidators([
        Validators.required,
        Validators.pattern('^07[7|8|6]{1}[0-9]{7}$')
    ]);
    this.validation_messages.phoneNumber = [
        {type: 'required', message: 'Phone Number is required'},
        {type: 'pattern', message: 'Provide a valid Mtn number 077******* or 078******* or 076*******'}
    ];
    this.paymentForm.controls.network.setValue("MTN");
    console.log(this.paymentForm.controls.network);

}
this.paymentForm.controls.phoneNumber.updateValueAndValidity();
}

getProducts(){
  let that=this, auth, postData;
  auth ={
    token: this.token,
    username: this.custNo,
    type:"mobile",
    instituition: this.institution
  }

  postData = {
    auth,
    requestData: {
      customerNumber:this.custNo, 
      sortField:'Q.created_on', 
      sortOrder:'DESC'
    }
    
  }

  this.sendRequestToServer(
    "PaymentsManagement",
    "getProductAccountNumbers",
    JSON.stringify(postData),
    function(response){
      that.productsResponse(response);
    },
    function(err){
      console.log(err);
    }
  );

}

productsResponse(response){
  if(response.returnData.length > 0){
    this.paymentForm.controls.product.setValue(response.returnData[0].prod_id);
    this.paymentForm.controls.customerAccountNumber.setValue(response.returnData[0].acct_no);
    this.paymentForm.controls.firstName.setValue(response.returnData[0].customer_name.split(' ')[0]);
    this.paymentForm.controls.lastName.setValue(response.returnData[0].customer_name.split(' ')[1]);
    this.paymentForm.controls.email.setValue(response.returnData[0].email);
    this.paymentForm.controls.fullName.setValue(response.returnData[0].customer_name)
  }else{

  }
  // console.log(response);
}


/**
 * get payment ref number
 */
getPaymentRefNoData(){
  let auth, that=this, postData;
  auth ={
    token: this.token,
    username: this.custNo,
    type:"mobile",
    instituition: this.institution
  }

  postData = {
    auth,
    requestData: {
      customerNumber:this.custNo, 
      sortField:'Q.created_on', 
      sortOrder:'DESC'
    }
    
  }

  this.sendRequestToServer(
    "PaymentsManagement",
    "getPaymentRefNoData",
    JSON.stringify(postData),
    function(response){
      that.paymentRefNoDataResponse(response);
    },
    function(err){
      console.log(err);
    }
  )
}

commas = () => {
  this.paymentForm.controls.amount.setValue(this.numberWithCommas(this.paymentForm.controls.amount.value))
}
 numberWithCommas(x) {
   return x.replace(/\D/g, "")
   .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
paymentRefNoDataResponse(response){
  if(response.returnData > 0){
    this.paymentForm.controls.amount.setValue(response.returnData[0].expected_amount);
    this.paymentForm.controls.firstName.setValue(response.returnData[0].customer_name.split(' ')[0]);
    this.paymentForm.controls.lastName.setValue(response.returnData[0].customer_name.split(' ')[1]);
    // this.paymentForm.controls.firstName
    // this.paymentForm.controls.firstName

  }else{

  }
  // console.log(response)
}



/**
 * making payment using flutterwave 
 * 
 */

 submit(){
  const amount = this.removeCommas(/(,)/, this.paymentForm.controls.amount.value);
  console.log(amount);
  this.paymentForm.controls.amount.setValue(amount);
   let postData, that= this, auth;
   auth = {   
        token: this.token,
        username: this.custNo,
        type:"mobile",
        instituition: this.institution
      }
   postData = {
     auth,
     requestData:this.paymentForm.value      
   }

   this.commonFunction.presentLoading("Loading...", 5000, 'md','crescent')
   this.sendRequestToServer(
     "SasulaMoMo",
     "initiateMoMoTransaction",
     JSON.stringify(postData),
     function(response){
      that.submitResponse(response)
      that.commonFunction.closeLoading();
     },
     function(err){
      console.log(err)
      that.commonFunction.closeLoading();
      that.commonFunction.presentToast('Payment Failed!! Sorry, this payment cannot be completed at this time. Please try again later', 5000, '');
     }
   )
}

async submitResponse(response){
  this.commonFunction.closeLoading();
  if(response.returnCode == 0){
    this.commonFunction.presentToast('Payment Successfully. You Will Receive prompt for your pin to complete transaction', 7000, 'success');
    this.paymentForm.controls.amount.reset();
    this.paymentForm.controls.phoneNumber.reset();
    this.paymentForm.controls.payment_method.reset();
  }else{
    // this.commonFunction.presentToast('Payment Failed!!' + response.returnMessage, 5000, '');
    setTimeout(() => {
      this.commonFunction.presentToast(response.returnMessage, 6000, 'danger');
  }, 5000);
  }
  
}



async presentAlertConfirm() {
  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Confirm',
    message: '<strong>Deposit Amount of UGX '+this.paymentForm.controls['amount'].value+' for '+
     this.paymentForm.controls['lastName'].value+
     ' '+this.paymentForm.controls['firstName'].value+' - ' + this.paymentForm.controls['customerNumber'].value+ ' Are you sure that you want to proceed?</strong>',
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          // console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Yes',
        handler: () => {
          this.submit();
          // console.log('Confirm Okay');
        }
      }
    ]
  });

  await alert.present();
}



//  /**
//  * Sending payment request
//  */
// submit(){
//   this.commonFunction.presentLoading("Sending request...", 2000, 'md','lines-small');
//   var postData,auth,that;
  
//   auth = {
//     token: this.token,
//     username: this.custNo,
//     type:"mobile",
//     instituition: this.institution
//   }
//   postData = {
//     auth:auth,
//     phoneNumber:this.paymentForm.controls['phoneNumber'].value,
//     amount: this.paymentForm.controls['amount'].value,
//     paymentReference:this.paymentForm.controls['paymentReference'].value,
//     channelCode:this.paymentForm.controls['channelCode'].value,
//   }

//   // console.log(postData);
//   that = this;
//   this.sendRequestToServer(
//     "COVID",
//     "sendPaymentRequest",
//     JSON.stringify(postData),
//     function(response){
//       that.handlePaymentRequest(response);
//     },
//     function(err){
//       that.loadingController.dismiss();
//       // console.log(err.message);
//       that.commonFunction.closeLoading();
//       that.commonFunction.checkNetworkConectivity();
//     });
// }


//   /**
//    * 
//    * @param response 
//    */
//   handlePaymentRequest(response){
//     this.channelLogo = null;
//     if(response.returnCode != 0){
//       this.commonFunction.closeLoading();
//       this.commonFunction.presentAlert("Failed", "Payment Request", response.returnMessage, 'OK' );
//     }else{
//       this.commonFunction.closeLoading();
//       this.commonFunction.presentAlert("Successful", "Payment Request", response.returnMessage, 'OK' );
//       this.paymentForm.reset();
//       this.paymentForm.controls['paymentReference'].setValue(this.custNo);
//     }
  
//   }

}
