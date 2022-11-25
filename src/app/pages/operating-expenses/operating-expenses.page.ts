import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { OtherOperatingExpensePage } from '../other-operating-expense/other-operating-expense.page';
import { ModalController } from '@ionic/angular';
import { ReportsService } from 'src/app/services/reports.service';
import { OptionsService } from 'src/app/services/options.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operating-expenses',
  templateUrl: './operating-expenses.page.html',
  styleUrls: ['./operating-expenses.page.scss'],
})
export class OperatingExpensesPage implements OnInit {

  operatingExpensesForm:FormGroup
  returnedData:any;
  expenseList=[];
  total:any;
  rent:number;
  transportToBusiness:number;
  transportForStock:number;
  communication:number;
  salaries:number;
  utilityBill:number;
  fees:number
  loanInstallments:number
  additionalOp:number

  constructor(
    private fb:FormBuilder,
    public modalController: ModalController,
    private report:ReportsService,
    public option:OptionsService,
    public router:Router
    ) { }

  ngOnInit() {
    this.operatingExpensesForm = this.fb.group({
        rent:new FormControl(),
        transportToBusiness:new FormControl(),
        transportForStock:new FormControl(),
        communication:new FormControl(),
        salaries:new FormControl(),
        utilityBill: new FormControl(),
        fees: new FormControl(),
        loanInstallments: new FormControl()

    })
  }
  totalExpense(){

    setTimeout(() => {
      this.total = 0
      this.additionalOp = 0
          this.rent = this.operatingExpensesForm.controls['rent'].value
          this.transportToBusiness = this.operatingExpensesForm.controls['transportToBusiness'].value
          this.transportForStock = this.operatingExpensesForm.controls['transportForStock'].value
          this.communication = this.operatingExpensesForm.controls['communication'].value
          this.salaries =  this.operatingExpensesForm.controls['salaries'].value
          this.utilityBill = this.operatingExpensesForm.controls['utilityBill'].value
          this.fees = this.operatingExpensesForm.controls['fees'].value
          this.loanInstallments = this.operatingExpensesForm.controls['loanInstallments'].value
  
          if(this.expenseList && this.expenseList.length>0){
            this.expenseList.forEach(obj=>{
              this.additionalOp +=obj.amount 
            })
         
  
          }else{
            console.log("o")
  
            this.additionalOp = 0
          }
          if(this.rent===null)
          this.rent = 0
  
          if(this.transportToBusiness===null)
            this.transportToBusiness = 0
  
           if(this.transportForStock===null) 
           this.transportForStock = 0
  
           if(this.communication===null)
           this.communication = 0
  
           if(this.salaries===null)
           this.salaries = 0
  
           if(this.utilityBill===null)
           this.utilityBill = 0
  
           if(this.fees===null)
           this.fees = 0
  
           if(this.loanInstallments===null)
           this.loanInstallments = 0
  
           this.total = this.rent + this.transportToBusiness + this.transportForStock + this.communication +
              this.salaries + this.utilityBill + this.fees + this.loanInstallments + this.additionalOp
    },100);
    
  }

  getModal(){
   
    this.addExpense()
  }

  async addExpense(){
  

    const modal = await this.modalController.create({
      component: OtherOperatingExpensePage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
       this.returnedData = dataReturned.data
       if(this.returnedData!==undefined){
        this.expenseList.push(this.returnedData)
        this.totalExpense()
       }
  
   
      }
    });
    return await modal.present();

  }

  submit(){
      this.report.operatingExpensesAmnt(this.total)      
      this.router.navigate(['/menu/loan-appraisal/business-financial'])
    
  }
  // redirect(){
  //   this.router.navigate(['/menu/business-financial'])
  // }

}
