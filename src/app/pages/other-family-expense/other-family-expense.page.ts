import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-other-family-expense',
  templateUrl: './other-family-expense.page.html',
  styleUrls: ['./other-family-expense.page.scss'],
})
export class OtherFamilyExpensePage implements OnInit {
form:FormGroup
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      name:new FormControl('',[Validators.required]),
      amount: new FormControl('',[Validators.required])
    })
  }

  submit(){
    this.modalCtrl.dismiss(this.form.value);

  }
  dismiss(){
    this.modalCtrl.dismiss(); 
  }

}
