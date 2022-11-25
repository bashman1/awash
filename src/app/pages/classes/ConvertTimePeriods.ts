export class ConvertTimePeriods{
   productNoOfPeriods:any;
   productUnitOfPeriods:any;
   userNoOfPeriods:any;
   userUnitOfPeriods:any;
   maxNumberOfPeriods:any;
   maxNumberOfPeriodsUnit:any;
  convertTimePeriods(productNoOfPeriods: any,productUnitOfPeriods:any,userNoOfPeriods: any,userUnitOfPeriods:any) {
      this.productNoOfPeriods = productNoOfPeriods;
      this.productUnitOfPeriods = productUnitOfPeriods;
      this.userNoOfPeriods = userNoOfPeriods;
      this.userUnitOfPeriods = userUnitOfPeriods;
      if(this.productUnitOfPeriods==="Day(s)" && this.userUnitOfPeriods==="Day(s)"){
          this.maxNumberOfPeriods = this.productNoOfPeriods;
          this.maxNumberOfPeriodsUnit = "Day(s)";
      }else if(this.productUnitOfPeriods==="Day(s)" && this.userUnitOfPeriods==="Week(s)"){
          this.maxNumberOfPeriods = this.productNoOfPeriods / 7;
          this.maxNumberOfPeriodsUnit = "Week(s)";
      }else if(this.productUnitOfPeriods==="Day(s)" && this.userUnitOfPeriods==="Month(s)"){
          this.maxNumberOfPeriods = this.productNoOfPeriods * 30;
          this.maxNumberOfPeriodsUnit = "Month(s)"
      }else if(this.productUnitOfPeriods==="Day(s)" && this.userUnitOfPeriods==="Year(s)"){
          this.productNoOfPeriods / 360;
          this.maxNumberOfPeriodsUnit = "Year(s)"
      }
  
      if(this.productUnitOfPeriods==="Week(s)" && this.userUnitOfPeriods==="Day(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods*7;
         this.maxNumberOfPeriodsUnit = "Day(s)"
      }else if(this.productUnitOfPeriods==="Week(s)" && this.userUnitOfPeriods==="Week(s)"){
        this.maxNumberOfPeriods = this.productNoOfPeriods;
        this.maxNumberOfPeriodsUnit = "Week(s)"
      }else if(this.productUnitOfPeriods==="Week(s)" && this.userUnitOfPeriods==="Month(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods * 4;
         this.maxNumberOfPeriodsUnit = "Month(s)"
      }else if(this.productUnitOfPeriods==="Week(s)" && this.userUnitOfPeriods==="Year(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods * 52;
         this.maxNumberOfPeriodsUnit = "Year(s)"
      }
  
      if(this.productUnitOfPeriods==="Month(s)" && this.userUnitOfPeriods==="Day(s)"){
          this.maxNumberOfPeriods = this.productNoOfPeriods * 30;
          this.maxNumberOfPeriodsUnit = "Day(s)"
      }else if(this.productUnitOfPeriods==="Month(s)" && this.userUnitOfPeriods==="Week(s)"){
          this.maxNumberOfPeriods = this.productNoOfPeriods * 4;
          this.maxNumberOfPeriodsUnit = "Week(s)"
      }else if(this.productUnitOfPeriods==="Month(s)" && this.userUnitOfPeriods==="Month(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods;
         this.maxNumberOfPeriodsUnit = "Month(s)"
      }else if(this.productUnitOfPeriods==="Month(s)" && this.userUnitOfPeriods==="Year(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods / 12;
         this.maxNumberOfPeriodsUnit = "Year(s)"
      }
  
      if(this.productUnitOfPeriods==="Year(s)" && this.userUnitOfPeriods==="Day(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods/360;
         this.maxNumberOfPeriodsUnit = "Day(s)"
      }else if(this.productUnitOfPeriods==="Year(s)" && this.userUnitOfPeriods==="Week(s)"){
        this.maxNumberOfPeriods = this.productNoOfPeriods/52;
        this.maxNumberOfPeriodsUnit = "Week(s)"
      }else if(this.productUnitOfPeriods==="Year(s)" && this.userUnitOfPeriods==="Month(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods/12;
         this.maxNumberOfPeriodsUnit = "Month(s)"
      }else if(this.productUnitOfPeriods==="Year(s)" && this.userUnitOfPeriods==="Year(s)"){
         this.maxNumberOfPeriods = this.productNoOfPeriods;
         this.maxNumberOfPeriodsUnit = "Year(s)"
      }
      return [this.maxNumberOfPeriods,this.maxNumberOfPeriodsUnit]
  }
  }
  