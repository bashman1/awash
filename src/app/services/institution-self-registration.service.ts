import { InstitutionRegistrationPageModule } from './../pages/institution-registration/institution-registration.module';
import { Router } from '@angular/router';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { LoginService } from 'src/app/services/login.service';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {HelperService} from './helper.service';
import { stringify } from 'querystring';
import { FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InstitutionSelfRegistrationService extends LoginService {

  userArray: FormGroup;
  institution: any[];
  status = false;
  email: string;
  name: string;

  constructor(
    public http: HttpClient,
    public helper: HelperService,
    public commonFunction: CommonFunctions,
    public route: Router,
    public loadingController: LoadingController,

  ) {
    super(http, helper, loadingController);
   }

  createUser(userArray) {
    console.log('first step');

    this.userArray = userArray;
    this.name = this.userArray.controls.firstName.value + ' ' + this.userArray.controls.lastName.value;
    this.email = this.userArray.controls.emailAddress.value;
    console.log(this.name + ' ' + this.email);
    this.status = true;
  }

  createInstitution(institutionArray) {
    this.institution = institutionArray;
    console.log(this.institution);
    this.addInstitution();
  }

  addInstitution() {
    let uploads=[];
    let accountInfoArray=[];
    let contactInfoArray = [];
    let staff = this.userArray.value;
    let postData = { requestData: this.institution, uploads, accountInfoArray, contactInfoArray, staff,
      auth: {}
    };

    let controller = this;
    //this.commonFunction.loading(true, 'Adding Institution...');


    this.sendRequestToServer(
      'InstitutionManagement',
      'addInstitution',
      JSON.stringify(postData),
      function (response) {

        if (response.returnCode === 0) {
          // controller.commonFunction.loading(true, 'Adding Institution...');
          // controller.addUser(response.returnData.id);
          controller.route.navigate(['/institution-profile/'+response.returnData.id]);

        } else {
          controller.commonFunction.feedback('Institution Creation Failed', 5000, 'warning');
        }
      },
      function(err) {
        controller.commonFunction.feedback('Error: Connection Failed', 5000, 'warning');

      }
    );

  }

  addUser(institutionId) {
    this.userArray.controls.institutionId.setValue(institutionId);
    console.log(this.userArray.value);
    let postData = {requestData: this.userArray.value};

    let controller =  this;
    // this.commonFunction.loading(true, 'Adding Institution...');
    this.sendRequestToServer(
       'UserManagement',
       'addSelfRegUser',
       JSON.stringify(postData),
       function (response) {
        if (response.returnCode === 0) {
          controller.commonFunction.feedback('Institution Created Successfully', 5000, 'success');
          controller.route.navigate(['/institution-profile',institutionId]);
        } else {
          controller.commonFunction.feedback('Institution Creation Failed', 5000, 'warning');
        }
       },
       function (err) {
        controller.commonFunction.feedback('Error:Connection Failed. Try Again Later', 5000, 'warning');

       }
     );

  }
}
