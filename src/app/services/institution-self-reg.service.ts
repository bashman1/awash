import { LoaderServiceService } from './loader-service.service';
import { LoginService } from 'src/app/services/login.service';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { CommonFunctions } from './CommonFunctions';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class InstitutionSelfRegService extends LoginService {

 
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
    public loader: LoaderServiceService

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
          controller.loader.presentToast('success', 'Institution Created Successfully');
          console.log(response.returnData.id);
          controller.route.navigate(['/institution-profile/'+response.returnData.id]);
        } else {
          controller.loader.presentToast('warning', 'Institution Creation Failed');
        }
      },
      function(err) {
        controller.loader.presentToast('warning', 'Error: Connection Failed');

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
          controller.loader.presentToast('success', 'Institution Created Successfully');
          controller.route.navigate(['/institution-profile/'+response.returnData.id]);

          // controller.route.navigate(['/new-login']);
        } else {
          controller.loader.presentToast('warning', 'Institution Creation Failed');
        }
       },
       function (err) {
        controller.loader.presentToast('warning', 'Error:Connection Failed. Try Again Later');
       }
     );

  }
}
