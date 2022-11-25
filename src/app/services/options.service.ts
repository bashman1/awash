import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OptionsService implements OnInit {

  available:any[]
  selected=[]
  constructor(private router: Router) {

   }

   ngOnInit(){
     this.available=[
       {value:"loan-details",name:"Loan Details"},
       {value:"family-earning",name:"Family Earnings"},
       {value:"family-expenses",name:"Family Expenses"},
       {value:"stock-valuation",name:"Stock Valuation"},
       {value:"daily-sales-metrics",name:"Sales Metrics"},
       {value:"operating-expenses",name:"Operating Expenses"},
       {value:"business-financial",name:"Business Financial"}
     ]
     console.log(this.available)
   }

   add(value){
    console.log(value)
      let size = this.available.length
      console.log(size)

      for(var i=0;i<size;i++){
       
        if(this.available[i].value === value){
          console.log(this.available[i])
          this.selected.push(this.available[i])
          this.available.splice(i,1);
          this.router.navigate(['/menu',value])
          break;
        }
      }

      console.log(this.available)
      console.log("*******************************")
      console.log(this.selected)
   }
}
