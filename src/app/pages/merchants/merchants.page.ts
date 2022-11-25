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

const { Storage } = Plugins;
@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.page.html',
  styleUrls: ['./merchants.page.scss'],
})
export class MerchantsPage  extends LoginService{
  token:any;
  branchId:any;
  custNo:any;
  id:any;
  name:any;
  institution:any;
  institutionName:any;
  serviceFormGp:FormGroup;
  servicesList:any = [];
  companyList:any =[];
  packageList:any =[];
  results: any ={};
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;



  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    private authService: AuthService,
    public navCtrl: NavController,
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


        this.serviceFormGp = this.fb.group({
          packageId: new FormControl(''),
          company: new FormControl(''),
          service: new FormControl(''),
          custNo:  new FormControl(''),
        });

        // this.getServices()
    


  }


  // getServices(){
  //   let search, postData,auth,userData;
    
  //   auth={
  //     userData:userData
  //   }
  //   search={
  //     searchWord:'getMerchantCategories'
  //   }
  //   postData={
  //     search:search,
  //     auth:auth
  //   }

  //   let that = this;
  //   this.sendRequestToServer(
  //     "CustomerManagement",
  //     "getCustomerRegData",
  //     JSON.stringify(postData),
  //     function(response){
  //       that.handleServices(response);
  //     },
  //     function(err){
  //       console.log(err.message);
  //     }
  //   )
  // }

  // handleServices(response){
  //   if(response.returnCode != 0){

  //   }else{
  //     this.getCompany();
  //     this.servicesList= response.returnData;
  //     console.log('this.servicesList');
  //     console.log(this.servicesList);
  //   }
  //   // console.log(response)
  //   // servicesList:any = []
  //   // companyList:any =[]
  //   // packageList:any =[]
  // }

  // getCompany(){
  //   let search, postData,auth,userData;
    
  //   auth={
  //     userData:userData
  //   }
  //   search={
  //     searchWord:'getMerchants'
  //   }
  //   postData={
  //     search:search,
  //     auth:auth
  //   }

  //   let that = this;
  //   this.sendRequestToServer(
  //     "CustomerManagement",
  //     "getCustomerRegData",
  //     JSON.stringify(postData),
  //     function(response){
  //       that.handleMerchants(response);
  //     },
  //     function(err){
  //       console.log(err.message);
  //     }
  //   )
  // }

  // handleMerchants(response){
  //   if(response.returnCode != 0){
  //     console.log(response)
  //   }else{
  //     this.getPackages();
  //       this.companyList= response.returnData.rows;
  //       console.log('this.companyList')
  //       console.log(this.companyList)
  //   }
  //   // console.log(response)
  //   //     this.getPackages();
  //       // companyList:any =[]
  //   // packageList:any =[]
  // }

  // getPackages(){
  //   let search, postData,auth,userData;
    
  //   auth={
  //     userData:userData

  //   }
  //   search={
  //     searchWord:'getMerchantPackages',
  //     // institutionId:this.institution
  //   }
  //   postData={
  //     search:search,
  //     auth:auth
  //   }

  //   let that = this;
  //   this.sendRequestToServer(
  //     "CustomerManagement",
  //     "getCustomerRegData",
  //     JSON.stringify(postData),
  //     function(response){
  //       that.handlePackages(response);
  //     },
  //     function(err){
  //       console.log(err.message);
  //     }
  //   )
  // }

  // handlePackages(response){
  //   if(response.returnCode != 0){
  //     console.log(response)
  //   }else{
  //     this.packageList = response.returnData.rows;
  //     console.log('this.packageList');
  //     console.log(this.packageList);
  //   }
    
  // }

  // generateRefNo(){
  //   let search, postData, auth, requestData,userData, id=null,pack;
  //   // this.serviceFormGp.controls['custNo'].setValue(this.custNo)
  //   pack = this.serviceFormGp.controls['packageId'].value;
  //   auth={
  //     userData:userData
  //   }
  //   requestData=this.serviceFormGp.value
  //   requestData.id = id;
  //   requestData.custNo = this.custNo
  //   requestData.packageId = parseInt(pack);

  //   search={
  //     searchWord:'generatePaymentReference',
  //   }
  //   postData={
  //     search:search,
  //     auth:auth,
  //     requestData:requestData
  //   }

  //   let that = this;
  //   this.sendRequestToServer(
  //     "CustomerManagement",
  //     "getCustomerRegData",
  //     JSON.stringify(postData),
  //     function(response){
  //       that.handleGenerateRefNo(response);
  //     },
  //     function(err){
  //       console.log(err.message);
  //     }
  //   )
  // }

  // handleGenerateRefNo(response){
  //   if(response.returnCode != 0){
  //     console.log(response);
  //   }else{
  //     this.results = response.returnData;
  //     console.log(this.results)
  //   }
   
  // }


  merchantServices(){
    this.navCtrl.navigateForward('/menu/merchant-services');
  }
  merchantHistory(){
    this.navCtrl.navigateForward('/menu/merchant-history');
  }
}
