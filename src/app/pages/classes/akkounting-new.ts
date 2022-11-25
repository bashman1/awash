import {Akkounting} from './Akkounting';

export class AkkountingNew {
// Try edit message
  data = {
    principal:null,
    interestRate:null,
    noOfPayments:null,
    gracePeriod:null,
    startDate:null,
    interestMethod:null
  }
  scheduleItem:any={};
  amortizedSchedule=[];
  interestPayable:any;
  paymentPerPeriod:any;
  totalAmountToPayBack:any;
  interestToBeEarned:any;
  interestToPrincipalRatio:any;
  effectiveTotalNoOfPayments:any;
  repaymentFreqCode: any;
  repaymentFreqVal: any;





  constructor(principal:any, interest:any,noOfPayments:any,graceperiod:any,
              startDate:any,interestMethod:any,repmnt_freq_cd,rpmt_freq_val){
    this.data.principal = principal;
    this.data.interestRate = interest;
    this.data.noOfPayments = noOfPayments;
    if(graceperiod==null || graceperiod==undefined){
      this.data.gracePeriod = 0;
    }else{
      this.data.gracePeriod = graceperiod;
    }
    this.data.startDate = startDate;
    this.data.interestMethod = interestMethod
    this.repaymentFreqVal = rpmt_freq_val;
    this.repaymentFreqCode = repmnt_freq_cd;

    this.generateFirstItem();
  }
// reducingBalance
  roundToXDigits(value: number, digits: number) {
    value = value * Math.pow(10, digits);
    value = Math.round(value);
    value = value / Math.pow(10, digits);
    return value;
  }
  generateFirstItem(){

    this.effectiveTotalNoOfPayments = this.data.noOfPayments - this.data.gracePeriod
    this.scheduleItem.openingbal = this.data.principal;
    if(this.data.interestMethod=="flat_rate"){
      this.interestPayable = this.roundToXDigits(this.data.interestRate*this.data.principal,2)
      this.paymentPerPeriod = this.roundToXDigits(((this.data.principal+this.data.interestRate*this.data.principal*this.effectiveTotalNoOfPayments)/this.effectiveTotalNoOfPayments),2)
    }else if(this.data.interestMethod=="reducing_rate"){
      this.interestPayable = this.roundToXDigits(this.data.interestRate*this.scheduleItem.openingbal,2)
      this.paymentPerPeriod =this.roundToXDigits(((this.data.principal*this.data.interestRate*Math.pow((this.data.interestRate+1),this.effectiveTotalNoOfPayments)))/((Math.pow((this.data.interestRate+1),this.effectiveTotalNoOfPayments))-1),2)
    }
    this.interestToBeEarned  = this.roundToXDigits((this.paymentPerPeriod*this.effectiveTotalNoOfPayments)-this.data.principal + this.interestPayable * this.data.gracePeriod,2)
    this.totalAmountToPayBack =this.roundToXDigits( this.data.principal+this.interestToBeEarned,2)
    this.interestToPrincipalRatio  = (this.interestToBeEarned/this.data.principal)*100
    this.scheduleItem.number = 1;
    this.scheduleItem.startDate =  this.data.startDate;
    this.scheduleItem.intpayable = this.interestPayable;
    if(this.data.gracePeriod>1){
      this.scheduleItem.prinpayable = 0;
    }else{
      this.scheduleItem.prinpayable = this.roundToXDigits( this.paymentPerPeriod - this.scheduleItem.intpayable,2);
    }
    if(this.data.gracePeriod>=1){
      this.scheduleItem.installmentamount = this.roundToXDigits(this.scheduleItem.intpayable,2);
    }else{
      this.scheduleItem.installmentamount = this.roundToXDigits(this.paymentPerPeriod,2);
    }


    this.scheduleItem.closingbal = this.roundToXDigits(this.scheduleItem.openingbal - this.scheduleItem.prinpayable,2);
    this.scheduleItem.totalpaid =this.roundToXDigits( this.scheduleItem.installmentamount,2);
    if((this.scheduleItem.totalpaid-this.totalAmountToPayBack)>0){
      this.scheduleItem.gracepprovision = this.scheduleItem.totalpaid - this.totalAmountToPayBack;
    }else{
      this.scheduleItem.gracepprovision = this.totalAmountToPayBack - this.scheduleItem.totalpaid;
    }
//Push first schedule item
    this.amortizedSchedule.push(this.scheduleItem)
    this.scheduleItem={}
    while(this.amortizedSchedule.length<this.data.noOfPayments){
      let item = this.generateOtherItems(this.amortizedSchedule)
      // console.log(item)
      this.amortizedSchedule.push(item)
      this.scheduleItem={}
    }
    return this.amortizedSchedule;
  }//End of function


