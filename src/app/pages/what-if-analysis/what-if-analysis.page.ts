import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder, 
  Validators,
  AbstractControl
} from "@angular/forms";
import { LoginService } from "src/app/services/login.service"; 
import { ModalController, LoadingController, IonRouterOutlet, Platform } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "src/app/services/helper.service";
import { LoaderServiceService } from "src/app/services/loader-service.service";
import { CommonFunctions } from "src/app/services/CommonFunctions";
import { AkkountingNew } from "../classes/akkounting-new";
import { Akkounting } from "../classes/Akkounting";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";


@Component({
  selector: 'app-what-if-analysis',
  templateUrl: './what-if-analysis.page.html',
  styleUrls: ['./what-if-analysis.page.scss'],
})
export class WhatIfAnalysisPage extends LoginService  {
  selfAppraisalForm: FormGroup;
  repaymentSchedule: any[] = [];
  rows: any[];
  columns: any[];
  form: any = "block";
  table: any = "none";
  filteredDurationUnits:any = [];
  maxvalue:any = false;
  maxErrorMessage:any;
  customActionSheetOptions:any;
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;

  validation_messages = {
    loan_duration:[
      {type: 'required', message:'Loan duration is required'}
    ],
    loan_principal:[
      {type:'required', message: 'Principal is required'}
    ],
    interest_amount:[
      {type:'required', message: 'Interest rate is required'}
    ],
    duration_in:[
      {type:'required', message: 'Duration type is required'}
    ],
    repayment_freq:[
      {type:'required', message: 'Repayment type is required'}
    ],
    repayment_freq_value:[
      {type:'required', message: 'Repayment value is required'}
    ],
    interest_method:[
      {type:'required', message: 'Interest method is required'}
    ],
  }


  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    private fb: FormBuilder,
    public platform: Platform,
    private screenOrientation: ScreenOrientation,
    public loadingController: LoadingController,

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

  ngOnInit() {
    super.ngOnInit();

    this.selfAppraisalForm = this.fb.group({
      loan_duration: [null, [Validators.required]],
      loan_principal: [null, [Validators.required]],
      interest_amount: [null, [Validators.required]],
      duration_in: [null, [Validators.required]],
      repayment_freq: [null, [Validators.required]],
      repayment_freq_value: [null, [Validators.required]],
      interest_method: [null, [Validators.required]],
      grace_period: [null, []],
      grace_period_in: [null, []]
    });

  }

