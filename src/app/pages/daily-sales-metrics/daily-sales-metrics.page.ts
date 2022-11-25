import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { OptionsService } from 'src/app/services/options.service';
import { Router } from '@angular/router';
import { DailyAveragesPage } from '../daily-averages/daily-averages.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-daily-sales-metrics',
  templateUrl: './daily-sales-metrics.page.html',
  styleUrls: ['./daily-sales-metrics.page.scss'],
})
export class DailySalesMetricsPage implements OnInit {

  days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
 pattern='^\\d{9}$'
 
 
  salesForm:FormGroup
  total:any
  mondayRate:any
  mondaySales:any
  tuesdayRate:any
  tuesdaySales:any
  wednesdayRate:any
  wednesdaySales:any
  thursdayRate:any
  thursdaySales:any
  fridayRate:any
  fridaySales:any
  saturdayRate:any
  saturdaySales:any
  sundayRate:any
  sundaySales:any
  goodDay: number;
  normalDay: number;
  badDay: number;

  




  
  constructor(
    private fb:FormBuilder,
    private report:ReportsService,
    private option:OptionsService,
    private router:Router,
    public modalController: ModalController
    ) { }

  ngOnInit() {
    this.presentModal()

    this.salesForm = this.fb.group({
     
      monday:new FormControl('Monday'),
      tuesday:new FormControl('Tuesday'),
      wednesday:new FormControl('Wednesday'),
      thursday:new FormControl('Thursday'),
      friday:new FormControl('Friday'),
      saturday:new FormControl('Saturday'),
      sunday:new FormControl('Sunday'),
      mondayRate:new FormControl(),
      mondaySales:new FormControl(),
      tuesdayRate:new FormControl(),
      tuesdaySales:new FormControl(),
      wednesdayRate:new FormControl(),
      wednesdaySales:new FormControl(),
      thursdayRate:new FormControl(),
      thursdaySales:new FormControl(),
      fridayRate:new FormControl(),
      fridaySales:new FormControl(),
      saturdayRate:new FormControl(),
      saturdaySales:new FormControl(),
      sundayRate:new FormControl(),
      sundaySales:new FormControl(),  
      day1:new FormControl(), 
      day2:new FormControl(), 
      day3:new FormControl(), 
     
    })

    this.salesForm.controls['day1'].setValue("Monday")
    this.salesForm.controls['day2'].setValue("Monday")
    this.salesForm.controls['day3'].setValue("Monday")

  }

  async presentModal() {
    let controller = this;
    const modal = await this.modalController.create({
      component: DailyAveragesPage
    });

    modal.onDidDismiss().then((dataReturned) => {
     
      if (dataReturned.data !== undefined) {
        console.log(dataReturned.data)
        this.goodDay = dataReturned.data.goodDay
        this.normalDay = dataReturned.data.normalDay
        this.badDay = dataReturned.data.badDay
        
      }})

      return await modal.present();
  
  }
  selectedMonday(event){
  
    let value = event.detail.value

    if(value==="G")
      this.salesForm.controls['mondaySales'].setValue(this.goodDay)

    else if(value==="N")
     this.salesForm.controls['mondaySales'].setValue(this.normalDay)

    else if(value==="B") 
      this.salesForm.controls['mondaySales'].setValue(this.badDay)

      this.sales()


    // setTimeout(() => {
    //   console.log(this.salesForm.controls['mondayRate'].value)
    // },100)
  }
  selectedTuesday(event){
  
    let value = event.detail.value

    if(value==="G")
      this.salesForm.controls['tuesdaySales'].setValue(this.goodDay)

    else if(value==="N")
     this.salesForm.controls['tuesdaySales'].setValue(this.normalDay)

    else if(value==="B") 
      this.salesForm.controls['tuesdaySales'].setValue(this.badDay)

      this.sales()

  }

  selectedWednesday(event){
    let value = event.detail.value

    if(value==="G")
      this.salesForm.controls['wednesdaySales'].setValue(this.goodDay)

    else if(value==="N")
     this.salesForm.controls['wednesdaySales'].setValue(this.normalDay)

    else if(value==="B") 
      this.salesForm.controls['wednesdaySales'].setValue(this.badDay)

      this.sales()

  }

  selectedThursday(event){
    let value = event.detail.value

    if(value==="G")
      this.salesForm.controls['thursdaySales'].setValue(this.goodDay)

    else if(value==="N")
     this.salesForm.controls['thursdaySales'].setValue(this.normalDay)

    else if(value==="B") 
      this.salesForm.controls['thursdaySales'].setValue(this.badDay)

      this.sales()

  }

  selectedFriday(event){
    let value = event.detail.value

    if(value==="G")
      this.salesForm.controls['fridaySales'].setValue(this.goodDay)

    else if(value==="N")
     this.salesForm.controls['fridaySales'].setValue(this.normalDay)

    else if(value==="B") 
      this.salesForm.controls['fridaySales'].setValue(this.badDay)

      this.sales()

  }

  selectedSaturday(event){
    let value = event.detail.value

    if(value==="G")
      this.salesForm.controls['saturdaySales'].setValue(this.goodDay)

    else if(value==="N")
     this.salesForm.controls['saturdaySales'].setValue(this.normalDay)

    else if(value==="B") 
      this.salesForm.controls['saturdaySales'].setValue(this.badDay)

      this.sales()

  }

  selectedSunday(event){

    let value = event.detail.value

    if(value==="G")
      this.salesForm.controls['sundaySales'].setValue(this.goodDay)

    else if(value==="N")
     this.salesForm.controls['sundaySales'].setValue(this.normalDay)

    else if(value==="B") 
      this.salesForm.controls['sundaySales'].setValue(this.badDay)

      this.sales()

  }

  sales(){

    setTimeout(() => {
      this.mondaySales = this.salesForm.controls['mondaySales'].value
      if(this.mondaySales===null)
      this.mondaySales =0
  
      this.tuesdaySales = this.salesForm.controls['tuesdaySales'].value
     if(this.tuesdaySales===null) 
         this.tuesdaySales = 0
  
     this.wednesdaySales = this.salesForm.controls['wednesdaySales'].value
     if(this.wednesdaySales===null) 
     this.wednesdaySales = 0
  
     this.thursdaySales = this.salesForm.controls['thursdaySales'].value
     if(this.thursdaySales===null) 
     this.thursdaySales = 0
  
     this.fridaySales = this.salesForm.controls['fridaySales'].value
     if(this.fridaySales===null) 
     this.fridaySales = 0
  
     this.saturdaySales = this.salesForm.controls['saturdaySales'].value
     if(this.saturdaySales===null) 
     this.saturdaySales = 0
  
     this.sundaySales = this.salesForm.controls['sundaySales'].value
     if(this.sundaySales===null) 
     this.sundaySales = 0
  
      this.total = this.mondaySales + this.tuesdaySales +this.wednesdaySales +this.thursdaySales
      + this.fridaySales + this.saturdaySales + this.sundaySales
    },100);

   
  }

  submit(){
   // console.log(this.salesForm.value)
    this.report.dailySalesMetricsAmnt(this.salesForm.value,this.total);    
    this.router.navigate(['/menu/loan-appraisal/operating-expenses'])
       
  }

  // redirect(){
  //   this.router.navigate(['/menu/operating-expenses'])
  // }

}
