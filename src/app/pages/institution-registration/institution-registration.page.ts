import { searchFilter } from './../../customPipes/ng-search-pipe';
import { CommonFunctions } from './../../services/CommonFunctions';
import { LoginService } from './../../services/login.service';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import {HelperService} from '../../services/helper.service';
import { InstitutionSelfRegistrationService } from 'src/app/services/institution-self-registration.service';
import * as $ from 'jquery';
import { Observable, Subject } from 'rxjs';
import { startWith, map, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-institution-registration',
  templateUrl: './institution-registration.page.html',
  styleUrls: ['./institution-registration.page.scss'],
})
export class InstitutionRegistrationPage extends LoginService {

institutionForm: FormGroup;
bankList: any[] = [];
regions: any[] = [];
countryRefData: any[] = [];
institutionType: any[] = [];
industryList: any[] = [];
industrySubCategory: any[] = [];
districtList: any[] = [];
countyList: any[] = [];
subcountyList: any[] = [];
selectedIndustrySubCat: any[] = [];
parishList: any[] = [];
numberMask = '0701586693';
selectedCode = '+256';
filteredInstitutionTypes = [];
filteredBanks = [];
_onDestroy = new Subject<void>();
institutionTypes = new FormControl();
banks = new FormControl();
success = false;



// formerror object set to null by default


formErrors = {
  institutionName: '',
  institutionTypeId: '',
  district: '',
  county: '',
  subcounty: '',
  village: '',
  region: '',
  parish: '',
  contactPerson: '',
  banksId: '',
  accountType: '',
  accountName: '',
  accountNumber: '',
  position: '',
  email: '',
  phoneNumber: '',
  otherPhoneNumber: '',
  industryType:'',
  industrySubCat:'',
  contactCode: ''
};
//validation messages
validationMessage = {
  'institutionName': {
    'required': 'Institution Name Is Required',
    'validString': 'Only letters are allowed'
  },

  'institutionTypeId': {
    'required': 'Please choose an Institution type'
  },
  'position': {
    'required': 'Please Specify the Position'
  },

  'no_of_Branches': {
    'required': 'Number of Branches Is Required',
    'validInterestBranchNumber': 'It Should be a number'
  },

  'district': {
    'required': 'A District is Required',
    'validString': 'Only Letters are allowed'

  },

  'county': {
    'required': 'A County is Required',
    'validString': 'Only Letters are allowed'

  },

  'subcounty': {
    'required': 'A Subcounty is Required',
    'validString': 'Only Letters are allowed'

  },

  'village': {
    'required': 'A Village is Required',
    'validString': 'Only Letters are allowed'

  },

  'region': {
    'required': 'Region is Required'
  },
  'parish': {
    'required': 'Parish is Required'
  },

  'contactPerson': {
    'required': 'A Contact Person is Required',
    'validString': 'Only Letters are allowed'

  },
  'phoneNumber': {
    'required': 'Phone Number is required',
    'pattern': 'Phone Number format is 7*********, 9 digits',
    //'minLength':'PhoneNumber has to 12 digits'
  },
  'email': {
    'pattern': 'Email Format is example@gmail.com',
    'required': 'An email is required'
  },
  
  'accountNumber': {
    'required': 'Account Number Is Required'
  },
  'accountName': {
    'required': 'Account Name is Required'
  },
  'accountType': {
    'required': 'Account Type is Required'
  },
  'banksId': {
    'required': 'Bank is Required'
  },
  'industryType': {
    'required': 'Industry Type is Required'
  },
  'industrySubCat': {
    'required': 'Industry Sub Category is Required'
  },

  contactCode: {

  }



};



  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    public http: HttpClient,
    public helper: HelperService,
    private institutionSelfReg: InstitutionSelfRegistrationService,
    public commonFunction: CommonFunctions,
    private filter: searchFilter,
    public loadingController: LoadingController

    ) {
      super(http, helper, loadingController);
     }

  ngOnInit() {

    this.institutionForm = this.fb.group({
       generalInformation : this.fb.array([
        new FormGroup({

          institutionName: new FormControl(null, Validators.compose([
            Validators.required
          ])),
          selfReg:new FormControl(false,Validators.required),
          selfRegApproval:new FormControl(false),
          institutionTypeId: new FormControl(null, Validators.required),
          industryType: new FormControl(null, [Validators.required]),
          industrySubCat: new FormControl(null, []),//Validators.required
          logo: new FormControl(),
          logo_id: new FormControl(),
          addressInformation: new FormGroup({
            region: new FormControl(null, Validators.compose([
              Validators.required,
            ])),
            district: new FormControl(null, Validators.compose([
              Validators.required,
            ])),
            county: new FormControl(null, Validators.compose([
              Validators.required,
            ])),
            subcounty: new FormControl(null, Validators.compose([
              Validators.required,
            ])),
            village: new FormControl(null, Validators.compose([
              Validators.required,
            ])),
            parish: new FormControl(null, Validators.compose([
              Validators.required,
            ])),
        })//addressinfo
      }),

      //account information
      new FormGroup ({
        banksId: new FormControl(),
        accountType: new FormControl(),
        accountName: new FormControl(),
        accountNumber: new FormControl(),
       }),

       //contact information
       new FormGroup ({
        contactPerson: new FormControl(),
        position: new FormControl(
          '', [Validators.required]
        ),
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        contactCode: new FormControl(this.selectedCode),
        phoneNumber: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^7[0|1|5|7|8|9]{1}[0-9]{7}$')
        ])),
       })

       ]),//end array

    });

    this.preloadedData();

    this.institutionTypes.valueChanges.pipe(takeUntil(this._onDestroy)).
      subscribe( () => {
        this.filteredInstitutionTypes = this.filter.singleSearch(this.institutionType, 'institutionTypeName', this.institutionTypes.value);
      });

    this.banks.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe( () => {
        this.filteredBanks = this.filter.singleSearch(this.bankList, 'name', this.banks.value);
      });

  }

  get basicForm() {
    return <FormGroup> this.institutionForm.get('generalInformation');
  }

  get genInfo() {
    return <FormGroup> this.basicForm.controls['0'];
  }

  get address() {
    return <FormGroup> this.genInfo.controls['addressInformation'];
  }

  get accountArrayControl() {
    return <FormGroup> this.basicForm.controls['1'];
  }

  get contacts() {
    return <FormGroup> this.basicForm.controls['2'];
  }


  getSubCat(value) {
    this.selectedIndustrySubCat = [];

    this.industrySubCategory.forEach(obj => {

      if (obj.industryCode === value) {
        console.log('set validator');
        this.selectedIndustrySubCat.push(obj);
        this.genInfo.controls.industrySubCat.setValidators([Validators.required]);
      } else {
        this.genInfo.controls.industrySubCat.clearValidators();
      }
      this.genInfo.controls.industrySubCat.updateValueAndValidity();



    });
  }

  check(value){
    if(value){
      $('#approve_self_reg').show();
      this.genInfo.get('selfRegApproval').setValidators([Validators.required]);
    }else{
      $('#approve_self_reg').hide();
      this.genInfo.get('selfRegApproval').clearValidators();
    }
    this.genInfo.get('selfRegApproval').updateValueAndValidity();

  }

  getDistrict(value) {
    console.log(value);
    let postData = { requestData: value};
    var controller = this;

    this.sendRequestToServer(
      'ReferenceDataManagement',
      'getAllDistrict',
      JSON.stringify(postData),
      function(response) {
        if(response.returnCode === 0) {
          console.log(response.returnData);
          controller.districtList = response.returnData;
        }
      },
      function(err) {
         console.log(err);      }
    );
  }

  getCounty(value) {
    console.log(value);
    let postData = { requestData: value};
    var controller = this;

    this.sendRequestToServer(
      'ReferenceDataManagement',
      'getAllCounty',
      JSON.stringify(postData),
      function(response) {
        if(response.returnCode === 0) {
          console.log(response.returnData);
          controller.countyList = response.returnData;
        }
      },
      function(err) {
         console.log(err);      }
    );
  }

  getSubCounty(value) {
    console.log(value);
    let postData = { requestData: value};
    var controller = this;

    this.sendRequestToServer(
      'ReferenceDataManagement',
      'getAllSubcounties',
      JSON.stringify(postData),
      function(response) {
        if(response.returnCode === 0) {
          console.log(response.returnData);
          controller.subcountyList = response.returnData;
        }
      },
      function(err) {
         console.log(err);      }
    );
  }

  getParish(value) {
    console.log(value);
    let postData = { requestData: value};
    var controller = this;

    this.sendRequestToServer(
      'ReferenceDataManagement',
      'getAllParishes',
      JSON.stringify(postData),
      function(response) {
        if(response.returnCode === 0) {
          console.log(response.returnData);
          controller.parishList = response.returnData;
        }
      },
      function(err) {
         console.log(err);      }
    );
  }

  submit() {
    if (this.institutionForm.invalid) {
      this.commonFunction.feedback('Form Incomplete', 2000, 'warning');
      return;
    } else {
      this.success = true;
      this.institutionSelfReg.createInstitution(this.institutionForm.value);

    }

  }

  selectChange() {

  }

  private preloadedData() {
    // let auth = this.commonService.getUserRequestCredentials();
    console.log(this.institutionSelfReg.email +' '+ this.institutionSelfReg.name);
    this.contacts.controls.email.setValue(this.institutionSelfReg.email);
    this.contacts.controls.contactPerson.setValue(this.institutionSelfReg.name);
    let postData = {};
    var controller = this;

    this.sendRequestToServer(
      "InstitutionManagement",
      "getPreloadedData",
      JSON.stringify(postData),
      function(response) {
        console.log(response);
        if(response.returnCode === 0) {

          controller.bankList = response.returnData.banksList;

          controller.regions = response.returnData.regions;

          controller.countryRefData = response.returnData.countryRefs;

          controller.institutionType = response.returnData.institutionRefs;

          controller.industryList = response.returnData.industryRefs;

          controller.industrySubCategory = response.returnData.industrySubCategoryRefs;
        }
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );

  }

  logValidationErrors(group: FormGroup = this.institutionForm): void {
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
          const messages = this.validationMessage[key];
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
