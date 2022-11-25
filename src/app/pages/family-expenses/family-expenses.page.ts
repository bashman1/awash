import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { ModalController } from '@ionic/angular';
import { OtherFamilyExpensePage } from '../other-family-expense/other-family-expense.page';
import { OptionsService } from 'src/app/services/options.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-expenses',
  templateUrl: './family-expenses.page.html',
  styleUrls: ['./family-expenses.page.scss'],
})
export class FamilyExpensesPage implements OnInit {
  familyExpenseForm:FormGroup;
  expenseList=[];
  returnedData:any;
  total:any;
  additionalExpense:number;

  salary:number;
  entertainment:number;
  utilities:number;
  medication:number;
  education:number;
  clothing:number;
  telephone:number;
  transportation:number;
  rent:number;
  cookingFuel:number;
  food:number;

  constructor(
    private report:ReportsService,
    public modalController: ModalController, 
    public option:OptionsService,
    public router:Router) { }

  ngOnInit() {
    this.familyExpenseForm = new FormGroup({
      food:new FormControl(),
      cookingFuel:new FormControl(),
      rent:new FormControl(),
      transportation:new FormControl(),
      telephone:new FormControl(),
      clothing:new FormControl(),
      education:new FormControl(),
      medication:new FormControl(),
      utilities:new FormControl(),
      entertainment:new FormControl(),
      salary:new FormControl(),
    })
  }

  submit(){
    this.report.familyExpensesAmnt(this.total)    ;
    this.router.navigate(['/menu/loan-appraisal/stock-valuation'])
    
  }
  // redirect(){
  //   this.router.navigate(['/menu/stock-valuation'])
  // }

  getModal(){
   
    this.addExpense()
  }
  async addExpense(){

    const modal = await this.modalController.create({
      component: OtherFamilyExpensePage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
       this.returnedData = dataReturned.data;
       console.log(this.returnedData);
       if(this.returnedData!==undefined){
        this.expenseList.push(this.returnedData);
        this.totalExpense();
       }
  
   
      }
    });
    return await modal.present();
  }

  totalExpense(){
    setTimeout(() => {
      this.total = 0;
      this.additionalExpense = 0;
  
      this.rent = this.familyExpenseForm.controls['rent'].value;
      if(this.rent === null)
          this.rent = 0;
  
      this.food = this.familyExpenseForm.controls['food'].value;
      if(this.food === null)
         this.food = 0;
  
      this.transportation = this.familyExpenseForm.controls['transportation'].value;
      if(this.transportation === null)
         this.transportation = 0;
  
      this.cookingFuel = this.familyExpenseForm.controls['cookingFuel'].value;
      if(this.cookingFuel === null)
         this.cookingFuel = 0;
  
      this.telephone =  this.familyExpenseForm.controls['telephone'].value;
        if(this.telephone === null)
          this.telephone = 0;
  
      this.clothing = this.familyExpenseForm.controls['clothing'].value;
       if(this.clothing == null)
          this.clothing = 0;
  
      this.education = this.familyExpenseForm.controls['education'].value;
       if(this.education === null)
       this.education = 0;
  
      this.medication = this.familyExpenseForm.controls['medication'].value;
      if(this.medication === null)
      this.medication = 0;
  
      this.utilities = this.familyExpenseForm.controls['utilities'].value;
       if(this.utilities === null)
       this.utilities  = 0;
  
      this.entertainment = this.familyExpenseForm.controls['entertainment'].value;
        if(this.utilities === null)
        this.utilities  = 0;
  
      this.salary = this.familyExpenseForm.controls['salary'].value;
       if(this.salary === null)
       this.salary = 0;
  
       if(this.expenseList && this.expenseList.length>0){
        this.expenseList.forEach(obj=>{
          this.additionalExpense +=obj.amount 
        })
     
  
      }else{
        this.additionalExpense = 0
      }
  
       this.total = this.rent + this.food + this.transportation + this.cookingFuel + this.telephone + this.additionalExpense +
                    this.clothing + this.education + this.medication + this.utilities + this.entertainment + this.salary
  
     
  
    },100);
   
  }

}
