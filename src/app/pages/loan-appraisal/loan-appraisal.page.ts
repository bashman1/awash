import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ReportsService } from 'src/app/services/reports.service';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup } from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {HelperService} from '../../services/helper.service';

@Component({
  selector: "app-loan-appraisal",
  templateUrl: "./loan-appraisal.page.html",
  styleUrls: ["./loan-appraisal.page.scss"]
})
export class LoanAppraisalPage extends LoginService{
  selfAppraisalForm: FormGroup;
  repaymentSchedule: any[] = [];
  rows: any[];
  columns: any[];
  search:any;
  projectName:string;
  category:string;
  projectDescription:string;
  appraisals: any[];

 constructor(
   public modalController: ModalController,
   public report:ReportsService,
   public router:Router,
   public http: HttpClient,
   public helper: HelperService,
   public loadingController: LoadingController
   ) {
     super(http,helper, loadingController)
 }

 ngOnInit() {
   this.projectName = this.report.projectName;
    this.projectDescription = this.report.projectDescription;
   this.category = this.report.projectCategory;

   console.log(this.projectName);
     this.search={
         "first": 0,
         "rowsPerPage": 5
     };
     this.search.status = "customer";

     this.getAppraisals();
 }

 getAppraisals(){
     const auth = this.helper.getUserRequestCredentials();


     let requestData = {
         auth: auth,
         search: this.search
     };

     let controller = this;
     this.sendRequestToServer(
         'loansManagement',
         'getAllAppraisalReports',
         JSON.stringify(requestData),

         function (response){
             if(response.returnCode===0){
                 console.log(response);
                 controller.appraisals = response.returnData.rows;
             }
         }, function(){

         }
     )
 }

 add(){
   this.router.navigate(['/menu/loan-appraisal/loan-details'])

 }

 edit(){

 }

 view(appraisal){
   this.router.navigate(['/menu/loan-appraisal/cash-flow',appraisal.appraisal_code])
 }

 delete(){

 }

 addProject(){
   this.router.navigate(['/menu/loan-appraisal/project-creation'])
 }


    customers() {
        this.search.status = "customer";
        this.getAppraisals();


    }

    noncustomers() {
        this.search.status = "noncustomer";
        this.getAppraisals();

    }
}
