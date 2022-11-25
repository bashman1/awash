import { Component, Inject } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, FormArray} from '@angular/forms';
import {LoginService} from '../../services/login.service';
import {HttpClient} from '@angular/common/http';
import {HelperService} from '../../services/helper.service';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery';
import {CommonFunctions} from '../../services/CommonFunctions';
import {ReportsService} from '../../services/reports.service';
import {Router} from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface CustomerData {
  customer_name: '';
  nin: '',
  total_debits: '';
  total_credits: '';
  registration_date: '';
  expire: '',
  date: ''

}

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.page.html',
  styleUrls: ['./customer-details.page.scss'],
})
export class CustomerDetailsPage extends LoginService {

  customerInformation:FormGroup;
  customerExistance:boolean
  userTitle=[];
  maritalStatus=[];
  customer=[];
  countryRefData:any = [];
  today;
  search={}
  searchObject: any[]=[
    {id:1, name:'Customer Name',val:'LName'},
    {id:2, name:'Customer Ref No.',val:'refNo'},
  ]
  searchCriteria:FormGroup;
  searchCriteriaSelected:any[] = []
  unSelected:any [] = [];
  country:any='ug';
  countryCode:any= "+256";
  customPopoverOptions: any = {
 
  };
  selectedCountry = 'Uganda';
  selectedCode = '+256';
  newValid = true;
  formErrors = {
    address: '',
    phoneNumber: '',
    otherPhoneNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    contactCode: '',
    otherContactCode: '',
    dependants: ''
  };


  validation_messages = {
    'firstName': {
      'required': 'First Name is required.',
    },
    'lastName': {
      'required': 'Last Name is required..',
    },
    'middleName': {
      'required': 'Middle Name is required',
    },
    'address': {
      'required': 'Address is required.'
    },
    'phoneNumber': {
      'required': 'Phone number is required.',
      'pattern': 'Phone number should be like 701235874.'
    },
    'otherPhoneNumber': {
      'required': 'Phone number is required.',
      'pattern': 'Phone number should be like 701235874.'
    },
    'dependants': {
      'required': 'Number of dependants are required.'
    }

  };

  constructor(
      private fb:FormBuilder,
      public http: HttpClient,
      public helper: HelperService,
      private datePipe: DatePipe,
      private commonFunctions: CommonFunctions,
      private report: ReportsService,
      public router:Router,
      public loadingController: LoadingController,
      public alertController: AlertController,
      public dialog: MatDialog,
      public commonFunction: CommonFunctions

  ) {

    super(http,helper, loadingController);

  }

  ngOnInit() {
    this.today =  this.datePipe.transform(new Date(),"yyyy-MM-dd");

    this.customerInformation = this.fb.group({
      firstName: new FormControl('',[]),
      lastName:new FormControl('',[]),
      middleName:new FormControl('',[]),
      address: new FormControl('',[]),
      gender: new FormControl(),
      maritalstatus:new FormControl(),
      dependants: new FormControl(),
      title: new FormControl(),
      dob: new FormControl(),
      phoneNumber: new FormControl(),
      contactCode: new FormControl(),
      otherPhoneNumber: new FormControl(),
      otherContactCode: new FormControl(),
      primary_contact: new FormControl(),
      secondary_contact: new FormControl()
    });

    this.searchCriteria = this.fb.group({
     refNo: new FormControl(),
     LName: new FormControl(),
      searchCriterias:new FormControl()
    });



    this.getCustomerTitleRefData();
    this.getMaritalStatusRefData();
    this.getCountryRefData();
    $('#customerDetails').hide();
    $('#customerSearch').hide();
  }

