import { Component, OnInit, ViewChild } from "@angular/core";

import { Plugins } from "@capacitor/core";
import { ModalController, IonRouterOutlet, Platform, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "src/app/services/helper.service";
import { LoaderServiceService } from "src/app/services/loader-service.service";
import { CommonFunctions } from "src/app/services/CommonFunctions";
import { LoginService } from "src/app/services/login.service";

const { Storage } = Plugins;

@Component({
  selector: "app-savings",
  templateUrl: "./savings.page.html",
  styleUrls: ["./savings.page.scss"]
})
export class SavingsPage extends LoginService {

  active: string;
  branchId:any;
  custNo: string;
  id:any;
  name:string;
  token:string;
  institution:any;
  customerType: any;

  savingsAccountList: any[];
  transHistory: any[];
  transDisplay:any = 'none';
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;

  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    public platform: Platform,
    public loadingController: LoadingController
  ) {
    super(http, helper, loadingController);

    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/menu/savings') {
        // this.platform.exitApp(); 
        this.router.navigate(['/menu/home-tabs/tabs/home']);
        // /menu/main
        // or if that doesn't work, try
        // navigator['app'].exitApp();
      } else if(this.router.url === '/menu/home-tabs/tabs/saving') {
        this.router.navigate(['/menu/home-tabs/tabs/home']);
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
    // menu/savings
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
    this.customerType = user.custTypeId;
    this.institutionName = user.institutionName;

    let auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };

//#################### Storage Data ########################################

let search = {customerId:this.custNo,customerType:this.customerType }, loggedInUser={custNo: this.custNo};

    let postData = {
      auth: auth,
      search:search,
      loggedInUser:loggedInUser
    };

    var controller = this;
    this.sendRequestToServer(
      "AccountsManagement",
      "getCustomerSavingsAccounts",  
      JSON.stringify(postData),
      function(response) {
        controller.handleResponse(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );
  }

  handleResponse(response){
    let respData = response.returnData.rows;
    console.log(respData)
    let accounts = respData
      this.savingsAccountList = accounts.filter(item => item.acct_type !== "LN");;
      this.savingsAccountList.forEach(obj => {
        obj.displayName = this.toUpper(obj.product)
        console.log(obj.displayName);
      })

  }

  toUpper(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(word) {
          if(word[0]){
            console.log("First capital letter: "+word[0]);
            console.log("remain letters: "+ word.substr(1));
            return word[0].toUpperCase() + word.substr(1);
          }
            
        })
        .join(' ');
     }

  details(row){

    let auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };

    let postData = {
      auth: auth,
      acctNo: row
    }

    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "tansactionHistory",
      JSON.stringify(postData),
      function(response) {
        that.handleResponseDetails(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );


    console.log(row)
    this.transDisplay='block';
  }

  handleResponseDetails(response){
    this.transHistory = response.returnData;
  }

}
