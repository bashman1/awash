import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-daily-averages',
  templateUrl: './daily-averages.page.html',
  styleUrls: ['./daily-averages.page.scss'],
})
export class DailyAveragesPage implements OnInit {

dailyAverageForm:FormGroup;

  constructor(private fb:FormBuilder,private modalCtrl: ModalController) { }

  ngOnInit() {
    this.dailyAverageForm = this.fb.group({
      goodDay:new FormControl(),
      normalDay: new FormControl(),
      badDay: new FormControl
    })
  }

  submit(){
    this.modalCtrl.dismiss(this.dailyAverageForm.value);
  }

  dismiss(){
    this.modalCtrl.dismiss();  
  }

}
