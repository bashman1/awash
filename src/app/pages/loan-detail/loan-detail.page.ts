import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { NavController, LoadingController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import {AkkountingNew} from '../classes/akkounting-new';
import {Akkounting} from '../classes/Akkounting';
import { from } from 'rxjs';

const { Storage } = Plugins;
@Component({
  selector: 'app-loan-detail',
  templateUrl: './loan-detail.page.html',
  styleUrls: ['./loan-detail.page.scss'],
})
export class LoanDetailPage extends LoginService {
  loanNo:any;
  branchId:any;
  custNo: string;
  id:any;
  name:string;
  token:string;
  institution:any;
  loanDetailsList:any={};
  repaymentSchedule:any[]=[];
  repaymentSchdlFrmDb:any[]=[];
  totalPayments: number = 0;
  loanRepayments: any[];

  step = 0;
  constructor(
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public route: ActivatedRoute,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    public navCtrl:NavController,
    public loadingController: LoadingController
  ) {
    super(http, helper,loadingController);
   }

  ngOnInit() {
    this.route.params.subscribe(params=>{
      this.loanNo = params['id'];
    })
    this.getloanDetails(this.loanNo);
  }

  async getloanDetails(loanNo){

    const ret = await Storage.get({ key: 'userData' });
    const user = JSON.parse(ret.value);
    this.token=user.token;
    this.branchId = user.branchId;
    this.custNo=user.custNo;
    this.id=user.id;
    this.name= user.name;
    this.institution = user.institution
    
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
      loanId: loanNo

    }

    let postData = {
      auth: auth,
      search: search
    };

    var controller = this;
    this.sendRequestToServer(
      "LoansManagement",
      "getLoanDetails",
      JSON.stringify(postData),
      function(response) {
        controller.handleLoanDetailsResponse(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );

  }

  handleLoanDetailsResponse(response){
      console.log("Here comes response,,,,,,,,,,,,,,,,,,,,,,,,,,,")
      console.log(response);
      this.loanDetailsList = response.returnData.rows[0]
      console.log("response.returnData.rows[0]")
      console.log(this.loanDetailsList);
      this.getLoanSchedule();
      this.getLoanDSchdlFrmDb(this.loanNo);
      this.getLoanRepayments(this.loanNo)
      if(response.returnCode!=0){
        console.log("Not found")
      } 
  }

  getLoanSchedule(){
    let interestRate = new Akkounting().newConvertPercentages(this.loanDetailsList.term_cd,this.loanDetailsList.interest_rate,this.loanDetailsList.loan_rpmnt_freq_cd );
    let startDate;
    if(!this.loanDetailsList.rpmnt_start_date){
      startDate = new Date();
    }else{
      startDate = new Date(this.loanDetailsList.rpmnt_start_date);
    }
    let schedule = new AkkountingNew(
      this.loanDetailsList.principal_amount, interestRate,
      this.loanDetailsList.number_of_payments,
      this.loanDetailsList.grace_period_value,startDate,
      this.loanDetailsList.loan_interest_type,
      this.loanDetailsList.loan_rpmnt_freq_cd,
      this.loanDetailsList.loan_rpmnt_freq_value
    );
    this.repaymentSchedule = schedule.amortizedSchedule;
    console.log(this.repaymentSchedule);

  }

  async getLoanDSchdlFrmDb(loanNo){
    const ret = await Storage.get({ key: 'userData' });
    const user = JSON.parse(ret.value);
    this.token=user.token;
    this.branchId = user.branchId;
    this.custNo=user.custNo;
    this.id=user.id;
    this.name= user.name;
    this.institution = user.institution

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
      loanNo: loanNo,
      sortOrder: 'desc'//'asc',
    };

    let postData = {
      auth: auth,
      search: search
    };

    var controller = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "loanRepaymentSchdl",
      JSON.stringify(postData),
      function(response) {
        controller.handleLoanScdlFrmDb(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );

  }

  handleLoanScdlFrmDb(response){
    console.log("Here comes response from db,,,,,,,,,,,,,,,,,,,,,,,,,,,")
    console.log(response);
    // this.repaymentSchdlFrmDb = 
    let x =response.returnData.rows;
    x.sort((a, b) => (a.repayment_number > b.repayment_number) ? 1 : -1);
    this.repaymentSchdlFrmDb = x;
    console.log("repaymentSchdlFrmDb")
    console.log("closing_bal"+JSON.stringify(this.repaymentSchdlFrmDb));
    if(response.returnCode!=0){
      console.log("Not found from DB")
    } 
  }
  async getLoanRepayments(id: any) {
    let controller = this;
    controller.totalPayments = 0;

    const ret = await Storage.get({ key: 'userData' });
    const user = JSON.parse(ret.value);
    this.token=user.token;
    this.branchId = user.branchId;
    this.custNo=user.custNo;
    this.id=user.id;
    this.name= user.name;
    this.institution = user.institution

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
      loanAcctNo: id,
      sortOrder: 'desc',//'asc',
      drCrIndicator :'CR'
    };

    let postData = {
      auth: auth,
      search: search
    };
    this.sendRequestToServer(
      'LoansManagement',
      'getLoanRepayments',
      JSON.stringify(postData),
      function(response) {
        console.log(response, 'repayments')
        controller.loanRepayments = response.returnData.rows;
        controller.loanRepayments.forEach(val => {
          controller.totalPayments += val.transaction_amt;
        });
      }, function() {
          console.log("Error: Please try again later");
      }
    );
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  

}
