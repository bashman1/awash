import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ModalController, IonRouterOutlet, Platform, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { FormGroup, FormControl, FormBuilder,Validators, AbstractControl} from '@angular/forms';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage extends LoginService {
  active: string;
  branchId: any;
  custNo: string;
  id: any;
  name: string;
  token: string;
  institution: any;
  customerType: any;
  customerPaymentList:any[];
  paymenthistoryFilter:any[];
  emptyMessage: any;
  emptycheck:boolean = true;
  branchIdArr:any[]=[];
  paymentForm: FormGroup;
  dateValue: any;
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  trancolor:any;
  loansList:any=[];
  acctNo: number;


  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    private fb: FormBuilder,
    public platform: Platform,
    public loadingController: LoadingController

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

    this.paymentForm = this.fb.group({
      startDate: new FormControl(),
      endDate: new FormControl()
    })

    const ret = await Storage.get({ key: "userData" });
    const user = JSON.parse(ret.value);
    console.log(user)
    this.token = user.token;
    this.branchId = user.branchId;
    this.custNo = user.custNo;
    this.id = user.id;
    this.name = user.name;
    this.institution = user.institution;
    this.customerType = user.custTypeId;
    this.institutionName = user.institutionName;
    this.getLoanAccount();
    let postData, search, auth;

    search = {
       custNo:this.custNo,
        customerType: this.customerType,
         branchId:this.branchId, 
         branchIdArr:this.branchIdArr,
         sortField: 'Q.create_dt',
         sortOrder:'desc'
        };
    auth = await {
      token: this.token,
      username: this.custNo,
      type: "mobile"
    };
    postData = {
      auth: auth,
      search: search
    };

    var controller = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "customerTransaction",
      JSON.stringify(postData),
      function(response) {
        controller.handleResponse(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );


  }



  handleResponse(response) {
    let respData = response.returnData.rows;
    this.customerPaymentList = respData;
    this.customerPaymentList.forEach(element => {
     if(element.tran_code=="DP"){
      this.trancolor='green';
     }if(element.tran_code=="WD"){
       this.trancolor='#FF0000';
     }else{
      //  this.trancolor='';
     }

    });
    if(this.customerPaymentList.length==0){
      console.log("----------------is is empty---------------------")
      this.emptyMessage='No payments have been made'
      this.emptycheck=false;
    }
  }

  getLoanAccount() {
    let auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };

    let search={
      custNo: this.custNo,
      branchId: this.branchId,
      institution: this.institution,
      loanStatus: "Active",
      searchWord:"postAwashRepayment"

    }

    let postData = {
      auth: auth,
      search: search
    };

    var controller = this;
    this.sendRequestToServer(
      "LoansManagement",
      "getLoanData",
      JSON.stringify(postData),
      function(response) {
        controller.loansList = response.returnData.rows;
        controller.acctNo = controller.loansList[0].acct_no;
        console.log(controller.acctNo);
      },
      function(err) {
      }
    );
  }
  // SearchByDate(){
  //   console.log("Date Search")
  // }

  paymentSubmit(){
    console.log(this.dateValue);   
    let requestData, auth, search,branchIdArr;
    requestData = this.paymentForm.value;

    branchIdArr=[ this.branchId];
    auth ={
      token: this.token,
      username: this.custNo,
      type: "mobile",
      userData: {}
    }

    let x = requestData.endDate.slice(0, 10);
    let xy = requestData.startDate.slice(0, 10);
    
    console.log(x, 'endaDate')

    search={
      startDate: xy,
      endDate: x,
      custNo: this.custNo,
      searchWord: 'getAwashLoanRepayments',
      loanAcctNo: this.acctNo
    }
    requestData = this.paymentForm.value;
  //  console.log(this.loginForm.status)
   if(this.paymentForm.invalid){
     return;
   }
   let postData ={
     requestData: {},
     auth:auth,
     search: search,
   }

   var controller = this;

    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),   
      function (response) {
        controller.handleResponseSearch(response,); 
        
      },
      function (err) {
        console.log( err.message)//Error handler
      }
    );
  }

  handleResponseSearch(response,){
    this.emptycheck=true;
    console.log("----------------Filter Response ---------------------")
    console.log(response);
    if(response.returnCode === 0) {
      let respData = response.returnData;
      if(respData.length==0){
        this.customerPaymentList = respData;
        console.log("----------------Search by date is empty ---------------------")
        this.emptyMessage='No payments found'
        this.emptycheck=false;
      } else {
        console.log("Error getting payments");
      }
    }
    
    
    console.log(this.emptyMessage)
    console.log(response);
    console.log(this.customerPaymentList);
  }


}
