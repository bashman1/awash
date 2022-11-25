import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { Customer } from './customer';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.page.html',
  styleUrls: ['./create-customer.page.scss'],
})
export class CreateCustomerPage extends LoginService {

  //customerForm:FormGroup;

  constructor(
    public fb:FormBuilder,
    public auth: AuthService,
    public http: HttpClient,
    public helper: HelperService,
    public loadingController: LoadingController
  ) {
    super(http,helper, loadingController)
   }
  customer = new Customer(null, null, 'karanzi', 'kara@gmail.com', 999837222, null);
  regions:[]
  districts=[]
  counties=[];
  subcounties=[];
  parishes=[];
  userTitle=[];

  region:any;
  district:any;
  county:any;
  subcounty:any;
  parish:any;
  title:any;
  contact:any;
  countryRefData:any
  selectedCode="+256";
  contactPattern='^\\d{9}$'
  customerType=[]
  

  ngOnInit() {

    // this.customerForm = this.fb.group({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   middleName: new FormControl(),
    //   maidenName: new FormControl(),
    //   region: new FormControl(),
    //   district: new FormControl(),
    //   county: new FormControl(),
    //   subcounty: new FormControl(),
    //   parish: new FormControl(),
    //   village: new FormControl()

    // })
    this.getRegion();
    this.getCustomerTitleRefData();
    this.getCountryRefData();
    this.getCustomerTypesRefData()
  }

  getRegion(){
    let auth = this.helper.getUserRequestCredentials();

    let postData= {
      auth:auth,
    }

    var controller = this;

    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getRegions",
      JSON.stringify(postData),
      
      function (response) {
        if(response.returnCode===0){
          controller.regions = response.returnData
        }

      },
      function (err) {

        }
    );

  }

  getCountryRefData(){
    let auth = this.helper.getUserRequestCredentials();

    let postData= {
      auth:auth,
    }

    var controller = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getCountryRefData",
      JSON.stringify(postData),
      response => {
        if(response.returnCode===0){
          controller.countryRefData= response.returnData

        }
      },
      function (err) {
        //controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
      }
    );
  }

  getCustomerTitleRefData(){
    let auth = this.helper.getUserRequestCredentials();

    let postData= {
      auth:auth,
    }

    var controller = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getCustomerTitleRefData",
      JSON.stringify(postData),
    
      response => {

        if(response.returnCode===0){
          
          this.userTitle = response.returnData
        }
      },
      function (err) {
       // controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
      }
    );
  }

//get districts
getDistricts() {
  
  let auth = this.helper.getUserRequestCredentials();

  let requestData = {
    auth:auth,
    requestData: this.region
  }

  var controller = this;

  this.sendRequestToServer(
    "ReferenceDataManagement",
    "getAllDistrict",
    JSON.stringify(requestData),
    function (response) {
      if(response.returnCode===0){
        controller.districts = response.returnData
      }

    },
    function (err) {
      //controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
    }
  );

}

//get counties
getCounties(value) {

  let auth = this.helper.getUserRequestCredentials();


  let postData= {
    auth:auth,
    requestData:this.district
  }

  var controller = this;

  this.sendRequestToServer(
    "ReferenceDataManagement",
    "getAllCounty",
    JSON.stringify(postData),
    function (response) {
      if(response.returnCode===0){
        controller.counties = response.returnData;
      }
      

    },
    function (err) {
      //controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
    }
  );


}


  //subcounties

  getSubcounties() {
    const auth = this.helper.getUserRequestCredentials();
    
    let requestData = {
      auth: auth,
      requestData: this.county
    };
    let controller = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getAllSubcounties",
      JSON.stringify(requestData),
      function (response: any) {
        if (response.returnCode == 0) {
          controller.subcounties = response.returnData;
        }
      }, function () {
      }
    )
  }

  
  getParishes() {
    const auth = this.helper.getUserRequestCredentials();
    let requestData = {
      auth: auth,
      requestData: this.subcounty
    };
    let controller = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getAllParishes",
      JSON.stringify(requestData),
      function (response: any) {
        if(response.returnCode===0){
          controller.parishes = response.returnData
        }

      }, function () {
      }
    )

  }

  getCustomerTypesRefData(){
    let auth = this.helper.getUserRequestCredentials();

    let postData= {
      auth:auth,
    }

    var controller = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getCustomerTypesRefData",
      JSON.stringify(postData),
      
      response => {
        //controller.handleReferenceDataResponse(response, "getCustomerTypesRefData",undefined,undefined);
        if(response.returnCode===0){
          controller.customerType = response.returnData
        }
      },
      function (err) {
        //controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
      }
    );
  }

  onSubmit(){
    
  }

}
