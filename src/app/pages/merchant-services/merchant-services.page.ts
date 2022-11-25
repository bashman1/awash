import { Component, OnInit, ViewChild } from '@angular/core';
import { Plugins } from "@capacitor/core";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, Platform, LoadingController, IonRouterOutlet } from '@ionic/angular';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonFunctions } from 'src/app/services/CommonFunctions';

const { Storage } = Plugins;

@Component({
  selector: 'app-merchant-services',
  templateUrl: './merchant-services.page.html',
  styleUrls: ['./merchant-services.page.scss'],
})
export class MerchantServicesPage extends LoginService {
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
  serviceShow:any = false;
  customPopoverOptions:any;
  customActionSheetOptions:any;
  selectedPackage:any ={}
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
    public commonFunction:CommonFunctions,
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


            this.serviceFormGp = this.fb.group({
              packageId: new FormControl('', Validators.required),
              company: new FormControl('', Validators.required),
              service: new FormControl('', Validators.required),
              custNo:  new FormControl('', Validators.required),
              extraDependants: new FormControl(''),
            });
            this.getServices();
            
  }

  getServices(){
    let search, postData,auth,userData;
    
    auth={
      userData:userData
    }
    search={
      searchWord:'getMerchantCategories',
      institutionId: this.institution,
      status: 'Active'
    }
    postData={
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response){
        that.handleServices(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleServices(response){
    console.log("*************** Searvice ***************************")
    console.log(response);
    if(response.returnCode != 0){

    }else{
      this.serviceShow = true
      this.servicesList= response.returnData.rows;
      console.log('this.servicesList');
      console.log(this.servicesList);
      console.log("*************** Searvice 1 ***************************")
      console.log(this.servicesList);

    }
  }

  onServiceChange(event){
    // console.log();
    this.getCompany(event.target.value);

  }

  getCompany(service_id){
    let search, postData,auth,userData;
    
    auth={
      userData:userData
    }
    search={
      searchWord:'getMerchants',
      serviceId: service_id,
      sortField:'M.created_on'
    }
    postData={
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response){
        that.handleMerchants(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleMerchants(response){
    if(response.returnCode != 0){
      console.log(response)
    }else{
      
        this.companyList= response.returnData.rows;
        console.log("**************** Companies ************")
        console.log(this.companyList);
        // console.log('this.companyList')
        // console.log(this.companyList)
    }
    // console.log(response)
    //     this.getPackages();
        // companyList:any =[]
    // packageList:any =[]
  }

  onMerchantChange(event){
    console.log(event);
    this.getPackages(event.target.value);
  }


  getPackages(merchant_id){
    let search, postData,auth,userData;
    
    auth={
      userData:userData

    }
    search={
      searchWord:'getMerchantPackages',
      institutionId:this.institution,
      merchantId: merchant_id,
      status: 'Active'
    }
    postData={
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response){
        that.handlePackages(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handlePackages(response){
    if(response.returnCode != 0){
      console.log(response)
    }else{
      console.log('+++++++++++++++++++++++++++++')
      console.log(response)
      this.packageList = response.returnData.rows;
      // console.log('this.packageList');
      // console.log(this.packageList);
      this.serviceShow = true
      if (this.packageList === undefined || this.packageList == 0) {
        // this.serviceShow = false
    }
    }
    
  }


  generateRefNo(){
    let search, postData, auth, requestData,userData, id=null,pack;
    // this.serviceFormGp.controls['custNo'].setValue(this.custNo)
    pack = this.serviceFormGp.controls['packageId'].value;

    if (this.serviceFormGp.controls['service'].status === 'INVALID') {
      // console.log("not Valid");
      // console.log(this.serviceFormGp.status);
      // console.log(this.serviceFormGp.controls['service'].status)
      // console.log(this.serviceFormGp.controls['company'].status)
      // console.log(this.serviceFormGp.controls['packageId'].status)
      this.commonFunction.presentToast("Please select a service", 2000, '');
      return;
    }if(this.serviceFormGp.controls['company'].status === 'INVALID'){
      this.commonFunction.presentToast("Please select a service provider", 2000, '');
      return;
    }if(this.serviceFormGp.controls['packageId'].status === 'INVALID'){
      this.commonFunction.presentToast("Please select a package", 2000, '');
      return;
    }
    auth={
      userData:userData
    }
    requestData=this.serviceFormGp.value
    requestData.id = id;
    requestData.custNo = this.custNo
    requestData.packageId = parseInt(pack);

    search={
      searchWord:'generatePaymentReference',
    }
    postData={
      search:search,
      auth:auth,
      requestData:requestData
    }

    let that = this;
    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response){
        that.handleGenerateRefNo(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleGenerateRefNo(response){
    if(response.returnCode != 0){
      console.log(response);
    }else{
      this.results = response.returnData;
      console.log(this.results)
      this.navCtrl.navigateForward('/menu/merchant-history');
    }
   
  }


  onPackageChange=(event)=>{
    this.packageList.forEach(element => {
      if(element.id == event.target.value){
        this.selectedPackage = element;
      }
    });
  }


  dependentsChange(){
    console.log('changed')
  }

}