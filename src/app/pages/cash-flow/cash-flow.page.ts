import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import {AkkountingNew} from "./AkkountingNew";
import {Akkounting} from "./Akkounting";

import * as $ from 'jquery';
import {LoginService} from '../../services/login.service';
import {HttpClient} from '@angular/common/http';
import {HelperService} from '../../services/helper.service';
import {ActivatedRoute} from '@angular/router';
import {ToastController, LoadingController} from '@ionic/angular';
import {CommonFunctions} from '../../services/CommonFunctions';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.page.html',
  styleUrls: ['./cash-flow.page.scss'],
})
export class CashFlowPage extends LoginService {
    color: any;
    val =5000000
    appCode:any;
    reportList:any={};
    search: any;
    repaymentSchedule: any[]=[];
    estimateSchedule: any[]=[];
    msgs1: any[]=[];
    loanAmount:number=1000000;
    loanDuration:number=2;
    loanInterest:number=2;
    loanMethod:string="flat_rate";
    whatIfAnalysis:FormGroup;


   // totalRecords: any;
    color1= "green";
    color2= "green";
    color3= "green";
    color4= "green";
    color5= "green";
    color6= "green";
    color7= "green";
    color8= "green";
    color9= "green";
    color10= "green";
    color11= "green";
    cols: any;


    constructor(
     private route: ActivatedRoute,
     private formBuilder: FormBuilder,
    public http: HttpClient,
    public helper: HelperService,
     public toastController: ToastController,
     private commonFunctions: CommonFunctions,
     public loadingController: LoadingController


    ) {
        super(http, helper, loadingController);
        this.search={
            "first": 0,
            "rowsPerPage": 20
        }

    }
    ngOnInit() {
        super.ngOnInit();

     /*
*/
        this.route.params.subscribe(params => {
            this.appCode = +params['appraisalCode'];

            // this.logDev(this.productCode)
        });

        this.ReportData(this.appCode);
        $('#cashflow').hide();
        $('#balanceSheet').hide();
        $('#loanDetails').show();
        $('#calender').hide();
        $('#estimate').hide();
       /* this.commonFunctions.closePopUp('balanceSheet')
        this.commonFunctions.closePopUp('cashflow')
        this.commonFunctions.closePopUp('calender')*/

    }
    ReportData(Code:String) {
        
        let appraisalCode =Code;
        let controller = this;
        let search1=this.search;
        let auth = controller.helper.getUserRequestCredentials();
        let postData = {
            auth:auth,
            requestData:appraisalCode,
            search:search1

        };

        this.sendRequestToServer(
            'loansManagement',
            'appraisalReport',
            JSON.stringify(postData),
            function (response) {
                controller.responseFunc(response);

            },
            function (err) {
               // controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
            }
        );
        this.loanDetails();

    }
    responseFunc(data:any){
// this.productList=data.returnData;
        if(data.returnCode != 0){
        }else{
           
            this.reportList=data.returnData.rows[0];

            let method= this.reportList.interest_method;
            let duration= this.reportList.loan_service_time;
            let unit= this.reportList.duration_unit;
            let rate=this.reportList.interest_rate;
            let loan_amt=this.reportList.loan_amt_apply;

            let number_of_payments=new Akkounting().getNoOfPaymentsOne(duration, unit,1,unit);
            let intRate = new Akkounting().newConvertPercentages(unit,rate);
            let schedule = new AkkountingNew(loan_amt,intRate,number_of_payments,0,new Date(),method,unit,1);
            let installment=Math.round(schedule.paymentPerPeriod);
            this.repaymentSchedule = schedule.amortizedSchedule;

            let currentRatio=this.reportList.current_ratio;
            let quickRatio=this.reportList.quick_ratio;
            let debtEquity=this.reportList.debt_equity;
            let return_of_assets=this.reportList.return_on_assets;
            let installment_on_NP=this.reportList.installment_net_profit;
            let netProfitmargin=this.reportList.net_profit_margin;
            let inventoryTO=this.reportList.inventory_turn_over;
            let repaymentCapacity=this.reportList.repayment_capacity;
            let collateralCoverage=this.reportList.collateral_coverage;
            let debtRatio=this.reportList.debt_ratio;
            let householdUsage=this.reportList.house_hold_usage;


            if(this.reportList.net_working_capital)
            if(currentRatio < 2){
                this.color2="red";
            }
            if(quickRatio < 0.2){
                this.color1="red";
            }
            if(debtEquity >66){
                this.color3="red";
            }
            if(return_of_assets < 3){
                this.color4="red";
            }
            if(installment_on_NP > 45){
                this.color5="red";
            }
            if(netProfitmargin < 6){
                this.color6="red";
            }
            if(inventoryTO > 51){
                this.color7="red";
            }
            if(repaymentCapacity > 60){
                this.color8="red";
            }
            if(collateralCoverage <= 80){
                this.color9="red";
            }
            if(debtRatio >75){
                this.color10="red";
            }
            if(householdUsage <=30){
                this.color11="red";
            }
            if(currentRatio >=2 && quickRatio >=0.2){
                this.presentToast('success', 'You are credit worthy,proceed to apply for the loan at the institution');

            }else{
                this.presentToast('warning', 'You are not credit worthy, Check the Ratios which are marked red especeially the liquidity ratios');
            }

        }

    }
    estimateCalc(){

        let number_of_payments=new Akkounting().getNoOfPaymentsOne(this.loanDuration, "Month(s)",1,"Month(s)");
        let intRate = new Akkounting().newConvertPercentages("Month(s)",this.loanInterest);
        let schedule = new AkkountingNew(this.loanAmount,intRate,number_of_payments,0,new Date(),this.loanMethod,"Month(s)",1);
        this.estimateSchedule = schedule.amortizedSchedule;

    }

    balanceSheet() {

        $('#cashflow').hide();
        $('#loanDetails').hide();
        $('#balanceSheet').show();
        $('#calender').hide();
        $('#estimate').hide();
    }
    loanDetails(){
        $('#cashflow').hide();
        $('#balanceSheet').hide();
        $('#loanDetails').show();
        $('#calender').hide();
        $('#estimate').hide();
    }
    cashFlow(){
        $('#cashflow').show();
        $('#balanceSheet').hide();
        $('#loanDetails').hide();
        $('#calender').hide();
        $('#estimate').hide();
    }

    calender(){
        $('#calender').show();
        $('#cashflow').hide();
        $('#balanceSheet').hide();
        $('#loanDetails').hide();
        $('#estimate').hide();
    }
    estimate(){
        $('#calender').hide();
        $('#cashflow').hide();
        $('#balanceSheet').hide();
        $('#loanDetails').hide();
        $('#estimate').show();
    }

    async presentToast(color,message) {
        const toast = await this.toastController.create({
            message: message,
            duration: 1000,
            position: 'top',
            color:color
        });
        toast.present();
    }

}