  selfAppraise() {
    const principal = this.removeCommas(/(,)/, this.selfAppraisalForm.controls.loan_principal.value);
    console.log(principal);
    this.selfAppraisalForm.controls.loan_principal.setValue(parseInt(principal));

    console.log(this.selfAppraisalForm.controls["repayment_freq_value"].value)
    console.log(this.selfAppraisalForm.controls["loan_duration"].value)

    // validating repayment time period
    if(this.selfAppraisalForm.controls['duration_in'].value === "Day(s)"){
      if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value){
        this.maxvalue = true;
        this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value;
        console.log(this.maxErrorMessage)
        return;
      }else{
        this.maxErrorMessage = ""
      }
      // alert(this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value);
    }else if(this.selfAppraisalForm.controls['duration_in'].value ==="Week(s)"){

      if(this.selfAppraisalForm.controls['repayment_freq'].value === "Day(s)" ){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value*7){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value*7+' Day(s)';
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }

      }else if(this.selfAppraisalForm.controls['repayment_freq'].value === "Week(s)"){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value;
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }
      }
      
      // alert(this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value);
    }else if(this.selfAppraisalForm.controls['duration_in'].value==="Month(s)"){

      if(this.selfAppraisalForm.controls['repayment_freq'].value === "Day(s)" ){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value*30){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value*30+' Day(s)';
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }

      }else if(this.selfAppraisalForm.controls['repayment_freq'].value === "Week(s)"){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value * 4.2857){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+Math.floor(this.selfAppraisalForm.controls["loan_duration"].value * 4.2857)+' Weeks(s)';
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }
      }else if(this.selfAppraisalForm.controls['repayment_freq'].value === "Month(s)"){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value;
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }
      }


      // alert(this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value);
    }else if(this.selfAppraisalForm.controls['duration_in'].value ==="Year(s)"){

      if(this.selfAppraisalForm.controls['repayment_freq'].value === "Day(s)" ){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value*360){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value*360+' Day(s)';
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }

      }else if(this.selfAppraisalForm.controls['repayment_freq'].value === "Week(s)"){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value * 51.4286){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+Math.floor(this.selfAppraisalForm.controls["loan_duration"].value * 51.4286)+' Weeks(s)';
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }
      }else if(this.selfAppraisalForm.controls['repayment_freq'].value === "Month(s)"){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value * 12){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value * 12+' Month(s)';
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }
      }else if(this.selfAppraisalForm.controls['repayment_freq'].value === "Year(s)"){
        if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value){
          this.maxvalue = true;
          this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value;
          console.log(this.maxErrorMessage)
          return;
        }else{
          this.maxErrorMessage = ""
        }
      }

      // alert(this.selfAppraisalForm.controls["loan_duration"].value+' '+this.selfAppraisalForm.controls['duration_in'].value);
    }else{

    }

    // if(this.selfAppraisalForm.controls["repayment_freq_value"].value > this.selfAppraisalForm.controls["loan_duration"].value){
    //   this.maxvalue = true;
    //   this.maxErrorMessage = "Repayment srequency value can not be more than "+this.selfAppraisalForm.controls["loan_duration"].value;
    //   console.log(this.maxErrorMessage)
    //   return;
    // }

    console.log(this.selfAppraisalForm.status);
    if(this.selfAppraisalForm.invalid){
      return;
    }
    let loanDuration = this.selfAppraisalForm.controls["loan_duration"].value;
    let principalAmount = this.selfAppraisalForm.controls["loan_principal"].value;
    let interestAmt = this.selfAppraisalForm.controls["interest_amount"].value;
    let loanDurationIn = this.selfAppraisalForm.controls["duration_in"].value;
    let rpmtFreq = this.selfAppraisalForm.controls["repayment_freq"].value;
    let rpmtFreqVal = this.selfAppraisalForm.controls["repayment_freq_value"].value;
    let interestMethod = this.selfAppraisalForm.controls["interest_method"].value;
    let gracePeriod = this.selfAppraisalForm.controls["grace_period"].value;
    let gracePeriodIn = this.selfAppraisalForm.controls["grace_period_in"].value;
    let interestRate = new Akkounting().newConvertPercentages(loanDurationIn, interestAmt,rpmtFreq);
    let noOfPayments = new Akkounting().getNoOfPaymentsOne(loanDuration,loanDurationIn,rpmtFreqVal,rpmtFreq);
    let schedule = new AkkountingNew(
      principalAmount,
      interestRate,
      noOfPayments,
      gracePeriod,
      new Date(),
      interestMethod,
      rpmtFreq,
      rpmtFreqVal
    );
    this.repaymentSchedule = schedule.amortizedSchedule;
    console.log(schedule.amortizedSchedule);
console.log(this.repaymentSchedule.length)
    if(this.repaymentSchedule.length!>1){
      this.form = "block";
      this.table = "block";
    }

    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.rows = this.repaymentSchedule;
    this.columns = [
      { prop: "#" },
      { name: "startDate" },
      { name: "openingbal" },
      { name: "intpayable" },
      { name: "prinpayable" },
      { name: "installmentamount" },
      { name: "closingbal" },
      { name: "totalpaid" }
    ];
  }

  portrait() {
    // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.form = "block";
    this.table = "none";
    // this.selfAppraisalForm.reset();
  }
  commas = () => {
    this.selfAppraisalForm.controls.loan_principal.setValue(this.numberWithCommas(this.selfAppraisalForm.controls.loan_principal.value))
  }
   numberWithCommas(x) {
     return x.replace(/\D/g, "")
     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  loanDurationChange(event){
    console.log(event);

    this.selfAppraisalForm.controls['repayment_freq'].reset();
    this.filteredDurationUnits=[];
    // let yr, mn, wk, ds;
    if(event==='Year(s)'){
      // yr = {id:1, time:'Year(s)' }
      this.filteredDurationUnits.push({id:1, time:'Year(s)' });
      this.filteredDurationUnits.push({id:2, time:'Month(s)' });
      this.filteredDurationUnits.push({id:3, time:'Week(s)' });
      this.filteredDurationUnits.push({id:4, time:'Day(s)' });
    }else if(event==='Month(s)'){
      this.filteredDurationUnits.push({id:2, time:'Month(s)' });
      this.filteredDurationUnits.push({id:3, time:'Week(s)' });
      this.filteredDurationUnits.push({id:4, time:'Day(s)' });
    }else if(event==='Week(s)'){
      this.filteredDurationUnits.push({id:3, time:'Week(s)' });
      this.filteredDurationUnits.push({id:4, time:'Day(s)' });
    }else if(event==='Day(s)'){
      this.filteredDurationUnits.push({id:4, time:'Day(s)' });
    }else{
      this.filteredDurationUnits=[];
    }

  }

}