    customerInquiry($event) {
      this.customerExistance = $event.detail.value
     if($event.detail.value==="true"){
       $('#customerSearch').show();
       $('#customerDetails').hide();


     }else if($event.detail.value==="false"){
       $('#customerDetails').show();
       $('#customerSearch').hide();
       this.customerInformation.controls.gender.setValue('Female');
       this.customerInformation.controls.firstName.setValidators([Validators.required]);
       this.customerInformation.controls.lastName.setValidators([Validators.required]);
       this.customerInformation.controls.gender.setValidators([Validators.required]);
       this.customerInformation.controls.maritalstatus.setValidators([Validators.required]);
       this.customerInformation.controls.dependants.setValidators([Validators.required])
       this.customerInformation.controls.dob.setValidators([Validators.required]);
       this.customerInformation.controls.title.setValidators([Validators.required]);
       this.customerInformation.controls.contactCode.setValidators([Validators.required]);
       this.customerInformation.controls.phoneNumber.setValidators([Validators.required,
      Validators.pattern('^7[0|1|5|7|8|9]{1}[0-9]{7}$')]);
      this.customerInformation.controls.otherPhoneNumber.setValidators([
     Validators.pattern('^7[0|1|5|7|8|9]{1}[0-9]{7}$')]);
      // updateValueAndValidity()
     }

     
       this.customerInformation.controls.firstName.updateValueAndValidity();
       this.customerInformation.controls.lastName.updateValueAndValidity();
       this.customerInformation.controls.gender.updateValueAndValidity();
       this.customerInformation.controls.maritalstatus.updateValueAndValidity();
       this.customerInformation.controls.dependants.updateValueAndValidity()
       this.customerInformation.controls.dob.updateValueAndValidity();
       this.customerInformation.controls.title.updateValueAndValidity();
       this.customerInformation.controls.contactCode.updateValueAndValidity();
       this.customerInformation.controls.phoneNumber.updateValueAndValidity();
       this.customerInformation.controls.otherPhoneNumber.updateValueAndValidity();
    }
    phoneNumberVerification() {
      let value = this.customerInformation.controls.phoneNumber.value;
      if(value.length === 9){
        let number = this.customerInformation.controls.contactCode.value+value;
        this.customerInformation.controls.primary_contact.setValue(number);
        this.getCustomerVerificationData(number);

      }

    }

    otherPhoneNumberVerification() {
      let value = this.customerInformation.controls.otherPhoneNumber.value;
      if(value.length === 9){
        let number = this.customerInformation.controls.contactCode.value+value;
        this.customerInformation.controls.secondary_contact.setValue(number);
        this.getCustomerVerificationData(number);
      }

    }

    getCustomerVerificationData(phoneNumber) {
      let controller = this, search, auth,postData;
       search = {
        sortField: "Q.created_on",
        sortOrder: "desc",
        phoneNumber: phoneNumber,
      };
      postData = {
        auth: auth,
        search: search,
      };
      this.sendRequestToServer(
        'CustomerManagement', 
        'getCustomerVerificationData', 
        JSON.stringify(postData),
        function (response: any) {
          console.log(response);
          //
          if(response.returnCode == 0) {
            if(response.returnData.rows.length >0){
              let dt = new Date();
              dt.setMonth( dt.getMonth() + 6 );
             
              let date = new Date((response.returnData.rows[0].registration_date));
              let humanDate = date.toLocaleDateString()
              response.returnData.rows[0].date = humanDate;
              // console.log(Date.today().compareTo(Date.parse(humanDate)));Date
             console.log(new Date); 
             let today = new Date
             let month = (today.getMonth() - date.getMonth());
             console.log(month);
              response.returnData.rows[0].expire = month;
              controller.openDialog(response.returnData.rows[0]);
              

            }else {
              controller.commonFunction.presentAlert("Failed","Not Found","Member Doesn't Exist", "ok");

            }
          }
         // controller.handleCustomerVerificationData(response);
        },
        function (err) {
          controller.commonFunction.presentAlert("Failed","Error",err.message, "ok");
        }
        )
    }
   
      openDialog(object){
        this.dialog.open(CustomerDialog, {
         data: object
        })
      }

    submit(){
      if(this.customerInformation.invalid){
        console.log(this.customerInformation)
        return;
      }
      this.report.customerDetails(this.customerExistance,this.customerInformation.value);
      this.router.navigate(['/menu/loan-appraisal/loan-details']);


    }

  searchCustomer(){
    this.search = {
      "first": 0,
      "rowsPerPage": 20
    };
    console.log(JSON.stringify(this.searchCriteria.value));

    if(this.searchCriteria.invalid){
      return;
    }
    let requestData = this.searchCriteria.value;
    const auth = this.helper.getUserRequestCredentials();

    let postData = {
      auth:auth,
      requestData:requestData,
      search:this.search
    };

    var controller = this;
    this.sendRequestToServer(
        'LoansManagement', //Service
        'getCustomer', //Service
        JSON.stringify(postData),
        function (response) {
            controller.customer = response.returnData.rows
        },
        function (err) {
        }
    );

  }

