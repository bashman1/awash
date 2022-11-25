import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { AlertController, LoadingController } from '@ionic/angular';
import {Router} from '@angular/router';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage extends LoginService {

  searchForm:FormGroup;
  search:any;
  customerList=[];
  institutionTypeId:number;
  customerRef:String;


  constructor(
    public fb:FormBuilder,
    public helper: HelperService,
    public http: HttpClient,
    public loaderService:LoaderServiceService,
    private alertCtrl:AlertController,
    protected router: Router,
    public loadingController: LoadingController,


  ) {

      super(http,helper,loadingController);
      this.search = {
        "first": 0,
      "rowsPerPage": 10
      }      
    }

  async ngOnInit() {

    this.searchForm = this.fb.group({
      customerName: new FormControl('')
    });
    let user;
    //#################### Storage Data #####################################
       await Storage.get({ key: 'userData' }).then(val=>{
       user = JSON.parse(val.value);
       this.institutionTypeId = user.institutionTypeId;
       if(this.institutionTypeId ===2){
         this.customerRef = "Customers";
       } else {
         this.customerRef = "Members";
       }

    });
  }

  searchCustomer(){
    let requestData = this.searchForm.value;
    let auth = this.helper.getUserRequestCredentials();
    this.search.sortField="cust_no";
    let postData= {
      auth:auth,
      search:this.search,
      requestData
    };

    var controller = this;
    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerSearch",
      JSON.stringify(postData),
      response => {

        if(response.returnCode === 0){
          controller.customerList = response.returnData.rows;
        }else{
            controller.logMessage("Error",response.returnMessage);
        }
      },
      function(err){
        controller.logMessage("Error","Connection Failed");
      }
      
    );
  }

  async logMessage(title,message){
    let data = {title:title, message:message};
    let alert =await this.alertCtrl.create({
      header:data.title,        
      message:data.message,
      buttons:['OK']
    });
    alert.present();
  }

  addLoan(customer){
    console.log(customer);
    this.router.navigate(['/menu/loan-form/',customer.cust_id,customer.name,customer.cust_no, customer.cust_type_id]);



  }
 

}
