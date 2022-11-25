import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-self-registration-modal',
  templateUrl: './self-registration-modal.page.html',
  styleUrls: ['./self-registration-modal.page.scss'],
})
export class SelfRegistrationModalPage implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  customer() {
    console.log("customer dismiss")
     this.dismiss('customer');

  }
  institution() {
    console.log("institution dismiss")

     this.dismiss('institution');
  }

  dismiss(data) {
    this.modalCtrl.dismiss();
  }

}
