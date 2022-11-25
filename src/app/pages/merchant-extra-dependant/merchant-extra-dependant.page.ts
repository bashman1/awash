import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { LoginService } from 'src/app/services/login.service';
import { Plugins } from "@capacitor/core";
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { post } from 'jquery';

const { Storage } = Plugins;

@Component({
  selector: 'app-merchant-extra-dependant',
  templateUrl: './merchant-extra-dependant.page.html',
  styleUrls: ['./merchant-extra-dependant.page.scss'],
})
export class MerchantExtraDependantPage extends LoginService {
paymentRef:any;
verifiedPaymentReference:any={};
extraDependentFormGp: FormGroup;
selectedPackage:any = {};
paymentRefNumber:any = {};
showPaymentRef: Boolean = false;


validation_messages = {
  custNo: [
    { type: "required", message: "Member number is required." },
    // {type: "pattern", message: "Email must be in this format your@email.com"}
  ],
  extraDependants:[
    { type: "required", message:"Please enter number of dependents "},
    {type: "pattern", message: "Please enter a valid number of dependents"}

  ],

 }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    private authService: AuthService,
    public navCtrl: NavController,
    private fb: FormBuilder,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    public platform: Platform,
    public loadingController: LoadingController,
    private route: ActivatedRoute,
  ) {
    super(http, helper, loadingController);
    this.paymentRef = this.route.snapshot.paramMap.get('paymentRef');
    console.log(this.paymentRef);
  }

  async ngOnInit() {
    super.ngOnInit();

    //#################### Storage Data #####################################
    const ret = await Storage.get({ key: 'userData' });
    const user = JSON.parse(ret.value);
    this.token = user.token;
    this.branchId = user.branchId;
    this.custNo = user.custNo;
    this.id = user.id;
    this.name = user.name;
    this.institution = user.institution;
    this.institutionName = user.institutionName;
    this.checkPaymentReference();

    this.extraDependentFormGp=this.fb.group({
      extraDependants: new FormControl('', Validators.compose([Validators.required])),
      custNo: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[1-9]\d*$')])),
      paymentReference: new FormControl(''),
      packageId: new FormControl(''),
      merchantCategories: new FormControl(''),
      expectedAmount: new FormControl(''),
    })
  }

  /**
   * 
   */
  checkPaymentReference=()=>{
    let search, auth, postData, that= this;
    auth ={
      token: this.token,
      username: this.custNo,
      type:"mobile"
    }

    search ={
      searchWord :'validatePaymentReference',
      paymentStatus:'Paid',
      paymentReference: this.paymentRef,
      sortField:'cust_no',
    }

    postData ={
      auth,
      search
    }

    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response){
        that.handlePaymentRequest(response)
      },
      function(error){

      }
    )
  }

  handlePaymentRequest(response){
    if(response.returnCode == 0){
      this.verifiedPaymentReference = response.returnData.rows[0];
      console.log(this.verifiedPaymentReference);
      console.log(response.returnData.rows);
      // alert(JSON.stringify(this.verifiedPaymentReference));
      this.getPackage(this.verifiedPaymentReference.merchant_id, this.verifiedPaymentReference.institution_id)
    }else{
      this.commonFunction.presentAlert('Process Failed', '', response.returnMessage, 'OK');
    }

  }


  getPackage(merchant_id, institution_id){
    let search, auth, postData, that=this;
    auth ={
      token: this.token,
      username: this.custNo,
      type:"mobile"
    }

    search ={
      searchWord:'getMerchantPackages',
      merchantId:merchant_id,
      institutionId:institution_id,
      status:'Active',
    }

    postData ={
      auth,
      search
    }

    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response){
        that.handlePackageResponse(response);
      },
      function(err){
      }
    )

  }

  handlePackageResponse(response){
    if(response.returnCode !=0 ){
      this.commonFunction.presentAlert('Process Failed', 'Error', response.returnMessage, 'OK')
    }else{
      this.selectedPackage = response.returnData.rows[0];
      // console.log('**************************************');        
      // console.log(this.selectedPackage);
      if(!this.selectedPackage.cost_per_additional_dependant){
        this.commonFunction.presentAlert('Process Failed', 'Error', 'Addition of dependents is not allowed for this package. Contact your institution administrator for more information', 'OK')
      }
    }
  }


  generateRefNo(){
    let postData, auth, search, requestData, that=this, amountToPay;
    amountToPay = (this.extraDependentFormGp.controls['extraDependants'].value * this.selectedPackage.cost_per_additional_dependant);
    this.extraDependentFormGp.controls['paymentReference'].setValue(this.verifiedPaymentReference.payment_reference);
    this.extraDependentFormGp.controls['packageId'].setValue(this.verifiedPaymentReference.package_id);
    this.extraDependentFormGp.controls['merchantCategories'].setValue(this.verifiedPaymentReference.service_id);
    this.extraDependentFormGp.controls['custNo'].setValue(this.verifiedPaymentReference.cust_no);
    this.extraDependentFormGp.controls['expectedAmount'].setValue(amountToPay);
    auth ={
      token: this.token,
      username: this.custNo,
      type:"mobile"
    }
    search = {
      searchWord: 'generatePaymentReference',
      institutionId: this.verifiedPaymentReference.institution_id
    }

    postData = {
      auth,
      search,
      requestData: this.extraDependentFormGp.value
    }

    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response){
        that.handleGenerateRefNoResponse(response);
      },
      function(error){

      }
    )

  }


  handleGenerateRefNoResponse(response){
    console.log('**************************************');        
    console.log(response)

    if(response.returnCode != 0){
      this.commonFunction.presentAlert("Process Failed", "Error", response.returnMessage, 'OK');
    }else{
      this.paymentRefNumber = response.returnData;
      this.commonFunction.presentToast('Payment reference generated successfully.', 3000, '');
      this.showPaymentRef = true
      // this.navCtrl.navigateForward('/menu/merchant-history');

    }
  }


     // "react": "16.8.6",
    // "react-native": "0.60.5",



}
