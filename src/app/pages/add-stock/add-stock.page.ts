import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Stock } from './stock';


@Component({
  selector: 'app-add-stock',
  templateUrl: './add-stock.page.html',
  styleUrls: ['./add-stock.page.scss'],
})
export class AddStockPage implements OnInit {

  productName:String;
  quantity:number;
  cost:number;
  price:number;

  stockArr:any[]=[]

  stock=new Stock(null,null,null,null);

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  dismiss() {
    
       this.modalCtrl.dismiss();    
  } 
  addStock(){
    
    
    this.stockArr.push(this.stock)
    this.stock=new Stock(null,null,null,null)
      
  }

  save(){
    
    this.stockArr.push(this.stock)
    this.modalCtrl.dismiss(this.stockArr);
  }

}
