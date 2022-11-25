import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, NavController, AlertController, Platform, LoadingController, IonRouterOutlet } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { HelperService, AppUser } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { LoginService } from 'src/app/services/login.service';
import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.page.html',
  styleUrls: ['./home-tabs.page.scss'],
})
export class HomeTabsPage extends LoginService {
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  public user: AppUser;
  active: string;
  branchId:any;
  custNo: string;
  id:any;
  name:string;
  token:string;
  institution:any;
  institutionName: string;
  data=[];

 
  institutionType: number;
  
  constructor(
    public modalController: ModalController,
    private router:Router,
    // private navParams: NavParams,
    public http: HttpClient,
    public helper: HelperService,
   // private loginService: LoginService,
    private fb: FormBuilder,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    private authService:AuthService,
    public navCtrl:NavController,
    private alertCtrl:AlertController,
    public platform: Platform,
    public loadingController: LoadingController
  ) { 
    super( http,helper, loadingController);
    this.helper.user.subscribe((val: AppUser) => {
      this.user = val;
    });
    console.log(this.user, '---my home tabs---');

    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/menu/home-tabs/tabs/home') {
        // this.platform.exitApp(); 
        // this.router.navigate(['/menu/main']);
        // or if that doesn't work, try
        navigator['app'].exitApp();
      } else {
        this.router.navigate(['/menu/home-tabs/tabs/home']);
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
  }

  async ngOnInit() {
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
          this.institutionType = user.institutionTypeId;
  }

}
