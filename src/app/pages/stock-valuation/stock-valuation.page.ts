import { Component, OnInit, ɵConsole, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddStockPage } from '../add-stock/add-stock.page';
import { ReportsService } from 'src/app/services/reports.service';
import { OptionsService } from 'src/app/services/options.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-stock-valuation',
  templateUrl: './stock-valuation.page.html',
  styleUrls: ['./stock-valuation.page.scss'],
})
export class StockValuationPage implements OnInit {

tableStyle = 'bootstrap';
dataReturned:any;
product:any[]=[];
  constructor(public modalController: ModalController,
    private report: ReportsService,
    private option:OptionsService,
    public router:Router
    ) { }
  
  ngOnInit() {
   
  }

  switchStyle(){

  }

  getRowClass(row){

  }

  async open(row){

  }

  addStocks(){
    console.log("add stock")
    this.presentModal()
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddStockPage
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== undefined) {
        console.log(dataReturned.data)
        let arr =dataReturned.data
        for(var i=0;i<arr.length;i++){
          console.log(arr[i])
        }
        arr.forEach(obj=>{
          let stock = obj.quantity * obj.cost
          let margin =((((obj.price * obj.quantity)-(obj.cost * obj.quantity))*100)/(obj.price * obj.quantity))
          obj.stock = stock
          obj.margin = margin
          console.log(stock+" "+margin)
          this.product.push(obj)
          
        })
        this.report.stockValuationAmnt(this.product)
       // this.option.add("stock-valuation")
        
     
      }
     

    });

    return await modal.present();

  }

  redirect(){
    this.router.navigate(['/menu/loan-appraisal/daily-sales-metrics'])
  }






}
