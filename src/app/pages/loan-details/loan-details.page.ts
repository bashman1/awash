import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';
import { OptionsService } from 'src/app/services/options.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.page.html',
  styleUrls: ['./loan-details.page.scss'],
})
export class LoanDetailsPage implements OnInit {


  loanDetails:FormGroup;
  validation_messages = {
   'amount1': [
     { type: 'required', message: 'Loan Amount is required.' },
     { type: 'min', message: 'The minimum loan amount is 0.' },
     
   ],
   'duration': [
     { type: 'required', message: 'Loan Period is required.' },
     { type: 'min', message: 'The minimum loan period is 1.' },
   ],
   'rate': [
     { type: 'required', message: 'Loan Interest is required.' },
     { type: 'min', message: 'The minimum loan interest is 0.' },
   ],
   'installment': [
     { type: 'required', message: 'Loan Installment is required.' },
     { type: 'min', message: 'The minimum loan Installment is 0.' },
   ],
   'fee': [
    { type: 'required', message: 'Loan fee is required.' },
   ],

   'collateral': [
    { type: 'required', message: 'Loan collateral is required.' },
   ],
  }
 
   constructor(
     private report:ReportsService,
     private router:Router,
     private option:OptionsService,
     public toastController: ToastController
     ) {}
 
     ngOnInit(){
    
      this.loanDetails = new FormGroup({
        amount1:new FormControl('',[Validators.required,Validators.min(0)]),
        duration:new FormControl('',[Validators.required,Validators.min(1)]),
        periodUnit:new FormControl('',[]),
        fee:new FormControl('',[Validators.required,Validators.min(0)]),
        collateral:new FormControl('',[Validators.required,Validators.min(0)]),
        rate:new FormControl('',[Validators.required,Validators.min(0),Validators.max(100)]),
        durationUnit:new FormControl(),
        interestMethod:new FormControl()
  
      })
      this.loanDetails.controls['durationUnit'].setValue('Day(s)')
      this.loanDetails.controls['interestMethod'].setValue('flat_rate')
  
  
    }
 
   submit(){
    console.log("submit")
    if(this.loanDetails.valid){
      this.report.loanDetailsAmnt(this.loanDetails.value)    
      this.router.navigate(['/menu/loan-appraisal/family-earning'])
   

    }
    else{
      this.presentToast("Please Fill the form")
      return
    }
   
    
  }
   async presentToast(message) {
     const toast = await this.toastController.create({
       message: message,
       duration: 2000,
       position: 'bottom',
     });
     toast.present();
   }
 

}
