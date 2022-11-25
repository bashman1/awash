import { Component, OnInit, ViewChild } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import { ModalController, Platform, IonRouterOutlet, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "src/app/services/helper.service";
import { LoaderServiceService } from "src/app/services/loader-service.service";
import { CommonFunctions } from "src/app/services/CommonFunctions";
import { Plugins } from "@capacitor/core";
// import { ImageViewerController } from "ionic-img-viewer";
const { Storage } = Plugins;

@Component({
  selector: "app-accounts",
  templateUrl: "./accounts.page.html",
  styleUrls: ["./accounts.page.scss"]
})
export class AccountsPage extends LoginService {
  active: string;
  branchId: any;
  custNo: string;
  id: any;
  name: string;
  token: string;
  institution: any;
  customerType: any;

  customerProfile: any;
  
  customer_image: any;
  cust_number:any;
  customer_contact:any;
  date_of_birth:any;
  customer_name:any;
  customer_gender:any;
  customer_title:any;
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  branchList:any;

  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    public platform: Platform,
    public loadingController: LoadingController
    // public imageViewerCtrl: ImageViewerController
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

    const ret = await Storage.get({ key: "userData" });
    const user = JSON.parse(ret.value);
    this.token = user.token;
    this.branchId = user.branchId;
    this.custNo = user.custNo;
    this.id = user.id;
    this.name = user.name;
    this.institution = user.institution;
    this.customerType = user.custTypeId;
    this.institutionName = user.institutionName;

    let postData, search, auth, loggedInUser={custNo: this.custNo};
    search = { customerId: this.custNo, customerType: this.customerType };
    auth = await {
      token: this.token,
      username: this.custNo,
      type: "mobile"
    };
    postData = {
      auth: auth,
      search: search,
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
      }
    );
    //#################### Storage Data #######################################
    this.getCustomerBranchLevel();
  }

  

  handleResponse(response) {
    let respData = response.returnData.rows[0];
    this.customerProfile = respData;
    
    this.customer_image = this.customerProfile.cust_photo;
    if(!this.customer_image){
      this.customer_image='../../assets/img/user.jfif';
    }
    this.cust_number = this.customerProfile.cust_no
    this.customer_contact =this.customerProfile.contact_value
    this.date_of_birth=this.customerProfile.date_of_birth
    this.customer_name =this.customerProfile.first_name+" "+this.customerProfile.last_name
    this.customer_gender = this.customerProfile.gender
    this.customer_title=this.customerProfile.title
  }

  getCustomerBranchLevel(){
    let postData, search, auth;
    search = { customerId: this.custNo, 
              customerType: this.customerType,
              branchId: this.branchId,
              institution: this.institution
             };
    auth = {
      token: this.token,
      username: this.custNo,
      type: "mobile"
    };
    postData = {
      auth: auth,
      search: search
    };

    var controller = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "customerBranchLevels",
      JSON.stringify(postData),
      function(response) {
        controller.handleResponseBranchLevel(response);
      },
      function(err) {
      }
    );

  }

  handleResponseBranchLevel(response){
    this.branchList = response.returnData.rows[0];
    
    if(response.returnCode != 0){
      
    }
  }
}
