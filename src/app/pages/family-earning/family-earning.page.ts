import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/services/reports.service';
import * as $ from 'jquery';
import { FamilyEarnings } from './familyEarnings';
import { OptionsService } from 'src/app/services/options.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-family-earning',
  templateUrl: './family-earning.page.html',
  styleUrls: ['./family-earning.page.scss'],
})
export class FamilyEarningPage implements OnInit {

  spouseExist:boolean = false;
  spouseBusiness:boolean = false;
  familyEarnings = new FamilyEarnings(null,null,null,null,null,null)
  

  constructor(private report:ReportsService,private option:OptionsService,private router:Router) { }

  ngOnInit() {
    $('#spouse').hide();
    $('#spouseBusiness').hide()
  }
  onSubmit(){
    
    this.report.familyEarningsAmnt(this.spouseExist,this.spouseBusiness,this.familyEarnings)
    this.router.navigate(['/menu/loan-appraisal/family-expenses'])
    
    
  }


  spouseCheck(){

    if(this.spouseExist){
      $('#spouse').show();
    }else{
      $('#spouse').hide();
    }

  }

  businessCheck(){
    if(this.spouseBusiness){
      $('#spouseBusiness').show()
    }else{
      $('#spouseBusiness').hide()
    }

  }

}
