import { Component, OnInit, ViewChild } from '@angular/core';
import { Plugins } from "@capacitor/core";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, Platform, LoadingController, IonRouterOutlet } from '@ionic/angular';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
const { Storage } = Plugins;

@Component({
  selector: 'app-merchant-history',
  templateUrl: './merchant-history.page.html',
  styleUrls: ['./merchant-history.page.scss'],
})
export class MerchantHistoryPage extends LoginService {
  resultsList:any=[];
  showData:any = false;
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    private authService: AuthService,
    public navCtrl: NavController,
    public commonFunction: CommonFunctions,
    private fb: FormBuilder,
    public loaderService:LoaderServiceService,
    public platform: Platform,
    public loadingController: LoadingController
  ) { 
    super(http, helper, loadingController);

    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        this.router.navigate(['/menu/home-tabs/tabs/home']);
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });

  }

  async ngOnInit() {
    super.ngOnInit();

            //#################### Storage Data #####################################
            const ret = await Storage.get({ key: 'userData' });
            const user = JSON.parse(ret.value);
            this.token=user.token;
            this.branchId = user.branchId;
            this.custNo=user.custNo;
            this.id=user.id;
            this.name= user.name;
            this.institution = user.institution;
            this.institutionName = user.institutionName; 

            console.log(this.token);
            this.getCustomerSubscription();
  }


  getCustomerSubscription(){
    let search, postData,auth;
    
    auth={
      token: this.token,
      username: this.custNo,
      type:"mobile"
    }
    search={
      custNo:this.custNo,

    }
    postData={
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "MerchantManagement",
      "getCustomerSubscriptions",
      JSON.stringify(postData),
      function(response){
        that.handleCustomerSubscription(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleCustomerSubscription(response){
    if(response.returnCode != 0){
       console.log(response);
    }else{
      this.resultsList = response.returnData.rows;
      console.log(this.resultsList);
      this.showData=true;
      console.log(this.resultsList.length);
      if (this.resultsList === undefined || this.resultsList.length == 0) {
        // array empty or does not exist
        this.showData=false;
    }
    }
    
  }

  payForDependant(result){
    if(result.payment_status == 'UnPaid'){
      this.commonFunction.presentAlert('Pending Payment',"",'This payment reference is pending payment. ', 'OK')
      return 
    }
    this.router.navigate(['/menu/merchant-extra-dependant',result.payment_reference]);
  }
}
