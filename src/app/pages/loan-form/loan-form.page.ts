import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform, IonRouterOutlet,ToastController, NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { LoginService } from 'src/app/services/login.service';
import { Plugins } from "@capacitor/core";
import { AkkountingNew } from '../classes/akkounting-new';
import { Akkounting } from '../classes/Akkounting';
import { Any } from 'json2typescript';
// import { from } from 'rxjs';

const { Storage } = Plugins;

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.page.html',
  styleUrls: ['./loan-form.page.scss'],
})
export class LoanFormPage extends LoginService {
  loanApplicationFormGp: FormGroup;
  token:any;
  branchId:any;
  custNo:any;
  id:any;
  name:any;
  institution:any;
  institutionName:any;
  custTypeId: any;
  incomeSources:any=[];
  openingReasons:any=[];
  productList:any =[];
  industries:any=[];
  loanDetails:any={};
  applicationResults:any={};
  repaymentCycle:any = [];
  listLoanPurpose:any=[];
  listIncomeSources:any=[];
  amountError:any=[];
  

  pricipalAmount: any;
  timeAmount: any;
  interestRate: any;
  paymentFrequencyVal: any;
  timeIn: any;
  interestFrequency: any;
  maxLoanDuration: any;
  memberamountsinvalid: boolean;
  maxLoanDurationUnit: any;
  durationAfterConversion: any;
  repaymentCycleBound:boolean = false;
  cycleMessage='';
  loginType:String;
  status:boolean = true;

  //formerros
  formErrors = {
    loanPrincipal: '',
    termsAndConditions: '',
  }

  // validations messages 
  validationMessage = {
    'loanPrincipal':{
      'required':'Loan amount is required',
      'max': 'The Loan amount entered is greater than your Loan Limit/Affordability' //You only qualify for a loan below 5,000 ETB
    },
    'termsAndConditions':{
      'required':'Please accept or reject the terms and conditions'
    },
  };
  customActionSheetOptions: any = {

  };
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  apiLoanValidations:any={};

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
    private route: ActivatedRoute,

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

    this.id = this.route.snapshot.paramMap.get('customerId');
    this.custNo = this.route.snapshot.paramMap.get('customerNo');
    this.name = this.route.snapshot.paramMap.get('name');
    this.custTypeId = this.route.snapshot.paramMap.get('customerType');
    //customerType
    //#################### Get Storage Data #####################################
    const ret = await Storage.get({ key: 'userData' });
    const user = JSON.parse(ret.value);
    console.log(user);
    this.token=user.token;
    this.branchId = user.branchId;
    if(this.custNo === null || this.custNo === undefined) {
      this.custNo=user.custNo;
      this.id=user.id;
      this.name= user.name;      
      this.custTypeId= user.custTypeId;
      this.loginType = 'Customer'
    } else {
      this.loginType = 'Admin'
    }
    this.institution = user.institutionId;
    this.institutionName = user.institutionName;
    
    //#################### End Storage Data #####################################
    this.getIndustries();
    this.getLoanItem();
    this.commonFunction.closePopUp('table')
    // this.loanApplicationFormGp.controls['custName'].setValue(this.name);

