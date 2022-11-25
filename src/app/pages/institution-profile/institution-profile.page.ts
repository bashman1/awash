import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-institution-profile',
  templateUrl: './institution-profile.page.html',
  styleUrls: ['./institution-profile.page.scss'],
})
export class InstitutionProfilePage extends LoginService {

  institutionData: any[] = [];
  basicInstData:any = [];
  accountArray: any[] = [];
  constructor(
    private route: ActivatedRoute,
    public http: HttpClient,
    public helper: HelperService,
    public loadingController: LoadingController
    ) {
      super(http, helper, loadingController);
    }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.getInsitution(id);
  }

  getInsitution(instId: any): any {
    //let auth = this.commonService.getUserRequestCredentials();
    let postData= {
      // auth:auth,
      search: {},
      requestData: instId
    };

    var controller = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getInstitutionById",
      JSON.stringify(postData),
      response => {
        if (response.returnCode === 0) {

          controller.institutionData = response.returnData.rows;
          console.log(controller.institutionData);
          controller.basicInstData = response.returnData.rows[0];

          controller.accountArray = this.institutionData.filter((test, index, array) =>
            index === array.findIndex((findTest) =>
            findTest.account_number === test.account_number &&
            findTest.bank_id === test.bank_id
            )
          );
        }

      },
      function (err) {
        //controller.showDialog({title: 'Connection Error', message: 'failed to connect to server' + err.message})//Error handler
      }
    );
  }

}
