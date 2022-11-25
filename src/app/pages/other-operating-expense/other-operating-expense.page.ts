import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-other-operating-expense',
  templateUrl: './other-operating-expense.page.html',
  styleUrls: ['./other-operating-expense.page.scss'],
})
export class OtherOperatingExpensePage implements OnInit {

  operatingExpenseForm:FormGroup;
  constructor(private fb:FormBuilder,private modalCtrl: ModalController) { }

  ngOnInit() {

    this.operatingExpenseForm = this.fb.group({
      name: new FormControl('',[Validators.required]),
      amount:new FormControl('',[Validators.required])
    })
  }

  addExpense(){
    this.modalCtrl.dismiss(this.operatingExpenseForm.value);
  }
  onClick() {
    this.modalCtrl.dismiss();  
  }

}
