import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { OptionsService } from 'src/app/services/options.service';
import { Router } from '@angular/router';
import {LoginService} from '../../services/login.service';
import {HttpClient} from '@angular/common/http';
import {HelperService} from '../../services/helper.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-business-financial',
  templateUrl: './business-financial.page.html',
  styleUrls: ['./business-financial.page.scss'],
})
export class BusinessFinancialPage extends LoginService {
  businessForm:FormGroup;
  netEarning:number;
  cash:number;
  debtors:number;
  furniture:number;
  equipment:number;
  vehicles:number;
  premises:number;
  loans:number;
  debtsBelow3:number;
  debtsOver3:number;
  total:number;
  bank:number;
  constructor(
    private fb:FormBuilder,
    private report:ReportsService,
    private option:OptionsService,
    private router:Router,
    public http: HttpClient,
    public helper: HelperService,
    public loadingController: LoadingController,
    ) {
    super(http,helper, loadingController)
}

  ngOnInit() {
    
    this.businessForm = this.fb.group({
      earning_from_other_buz:new FormControl(),
      amount3:new FormControl(),
      amountTo_collect:new FormControl(),
      furniture_value:new FormControl(),
      equipment_value:new FormControl(),
      vehicle_value:new FormControl(),
      buzPremises_value:new FormControl(),
      debtsBelow3:new FormControl(),
      debtsOver3:new FormControl(),
      amount7:new FormControl()
    })
  }

  totalFinances(){
   
  
    setTimeout(() => {
    
      this.total = 0;
      this.netEarning = this.businessForm.controls['earning_from_other_buz'].value;
          if(this.netEarning===null)
          this.netEarning=0;

        this.cash = this.businessForm.controls['amount3'].value;
        if(this.cash===null)
          this.cash = 0;

        this.debtors =  this.businessForm.controls['amountTo_collect'].value;
        if(this.debtors===null)
          this.debtors= 0;

        this.furniture = this.businessForm.controls['furniture_value'].value;
        if(this.furniture===null)
        this.furniture = 0;

        this.equipment = this.businessForm.controls['equipment_value'].value;
        if(this.equipment===null)
        this.equipment = 0;

        this.vehicles = this.businessForm.controls['vehicle_value'].value;
        if(this.vehicles===null)
        this.vehicles = 0;

        this.premises = this.businessForm.controls['buzPremises_value'].value;
        if(this.premises===null)
        this.premises = 0;

        // this.loans = this.businessForm.controls['loans'].value
        // if(this.loans===null)
        // this.loans = 0

        this.debtsBelow3 = this.businessForm.controls['debtsBelow3'].value;
        if(this.debtsBelow3===null)
        this.debtsBelow3 = 0;

        this.debtsOver3 = this.businessForm.controls['debtsOver3'].value;
        if(this.debtsOver3===null)
        this.debtsOver3 = 0;

        this.bank =  this.businessForm.controls['amount7'].value;
        if(this.bank ===null)
        this.bank=0;

        this.total = this.cash + this.debtors + this.debtsBelow3 + this.debtsOver3 + this.equipment + this.furniture
                      + this.netEarning + this.premises + this.vehicles + this.bank
    },100);
 
  }

  submit(){
    
       this.report.businessFinancialAmnt(this.total,this.businessForm.value);

   // let requestData
    let salesInventory = this.report.totalPurchases;
    let sales = this.report.totalMonthlySales;
    let installment = this.report.installment;
    let totalFamExpenses = this.report.familyExpenses;
    let totalBuzExpenses = this.report.operatingExpense;
    let customerNo = this.report.customerNo;
    let salesMetricTotal = this.report.dailySalesAv*7;
    let formArray = [this.report.stepper0,this.report.stepper1,this.report.stepper2,this.report.stepper3];
    // let appraisalData=formArray;
    let requestData ={formArray};
    let auth=this.helper.getUserRequestCredentials();

    let postData={
      auth:auth,
      requestData:{requestData,totalBuzExpenses,totalFamExpenses,salesInventory,salesMetricTotal,installment,customerNo,sales}
    };
    var controller=this;
    this.sendRequestToServer(
        'loansManagement', //Service
        'addApraisalData', //Service
        JSON.stringify(postData),
        function(response){
          if(response.returnCode==0){
            controller.router.navigate(['/menu/loan-appraisal/cash-flow',response.returnData.appraisalCode])

          }

        },
        function (err) {
          //controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
        }
    )

       // this.router.navigate(['/menu/loan-appraisal/cash-flow/'])
      
  }


}
