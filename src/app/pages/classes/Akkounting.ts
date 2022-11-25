export class Akkounting{ 
    interestAmount:any;
    noOfdays: any;
    numberOfRepayments: any;
    paymentPerPeriod:any;
    totalAmount: any;
    interestMethod="FLAT_RATE";
  noOfPayments: any;

  calculatePaymentPerPeriod(timePeriod: any,interestRate:any,principalAmount:any,interestMethod:any) {
        let noOfPeriods = timePeriod; let paymentAmount = null;
        if(interestMethod==="FLAT_RATE"){
          paymentAmount = ((principalAmount * interestRate * noOfPeriods)/noOfPeriods)+(principalAmount/noOfPeriods);
        }else if(interestMethod==="REDUCING_BALANCE"){
          paymentAmount  = interestRate*principalAmount/(1- (Math.pow((1+interestRate),-noOfPeriods)));
        }
        return paymentAmount;
    }
getNumberOfPayments(interestRate: any,amount:any,principalAmount:any) {
    let amountPerPeriod = amount; let numberOfPayments= null;
      numberOfPayments  = -Math.log(1-interestRate*principalAmount/amountPerPeriod)/Math.log(1+interestRate);
    return numberOfPayments;
}
convertPercentages(interestFrequency:any, durationIn:any, interestRate:any){
    if(durationIn ==="Day(s)"){this.interestAmount = (interestRate/365)/100;}
    if(durationIn ==="Week(s)"){this.interestAmount = (interestRate/52.143)/100;}
    if(durationIn ==="Month(s)"){this.interestAmount =(interestRate/12)/100;}
    if(durationIn ==="Year(s)"){this.interestAmount = (interestRate/100);}
    return this.interestAmount;
}
  newConvertPercentages(durationIn:any, interestRate:any,freqCd){
    if(durationIn ==="Day(s)"){this.interestAmount = (interestRate/365)/100;}
    if(durationIn ==="Week(s)"){this.interestAmount = (interestRate/52.143)/100;}
    if(durationIn ==="Month(s)"){this.interestAmount =(interestRate/12)/100;}
    if(durationIn ==="Year(s)"){this.interestAmount = (interestRate/100);}
    if(freqCd==="Month(s)" && durationIn ==="Year(s)"){
      this.interestAmount = this.interestAmount/12;
    }
    return this.interestAmount;
  }
  
checkLeapYear(year:any){
    if(year % 4 == 0 && ( year % 100 != 0 || year % 400 == 0 )){
        this.noOfdays = 366;
    }else{
        this.noOfdays = 365;
    }
    return this.noOfdays;
}
getNoOfPaymentsOne(loanTerm:any,termCode:any,paymentFreqVal,paymentFreqCd){
  //
  if(termCode=="Year(s)" && paymentFreqCd=="Year(s)"){
    this.noOfPayments = loanTerm/paymentFreqVal;
  }if(termCode=="Year(s)" && paymentFreqCd=="Month(s)"){
    this.noOfPayments = loanTerm*12/paymentFreqVal;
  }if(termCode=="Year(s)" && paymentFreqCd=="Week(s)"){
    this.noOfPayments = loanTerm*52/paymentFreqVal;
  }if(termCode=="Year(s)" && paymentFreqCd=="Day(s)"){
    this.noOfPayments = loanTerm*360/paymentFreqVal;
  }
  //
  if(termCode=="Months(s)" && paymentFreqCd=="Year(s)"){
    this.noOfPayments = loanTerm*12/paymentFreqVal;
  }if(termCode=="Month(s)" && paymentFreqCd=="Month(s)"){
    this.noOfPayments = loanTerm/paymentFreqVal;
  }if(termCode=="Month(s)" && paymentFreqCd=="Week(s)"){
    this.noOfPayments = loanTerm*4/paymentFreqVal;
  }if(termCode=="Month(s)" && paymentFreqCd=="Day(s)"){
    this.noOfPayments = loanTerm*30/paymentFreqVal;
  }
  //
  if(termCode=="Week(s)" && paymentFreqCd=="Year(s)"){
    this.noOfPayments = loanTerm/52/paymentFreqVal;
  }if(termCode=="Week(s)" && paymentFreqCd=="Month(s)"){
    this.noOfPayments = loanTerm/12/paymentFreqVal;
  }if(termCode=="Week(s)" && paymentFreqCd=="Week(s)"){
    this.noOfPayments = loanTerm/paymentFreqVal;
  }if(termCode=="Week(s)" && paymentFreqCd=="Day(s)"){
    this.noOfPayments = loanTerm*7/paymentFreqVal;
  }
  //
  if(termCode=="Day(s)" && paymentFreqCd=="Year(s)"){
    this.noOfPayments = loanTerm/360/paymentFreqVal;
  }if(termCode=="Day(s)" && paymentFreqCd=="Month(s)"){
    this.noOfPayments = loanTerm/30/paymentFreqVal;
  }if(termCode=="Day(s)" && paymentFreqCd=="Week(s)"){
    this.noOfPayments = loanTerm/7/paymentFreqVal;
  }if(termCode=="Day(s)" && paymentFreqCd=="Day(s)"){
    this.noOfPayments = loanTerm/paymentFreqVal;
  }
  return this.noOfPayments;
}


getNumberOfRepayments(timeAmount?:any,timeIn?:any, interestRate?:any, interestFrequency?:any,pricipalAmount?:any,repayment_cycle?:any){
   if( timeIn==="Day(s)"){
    if(repayment_cycle==="Week(s)"){
      let weeksFromDays = timeAmount/7
      let timeIn="weeks";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.numberOfRepayments=null;
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(weeksFromDays,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);

    }else if(repayment_cycle==="Month(s)"){
      let monthsFromDays = timeAmount/31;
      let timeIn="Month(s)";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(monthsFromDays,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else if(repayment_cycle==="Year(s)"){
      let yearsFromDays= timeAmount/365;
      let timeIn="Year(s)";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(yearsFromDays,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
   }else{
     this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate);
     this.paymentPerPeriod =  this.calculatePaymentPerPeriod(timeAmount,this.interestAmount,pricipalAmount,this.interestMethod);
     this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
   }
  }
   if( timeIn==="Week(s)"){
    if(repayment_cycle==="Day(s)"){
      let daysFromWeeks = timeAmount*7
      let timeIn="days";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(daysFromWeeks,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else if(repayment_cycle==="Month(s)"){
      let monthsFromWeeks = timeAmount/4;
      let timeIn="Week(s)";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(monthsFromWeeks,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else if(repayment_cycle==="Year(s)"){
      let yearsFromWeeks = timeAmount/52;
      let timeIn="Month(s)";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(yearsFromWeeks,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else{
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate);
      this.paymentPerPeriod =  this.calculatePaymentPerPeriod(timeAmount,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }

   }
   if( timeIn==="Month(s)"){
    if(repayment_cycle==="Day(s)"){
      let daysFromMonths = timeAmount*30.417
      let timeIn="days";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(daysFromMonths,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else if(repayment_cycle==="Week(s)"){
      let weeksFromMonth = timeAmount*4
      let timeIn="Week(s)";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(weeksFromMonth,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else if(repayment_cycle==="Year(s)"){
      let yearsFromMonths = timeAmount/12;
      let timeIn="Year(s)";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(yearsFromMonths,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else{
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate);
      this.paymentPerPeriod =  this.calculatePaymentPerPeriod(timeAmount,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);

    }
  }

  if( timeIn==="Year(s)"){
    if(repayment_cycle==="Month(s)"){
      let monthsFromYears = timeAmount*12
      let timeIn="months";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(monthsFromYears,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else if(repayment_cycle==="Day(s)"){
      let daysFromYear = timeAmount*365
      let timeIn="days";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(daysFromYear,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else if(repayment_cycle==="Week(s)"){
      let weeksFromYear = timeAmount*52
      let timeIn="Week(s)";
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate)
      this.paymentPerPeriod = this.calculatePaymentPerPeriod(weeksFromYear,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }else{
      this.interestAmount = this.convertPercentages(interestFrequency,timeIn,interestRate);
      this.paymentPerPeriod =  this.calculatePaymentPerPeriod(timeAmount,this.interestAmount,pricipalAmount,this.interestMethod);
      this.numberOfRepayments = this.getNumberOfPayments(this.interestAmount,this.paymentPerPeriod,pricipalAmount);
    }
  }
  this.totalAmount = Math.round(this.paymentPerPeriod * this.numberOfRepayments).toFixed(2);
  return [this.numberOfRepayments,this.totalAmount]
}
}
