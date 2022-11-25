import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  projectName:string
  projectCategory:string;
  projectDescription:string;
  loanDetails:any
  amount1:number=0;
  loanTerm:number;
  loanInterest:number;
  installment:number;
  familyEarnings:any;
  familyExpenses:any;
  stockValuation:any;
  salesMetrics:any;
  operatingExpense:any;
  businessFinancial:any;
  dailySalesAv:number;
  monthlySales:number;
  costOfSales:number;
  totalPurchases:number = 0;
  totalMonthlySales:number = 0;
  spouseInflow:number = 0;
  totalCash:number = 0;
  spouseCash:number = 0;
  bankCash:number = 0;
  receivables:number = 0;
  furniture:number= 0;
  vehicles:number = 0;
  premises:number = 0;
  equipment:number = 0;
  loans:number = 0;
  shortTermDebt:number = 0;
  longTermDebt:number = 0;
  sales:number=0
  collateral:number=0
  proposedInstallment:number=0
  spouseMonthlySales: number=0;
  spouseFixedAssets: number=0;
  spouseMonthlyPurchases: number=0;
  stockValue: number=0;
  operationalExpenses: number=0;
  spouseOperationalExpenses: number = 0;
  spouseOutflow: number = 0;
  spouseSurplus: number = 0;
  otherBusinessIncome: number = 0;
  loanFrequency: any;
  interestMethod: any;
  stepper0:any;
  stepper1:any;
  stepper2:any;
  stepper3:any;
   spouse: any;
   spouse_buz_inquiry: any;
   customerNo: any;
  
  

  constructor() { }

  projectDetails(form){
    console.log(form)
    this.projectName = form.projectName;
    this.projectCategory = form.category;
    this.projectDescription = form.projectDescription

  }
  loanDetailsAmnt(value){
     ///console.log(value)
     this.amount1 = value.amount1
     this.loanTerm = value.duration
     this.loanInterest = ((value.rate/100)/12)
     console.log(this.loanInterest)
    this.installment = this.amount1*(((this.loanInterest*(Math.pow((1+this.loanInterest),this.loanTerm))))/((Math.pow((1+this.loanInterest),this.loanTerm))-1))
    console.log(this.installment)
    this.collateral = value.collateral;
    this.proposedInstallment = value.installment;
    this.loanFrequency = value.durationUnit;
    this.interestMethod = value.interestMethod;

    this.stepper2 = value;
    console.log("*******************")
    console.log(this.stepper2)


  }

  /*
  * spouseExist- boolean value for whether applicant has spouse or not
  * spouseBusiness - boolean value for whether applicant spouse got a business
  * */
  familyEarningsAmnt(spouseExist,spouseBusiness,value){
    console.log("familyEarningsAmnt "+JSON.stringify(value))
    this.familyEarnings = value;
    this.spouse = spouseExist;
    this.spouse_buz_inquiry = spouseBusiness;
    
    this.spouseCash = value.cash;
    this.spouseMonthlySales = value.monthlySales;
    this.spouseFixedAssets = value.fixedAssets;
    this.spouseMonthlyPurchases = value.monthlyPurchases;
    this.stockValue  = value.stockValue;
    this.spouseOperationalExpenses = value.operationalExpenses

    this.spouseInflow = this.spouseCash + this.spouseMonthlySales;
    this.spouseOutflow = this.spouseMonthlyPurchases + this.spouseOperationalExpenses;
    this.spouseSurplus = this.spouseInflow - this.spouseOutflow;

  }
  familyExpensesAmnt(value){
    this.familyExpenses = value;

    console.log(this.familyExpenses)
  }
  stockValuationAmnt(value){
    console.log("stock valuation")
    console.log(this.totalMonthlySales)
    console.log(this.totalPurchases)
   // if(this.totalMonthlySales ===undefined)
        this.totalMonthlySales = 0

    //if(this.totalPurchases===undefined)
        this.totalPurchases = 0

    console.log("stockValuationAmnt"+JSON.stringify(value))
    value.forEach(element => {
      this.totalMonthlySales +=(element.price * element.quantity);
      this.totalPurchases +=  (element.cost * element.quantity);
    });
    console.log("After calc "+this.totalMonthlySales)
    console.log("After calc "+this.totalPurchases)

    this.totalCostOfSales()

  }
  dailySalesMetricsAmnt(form,total){
    console.log("dailySalesMetricsAmnt"+JSON.stringify(form))
    this.dailySalesAv = total/7

    //daily av * each day in a week * each week in a month
    this.monthlySales = this.dailySalesAv * 4 * 7
    console.log(this.monthlySales)
    this. totalCostOfSales()
  }
  operatingExpensesAmnt(value){
    console.log("operatingExpensesAmnt "+JSON.stringify(value))
    this.operatingExpense = value
    console.log(this.operatingExpense)
  }
  businessFinancialAmnt(value,form){
    console.log("businessFinancialAmnt "+JSON.stringify(value))
    console.log(form.amount3)
    if(form.amount3===null)
        form.amount3 = 0

    if(form.amount7 === null)
      form.amount7 = 0

    if(form.debtsBelow3 === null )
    form.debtsBelow3 = 0

    if(form.debtsOver3 === null )
        form.debtsOver3 = 0

    if(form.furniture_value === null)
        form.furniture_value = 0
      
    if(form.vehicle_value === null)
      form.vehicle_value = 0

    if(form.buzPremises_value === null)
        form.buzPremises_value = 0

    if(form.equipment_value === null)
       form.equipment_value = 0
    
    if(form.amountTo_collect === null)
      form.amountTo_collect = 0
      
    if(form.earning_from_other_buz === null)
        form.earning_from_other_buz = 0
      
       /** Current Assets */
    this.totalCash = form.amount3
    this.bankCash = form.amount7
    this.receivables = form.amountTo_collect
    console.log("recivables "+this.receivables)

     /** fixed Assets */
     this.furniture = form.furniture_value;
     this.vehicles = form.vehicle_value;
     this.premises = form.buzPremises_value;
     this.equipment = form.equipment_value;

     /**short term liabilities */
     
     this.shortTermDebt = form.debtsBelow3

     /**Long term liabilities */
     this.longTermDebt = form.debtsOver3;

     /**Other business income */
     this.otherBusinessIncome = form.netEarning;

    this.stepper3 = form;
    this.stepper3['businessName'] = this.projectName;
    this.stepper3['buzSector'] = this.projectCategory;
    this.stepper3['spouse'] = this.spouse;
    this.stepper3['spouse_buz_inquiry'] = this.spouse_buz_inquiry;
    this.stepper3['cash'] = this.spouseCash;
    this.stepper3['sales_value'] = this.spouseMonthlySales;
    this.stepper3['purchases_value'] = this.spouseMonthlyPurchases;
    this.stepper3['expense_value'] = this.spouseOperationalExpenses;

    this.stepper2['debts_due'] = this.shortTermDebt;
    this.stepper2['debts_due_over'] = this.longTermDebt;
    console.log("*********STEPPER 2**************");
    console.log(this.stepper2);
    console.log("*********STEPPER 3**************");
    console.log(this.stepper3);




  }
  totalCostOfSales(){

   if(this.monthlySales === undefined)
    this.monthlySales = 0;

    // if(this.totalMonthlySales === undefined)
    //    this.totalMonthlySales = 0;

    if(this.totalMonthlySales === undefined){
      this.costOfSales = 0
    }else{

//get sales which is the min of the daily average for the whole month(daily*4*7) and the sales according to stock n the selling value
    this.sales = Math.min(this.monthlySales,this.totalMonthlySales)

    //get cost of sales
    this.costOfSales = (this.totalPurchases/this.totalMonthlySales) * this.sales
  }
    console.log(this.costOfSales)
  }


 /*
 inquiry -- whether member is already registered or not
 form -- details of the member

 */
    customerDetails(inquiry,form){
      this.customerNo = form.cust_no
      this.stepper0={"customer_exists":inquiry};
      this.stepper1=form


      console.log("******************************")

      console.log(this.stepper0)
      console.log(this.stepper1)

    }

}
