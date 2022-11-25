import { Component, OnInit,  ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Plugins } from "@capacitor/core";
import { AuthService } from "src/app/services/auth.service";
import { NavController ,IonRouterOutlet, Platform, LoadingController } from "@ionic/angular";
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

const { Storage } = Plugins;




@Component({
  selector: "app-menu",
  templateUrl: "./menu.page.html",
  styleUrls: ["./menu.page.scss"]
})
export class MenuPage extends LoginService{
  username = "";
  active: string;
  branchId:number;
  custNo: string;
  id:number;
  name:string;
  token:string;
  institution:number;
  institutionTypeId: number
  institutionName: string;
  customerImage:any;
  licenseStatus:boolean=false;
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;

  pages = [];
  year:number = (new Date()).getFullYear()

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    private authService: AuthService,
    public navCtrl: NavController,
    public loaderService:LoaderServiceService,
    public platform: Platform,
    public loadingController: LoadingController
    
  ) {
    super(http, helper, loadingController);

    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/menu/main') {
        // this.platform.exitApp(); 
  
        // or if that doesn't work, try
        navigator['app'].exitApp();
        // this.router.navigate(['/menu/main']);
      } else {
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
    
  }

  ionViewWillEnter() {
    console.log(this.institutionTypeId, ' --institutionTypeId--')
    
    if (this.authService.isAgent()) {
      if(this.helper.licenseStatus){
        if(this.institutionTypeId === 2) {
          this.pages = [
            {
              title: "Home",
              url: "/menu/agent-dashboard",
              icon: "home"
            },       
            {
              title:"Customers",
              url:"/menu/search",
              icon:"search"
            },
            {
              title:"Loan Appraisal",
              url:"/menu/loan-appraisal",
              icon:"person-add"
            },
  
          ];
        } else {
          this.pages = [
            {
              title: "Home",
              url: "/menu/agent-dashboard",
              icon: "home"
            },  
            {
              title:"Members",
              url:"/menu/search",
              icon:"search"
            },
            {
              title:"Loan Appraisal",
              url:"/menu/loan-appraisal",
              icon:"person-add"
            },
  
          ];
        }
        
       
      }else{
        if(this.institutionTypeId === 2) {
          this.pages = [
            {
              title: "Home",
              url: "/menu/agent-dashboard",
              icon: "home"
            },       
            {
              title:"Customers",
              url:"/menu/search",
              icon:"search"
            },
  
          ];
        } else {
          this.pages = [
            {
              title: "Home",
              url: "/menu/agent-dashboard",
              icon: "home"
            },       
            {
              title:"Members",
              url:"/menu/search",
              icon:"search"
            },
  
          ];
        }
        
      }
      
      this.openPage("/menu/agent-dashboard");
    } else {
      if(this.institutionTypeId === 2) {
        this.pages = [
          {
            title: "Home",
            url: '/menu/home-tabs',
            icon: "home"
          },
          
          {
            title: "Profile",
            url: "/menu/accounts",
            icon: "person"
          },
          {
            title: "Loans",
            url: "/menu/loans",
            icon: "eye"
          },
          {
            title: "Transactions",
            url: "/menu/payments",
            icon: "water"
          },
          {
            title: "Loan Payments",
            url: "/menu/payments",
            icon: "list"
          },
          {
            title:"Make Payment",
            url:"/menu/make-payment",
            icon:"cash"
          },
          
        ];
      } else {
        this.pages = [
      
          {
            title: "Home",
            url: '/menu/home-tabs',
            icon: "home"
          },
          
          {
            title: "Profile",
            url: "/menu/accounts",
            icon: "person"
          },
          {
            title: "Loans",
            url: "/menu/loans",
            icon: "wallet"
          },          
          {
            title: "Payments",
            url: "/menu/payments",
            icon: "list"
          },
          {
            title:"Make Payments",
            url:"/menu/make-payment",
            icon:"cash"
          }
        ];
      }
      
      this.openPage("/menu/home-tabs");
    }

    this.username = this.authService.currentUser.roles;
  }

  openPage(page) {
    this.navCtrl.navigateForward(page);
  }
  loanui() {
    this.router.navigate(['/loan-ui'])
  }

  logout() {
    this.authService.logout();
    this.clear();
    this.navCtrl.navigateBack("/new-login");
  }

  async ngOnInit() {
    super.ngOnInit();
    let user;
    //#################### Storage Data #####################################
       await Storage.get({ key: 'userData' }).then(val=>{
       user = JSON.parse(val.value);
       this.token=user.token;
       this.branchId = user.branchId;
       this.custNo=user.custNo;
       this.id=user.id;
       this.name= user.name;
       this.institution = user.institution;
       this.institutionName = user.institutionName;
       this.institutionTypeId = user.institutionTypeId;
    });
   
  


    if (!this.authService.isAgent()) {
    let auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };
    
    let postData = {
      auth: auth
    }
    
    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "customerPic",
      JSON.stringify(postData),
      function(response) {
        that.handleResponseDetails(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );
   
    }


  }

  async clear() {
    await Storage.clear();
  }

  handleResponseDetails(response){
 
    if(response.returnData) {
      this.customerImage = response.returnData.custPhoto;
    } else{
      this.customerImage="../../assets/img/user.jfif"
}
 
  }


}
