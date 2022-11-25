import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OptionsService } from 'src/app/services/options.service';

@Component({
  selector: 'app-menu-options',
  templateUrl: './menu-options.page.html',
  styleUrls: ['./menu-options.page.scss'],
})
export class MenuOptionsPage implements OnInit {

   available:any[]

  constructor(
    private modalCtrl: ModalController,
    private options: OptionsService
    ) { }

  ngOnInit() {
    this.available = this.options.available
    console.log(this.available)
  }

  selected(value){
    console.log(value.detail.value)
    this.modalCtrl.dismiss(value.detail.value);



  }

}