  getCountryRefData()
{
  let auth = this.helper.getUserRequestCredentials();
  let postData= {
    auth:auth,
  };
  var controller = this;

  this.sendRequestToServer(
      "ReferenceDataManagement",
      "getCountryRefData",
      JSON.stringify(postData),

      response => {
       
        if(response.returnCode===0){
          controller.countryRefData = response.returnData;
          controller.customerInformation.controls.contactCode.setValue(this.selectedCode);
          controller.customerInformation.controls.otherContactCode.setValue(this.selectedCode);
        }
      },
      function (err) {
      }
  );
  
}
    getMaritalStatusRefData(){

      let auth = this.helper.getUserRequestCredentials();
      let postData= {
        auth:auth,
      };
      var controller = this;

      this.sendRequestToServer(
          "ReferenceDataManagement",
          "getMaritalStatusRefData",
          JSON.stringify(postData),

          response => {

            if(response.returnCode===0){
              controller.maritalStatus = response.returnData;
            }
          },
          function (err) {
          }
      );
    }

  getCustomerTitleRefData(){
    let auth = this.helper.getUserRequestCredentials();

    let postData= {
      auth:auth,
    };

    var controller = this;
    this.sendRequestToServer(
        'ReferenceDataManagement',
        'getCustomerTitleRefData',
        JSON.stringify(postData),

        response => {

          if(response.returnCode===0){

            controller.userTitle = response.returnData;
          }
        },
        function (err) {
          // controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
        }
    );
  }

  change($event) {

    this.searchObject.forEach(obj=>{
      this.commonFunctions.closePopUp(obj.val)

    })
    this.searchCriteriaSelected = $event.detail.value
    this.searchCriteriaSelected.forEach(obj=>{
      console.log(obj)
       this.commonFunctions.showElement(obj)

    })

  }

  selectedCustomer(customer){
    console.log("*************")
    this.commonFunctions.closePopUp('customerSearch')
    this.commonFunctions.closePopUp('inquiry')
    this.commonFunctions.showElement('customerDetails')
    this.customerInformation.controls['firstName'].setValue(customer.first_name)
    this.customerInformation.controls['lastName'].setValue(customer.last_name)
    this.customerInformation.controls['middleName'].setValue(customer.middle_name)
    this.customerInformation.controls['address'].setValue(customer.village)
    this.customerInformation.controls['gender'].setValue(customer.gender)
    this.today =  this.datePipe.transform(new Date(customer.date_of_birth),"yyyy-MM-dd");
    this.customerInformation.controls['dob'].setValue(this.today)
    this.customerInformation.controls['dependants'].setValue(customer.number_of_children)
    let titleObj = this.userTitle.find(title=> title.description === customer.title)
    let statusObj = this.maritalStatus.find(status=>status.description === customer.marital_status)
    this.customerInformation.controls['title'].setValue(titleObj.id)
    this.customerInformation.controls['maritalstatus'].setValue(statusObj.id)

  }


  logValidationErrors(group: FormGroup = this.customerInformation): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else if (abstractControl instanceof FormArray) {
        let formGroups: FormArray = abstractControl;
        for (let i = 0; i <= formGroups.length; i++) {
          if (formGroups.controls[i] instanceof FormGroup) {
            this.logValidationErrors((<FormGroup> formGroups.controls[i]));
          } else if (formGroups.controls[i] instanceof FormArray) {
            this.handleFormArray(formGroups[i]);
          }
        }
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validation_messages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  handleFormArray(formArray: FormArray) {
    for (let i = 0; i <= formArray.length; i++) {
      if (formArray.controls[i] instanceof FormGroup) {
        this.logValidationErrors((<FormGroup> formArray.controls[i]));
      } else if (formArray.controls[i] instanceof FormArray) {
        this.handleFormArray(formArray[i]);
      }
    }
  }

}


@Component({
  selector: 'customer-dialog',
  templateUrl: 'customer-dialog.html',
  styleUrls: ['./customer-dialog.scss'],
})
export class CustomerDialog {
  
  constructor(
    public dialogRef: MatDialogRef<CustomerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CustomerData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
