import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { ModalController, IonRouterOutlet, Platform, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "src/app/services/helper.service";
import { LoaderServiceService } from "src/app/services/loader-service.service";
import { CommonFunctions } from "src/app/services/CommonFunctions";
import { LoginService } from "src/app/services/login.service";
import { MainPage } from "../main/main.page";
import { from } from "rxjs";

const { Storage } = Plugins;
@Component({
  selector: "app-shares",
  templateUrl: "./shares.page.html",
  styleUrls: ["./shares.page.scss"]
})
export class SharesPage extends LoginService {
  active: string;
  branchId: any;
  custNo: string;
  id: any;
  name: string;
  token: string;
  institution: any;
  sharesList: any[];
  emptycheck: boolean = true;
  emptyMessage: any;
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;

  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public platform: Platform,
    public loadingController: LoadingController,

    // private loginService: LoginService,
    // private fb: FormBuilder,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions
  ) {
    super(http, helper, loadingController);
    
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      }else {
        this.router.navigate(['/menu/home-tabs/tabs/home']);
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

  // async getObject() {
  //   const ret = await Storage.get({ key: 'userData' });
  //   const user = JSON.parse(ret.value);
  //   this.token=user.token;
  //   this.branchId = user.branchId;
  //   this.custNo=user.custNo;
  //   this.id=user.id;
  //   this.name= user.name;
  //   this.institution = user.institution
  // }

  async ngOnInit() {
    super.ngOnInit();
    // this.getObject();

    const ret = await Storage.get({ key: "userData" });
    const user = JSON.parse(ret.value);
    this.token = user.token;
    this.branchId = user.branchId;
    this.custNo = user.custNo;
    this.id = user.id;
    this.name = user.name;
    this.institution = user.institution;

    let auth = {
      token: this.token,
      username: this.custNo,
      type: "mobile"
    };

    let search = {
      custNo: this.custNo
    };

    let postData = {
      auth: auth,
      search: search
    };

    var controller = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "customerShares",
      JSON.stringify(postData),
      function(response) {
        controller.handleResponse(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );
  }

  // showdata(){
  //   this.getObject()

  // }

  handleResponse(response) {
    this.emptycheck = true;
    console.log(response);
    let respData = response.returnData;
    this.sharesList = response.returnData.rows;
    console.log("Our return: " + JSON.stringify(respData));
    console.log(this.sharesList);
    if (this.sharesList.length == 0) {
      console.log(
        "----------------Search by date is empty ---------------------"
      );
      this.emptycheck = false;
      this.emptyMessage = "No shares found";
      // this.emptycheck = false;
    }
    // if(response.returnCode == 0){

    // }
  }
}