 generateOtherItems(array){
  if(array.length>0){
    let interestPayable;
    let paymentPerPeriod;
    let lastItemIndex = array.length - 1;
    let lastSchecudleItem = array[lastItemIndex];
    this.scheduleItem.number = lastSchecudleItem.number+1
    if(this.repaymentFreqCode=="Year(s)"){
      this.scheduleItem.startDate = new Date(lastSchecudleItem.startDate.setFullYear(lastSchecudleItem.startDate.getFullYear()+this.repaymentFreqVal))
    }if(this.repaymentFreqCode=="Month(s)"){
      this.scheduleItem.startDate =  new Date( lastSchecudleItem.startDate.setMonth(lastSchecudleItem.startDate.getMonth()+this.repaymentFreqVal))
    }else if(this.repaymentFreqCode=="Week(s)"){
      this.scheduleItem.startDate = new Date( lastSchecudleItem.startDate.setDate(lastSchecudleItem.startDate.getDate()+this.repaymentFreqVal*7))
    }else if(this.repaymentFreqCode=="Day(s)"){
      this.scheduleItem.startDate = new Date(lastSchecudleItem.startDate.setDate(lastSchecudleItem.startDate.getDate()+this.repaymentFreqVal))


    }
    if(this.data.noOfPayments!=0){
      if(lastSchecudleItem.gracepprovision<0.1){
        this.scheduleItem.openingbal = 0
      }else{
        this.scheduleItem.openingbal = lastSchecudleItem.closingbal;
      }
    }
    if(this.data.interestMethod=="flat_rate"){
      interestPayable = this.roundToXDigits( this.data.interestRate*this.data.principal,2)
      paymentPerPeriod = this.roundToXDigits( ((this.data.principal+this.data.interestRate*this.data.principal*this.effectiveTotalNoOfPayments)/this.effectiveTotalNoOfPayments),2)
    }else if(this.data.interestMethod=="reducing_rate"){
      interestPayable =this.roundToXDigits( this.data.interestRate*this.scheduleItem.openingbal,2)
      paymentPerPeriod =this.roundToXDigits( ((this.data.principal*this.data.interestRate*Math.pow((this.data.interestRate+1),this.effectiveTotalNoOfPayments)))/((Math.pow((this.data.interestRate+1),this.effectiveTotalNoOfPayments))-1),2)
    }
//interest payabele
    if(this.scheduleItem.openingbal==0){
      this.scheduleItem.intpayable = 0;
    }else{
      this.scheduleItem.intpayable = interestPayable;
    }

    //installment amount
    if(this.data.gracePeriod>=this.scheduleItem.number){
      this.scheduleItem.installmentamount = this.scheduleItem.intpayable;
    }else{
      if(this.scheduleItem.openingbal==0){
        this.scheduleItem.installmentamount = 0;
      }else{
        this.scheduleItem.installmentamount = paymentPerPeriod;

      }
    } //End of installment payable

    if(this.scheduleItem.prinpayable==0){
      this.scheduleItem.prinpayable = 0;
    }else{
      if(this.data.gracePeriod>=this.scheduleItem.number){
        this.scheduleItem.prinpayable = 0;
      }else{
        this.scheduleItem.prinpayable = this.roundToXDigits( this.scheduleItem.installmentamount - this.scheduleItem.intpayable,2)
      }
    }

    if(this.data.noOfPayments!=null){
      if(lastSchecudleItem.gracepprovision<0.1){
        this.scheduleItem.closingbal = 0;
      }else{
        this.scheduleItem.closingbal =this.roundToXDigits(this.scheduleItem.openingbal-this.scheduleItem.prinpayable,2)
      }
    }
    if(this.scheduleItem.installmentamount==0){
      this.scheduleItem.totalpaid = 0;
    }
    if(lastSchecudleItem.openingbal+lastSchecudleItem.intpayable==paymentPerPeriod){
      this.scheduleItem.totalpaid = 0;
    }else{
      this.scheduleItem.totalpaid = this.roundToXDigits(lastSchecudleItem.totalpaid+this.scheduleItem.installmentamount,2);
    }

    if((this.scheduleItem.totalpaid-this.totalAmountToPayBack)>0){
      this.scheduleItem.gracepprovision =this.roundToXDigits(this.scheduleItem.totalpaid - this.totalAmountToPayBack,2);
    }else{
      this.scheduleItem.gracepprovision =this.roundToXDigits( this.totalAmountToPayBack - this.scheduleItem.totalpaid,2);
    }
    return this.scheduleItem
  }
}//End of function

}