    this.loanApplicationFormGp = this.fb.group({
      loanInfo: this.fb.array([
        new FormGroup({ 
          custName: new FormControl(''),
          
        }),
        new FormGroup({
          loanPrincipal: new FormControl('', Validators.compose([Validators.required])),
        }),
        //account information
      new FormGroup ({
        terms_and_conditions: new FormControl('',Validators.compose([Validators.required])),
       }),
        
      ])
      
     

    })
    this.loanValidationApi();


  }
  get basicForm() {
    return <FormGroup> this.loanApplicationFormGp.get('loanInfo');
  }

  get amountValue() {
    return <FormGroup> this.basicForm.controls['1'];
  }
   
  get terms() {
    return <FormGroup> this.basicForm.controls['2'];
  }

  validate(){
    let amount = parseInt(this.removeCommas(/(,)/, this.amountValue.controls.loanPrincipal.value));
    this.amountValue.controls.loanPrincipal.setValue(amount);

    if(amount > this.apiLoanValidations?.limit) {
      this.amountValue.controls.loanPrincipal.setValidators([Validators.max(Math.floor(this.amountValue.controls.loanPrincipal.value))]);
      console.log(this.validationMessage.loanPrincipal, '---this.validationMessage.loanPrincipal--')
      console.log(this.amountValue.controls.loanPrincipal, '---this.validationMessage.loanPrincipal--')
      // this.amountValue.controls.loanPrincipal.updateValueAndValidity();
      return
    } else {
      // this.amountValue.controls.loanPrincipal.clearValidators();
      // this.amountValue.controls.loanPrincipal.updateValueAndValidity();
      this.commas();
    }
   
    
  }

  commas = () => {
   console.log(this.amountValue.controls.loanPrincipal.value, '>>>>value');
    this.amountValue.controls.loanPrincipal.setValue(this.numberWithCommas((this.amountValue.controls.loanPrincipal.value).toString()));
  }
   numberWithCommas(x) {
     console.log(x, '---')
     return x.replace(/\D/g, "")
     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getLoanItem(){
    let postData ,search, auth, customerType = this.custTypeId, customerNo=this.custNo;
    search={
      customerType, customerNo
  }
  //  auth = this.helper.getUserRequestCredentials();
  this.loginType === 'Admin' ? auth = this.helper.getUserRequestCredentials() :  auth={
    token: this.token,
    username: this.custNo,
    type:"mobile",
    instituition: this.institution,
    id:this.id
  }

    postData = {
      auth:auth,
      requestData: '',
      search:search
    }
    let that = this;
    this.sendRequestToServer(
      "LoansManagement",
      "getLoanFormItems",
      JSON.stringify(postData),
      function(response) {
        that.handleResponseLoanItem(response);
      },
      function(err) {
      }
    );
  }

  loanDurationChange(event){
    this.loanApplicationFormGp.controls['rpyUnit'].reset();
    this.repaymentCycle=[];
    // let yr, mn, wk, ds;
    if(event==='Year(s)'){
      // yr = {id:1, time:'Year(s)' }
      this.repaymentCycle.push({id:1, time:'Year(s)' });
      this.repaymentCycle.push({id:2, time:'Month(s)' });
      this.repaymentCycle.push({id:3, time:'Week(s)' });
      this.repaymentCycle.push({id:4, time:'Day(s)' });
    }else if(event==='Month(s)'){
      this.repaymentCycle.push({id:2, time:'Month(s)' });
      this.repaymentCycle.push({id:3, time:'Week(s)' });
      this.repaymentCycle.push({id:4, time:'Day(s)' });
    }else if(event==='Week(s)'){
      this.repaymentCycle.push({id:3, time:'Week(s)' });
      this.repaymentCycle.push({id:4, time:'Day(s)' });
    }else if(event==='Day(s)'){
      this.repaymentCycle.push({id:4, time:'Day(s)' });
    }else{
      this.repaymentCycle=[];
    }
    
  }

  handleResponseLoanItem(response){
   
    if(response.returnCode !=0 ){
    }else{
      this.incomeSources= response.returnData.incomeSources;
      this.openingReasons=response.returnData.openingReasons;
      this.productList =response.returnData.productList;
     
    }
  }
logValidationErrors(group: FormGroup = this.loanApplicationFormGp): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else if (abstractControl instanceof FormArray) {
        let formGroups: FormArray = abstractControl;
        for (let i = 0; i <= formGroups.length; i++) {
          if (formGroups.controls[i] instanceof FormGroup) {
            this.logValidationErrors((<FormGroup> formGroups.controls[i]));
          } else if (formGroups.controls[i] instanceof FormArray) {
            this.handleFormArray(formGroups[i]);
          }
        }
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessage[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }
  checked(event){
    console.log(event)
    if(event.checked) {
      this.status = false;
    } else {
      this.status = true;
    }
  }
  handleFormArray(formArray: FormArray) {
    for (let i = 0; i <= formArray.length; i++) {
      if (formArray.controls[i] instanceof FormGroup) {
        this.logValidationErrors((<FormGroup> formArray.controls[i]));
      } else if (formArray.controls[i] instanceof FormArray) {
        this.handleFormArray(formArray[i]);
      }
    }
  }
  onSubmit() {
    let loanPrincipal = this.amountValue.controls.loanPrincipal.value;
    let patt = new RegExp(',');

    let requestData = this.removeCommas(patt, loanPrincipal);

    if(requestData> this.apiLoanValidations?.limit){
      this.presentToastGlobal('The Loan amount entered is greater than your Loan Limit/Affordability', 5000, 'error');
      return
    }

    let auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile",
      instituition: this.institution,
      id:this.id
    }

    let search = {
      searchWord:"addAwashLoan",
      cust_no:this.custNo
    };
    let postData = {
      auth: auth,
      requestData:requestData,
      search: search,
      loanDisbursementDate:new Date()
    };

    var controller = this;
    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      response => {
        controller.handleLoanResponse(response);
      },
      function (err) {
        controller.presentToastGlobal('Failed to connect. please check your internet connection and try again', 4200, 'warning');
      }
    );

  }
  handleLoanResponse(resp:any){
    console.log(resp)
    if (resp.returnCode==0){
      this.presentToastGlobal('Your Loan has been disbursed successfully', 5000, 'success');
      setTimeout(() => {
        // this.router.navigate(['login'])
      }, 3000);

    }
  }


  handleResponseAddLoan(response){
    console.log(response)
    if(response.returnCode != 0){
    }else{
      this.applicationResults = response.returnData;
      this.presentToast("Loan application submitted successful");
      this.commonFunction.closePopUp('form');
      this.commonFunction.showElement('table');
      this.loanDetails={}
    }
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
  async presentToastGlobal(message, duration, color) {
    console.log('toast')
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'middle'
    });
    toast.present();
  }

  test(){
    this.presentToast("Test toster");
  }

  getIndustries(){
    let postData ,search, auth, customerType = this.custTypeId, customerNo=this.custNo;
    search={
      customerType, customerNo
  }
  // auth = this.helper.getUserRequestCredentials();
  this.loginType === 'Admin' ? auth = this.helper.getUserRequestCredentials() :  auth={
    token: this.token,
    username: this.custNo,
    type:"mobile",
    instituition: this.institution,
    id: this.id
  }
  /* auth = {
    token: this.token,
    username: this.custNo,
    type:"mobile",
    instituition: this.institution
  }; */
    postData = {
      auth:auth,
      requestData: '',
      search:search
    }
    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getIndustrySubCategories",
      JSON.stringify(postData),
      function(response) {
        console.log(response);
        that.handleResponseIndustries(response);
      },
      function(err) {
      }
    );
  }

  handleResponseIndustries(response){
    if(response.returnCode != 0){
    }else{
      this.industries = response.returnData;
    }
  }

 
  

  /**
   * multiselect modification
   * @param event 
   * @param type 
   */
   onChangeMultiSelect(event, type){
    console.log('*********************');
    let tempArray=[]
      console.log(event.target.value);
      event.target.value.forEach(element => {
        tempArray.push(parseInt(element));
    });

    if(type === 'purpose'){
      this.listLoanPurpose=tempArray;
    }
    if(type === 'income'){
      this.listIncomeSources=tempArray;
    }
  }


  loanValidationApi=()=>{
    let postData , auth;
    this.loginType === 'Admin' ? auth = this.helper.getUserRequestCredentials() :  auth={
      token: this.token,
      username: this.custNo,
      type:"mobile",
      instituition: this.institution,
      id: this.id
    }
    postData={
      auth,
      custNo:this.custNo,
    }

    this.sendRequestToServer(
      "LoansManagement",
      "getCustomerAffordability",
      JSON.stringify(postData),
      (response)=>{

        if(response.returnCode != 0){
        }else{
          this.apiLoanValidations = JSON.parse(response.returnData);
        }
      },
      (error)=>{}
    )
  }

}
