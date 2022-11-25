import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { ModalController, Platform, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import {FormGroup,FormBuilder,FormControl,Validators,AbstractControl} from "@angular/forms";
import { ToastController } from '@ionic/angular';
import { Plugins, CameraResultType, CameraSource} from '@capacitor/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { Platform } from 'ionic-angular';


const { Camera } = Plugins;
// import { type } from 'os';
@Component({
  selector: 'app-self-registration',
  templateUrl: './self-registration.page.html',
  styleUrls: ['./self-registration.page.scss'],
})
export class SelfRegistrationPage extends LoginService {
  institutionList:any =[];
  institution: any;
  ngmodel10:any;
  ngmodel9:any;
  ngmodel8:any;
  ngmodel7:any;
  ngmodel6:any;
  ngmodel5:any;
  ngmodel4:any;
  ngmodel3:any;
  ngmodel2:any;
  ngmodel1:any;
  regionModel:any;
  districtModel:any;
  countytModel:any;
  subCountytModel:any;
  parishModel:any;
  countryCodeModel:any;
  // firstBtnStus:any=true;
  // thirdBtnStus:any = true;
  selfRegistration: FormGroup;
  hirachyList:any [];
  Blevl1 :any ='none';
  Blevl2:any ='none';
  Blevl3:any ='none';
  Blevl4:any ='none';
  Blevl5:any ='none';
  Blevl6:any ='none';
  Blevl7:any ='none';
  Blevl8:any ='none';
  Blevl9:any ='none';
  Blevl10:any ='none';
  lvl1:any;
  lvl2:any;
  lvl3:any;
  lvl4:any;
  lvl5:any;
  lvl6:any;
  lvl7:any;
  lvl8:any;
  lvl9:any;
  lvl10:any;
  branchList:any[]=[];
  branchsLevel1 :any[]=[];
  branchsLevel2 :any[]=[];
  branchsLevel3 :any[]=[];
  branchsLevel4 :any[]=[];
  branchsLevel5 :any[]=[];
  branchsLevel6 :any[]=[];
  branchsLevel7 :any[]=[];
  branchsLevel8 :any[]=[];
  branchsLevel9 :any[]=[];
  branchsLevel10 :any[]=[];
  titleList:any[]=[];
  contactCodelist:any=[];
  genderList:any=[];
  regionList:any=[];
  districtList:any=[];
  countylist:any=[];
  subCountylist:any=[];
  parishList:any=[];
  displayInstitution:any='none';
  displayLevels:any='none';
  displayBasicInfo:any='none';
  displayContact:any='none';
  displayAddress:any='none';
  displayID:any='none';
  displayProfile:any='none';
  displayresults:any='none';
  returnDataList:any={};
  institutionId:any;
  country:any='ug';
  countryCode:any= "+256";
  captured_img:any = "../../assets/img/mobilemenu.png";
  currentDate:any;

  idBackImg:any;
  idFrontImg:any;
  profilePicImg:any;
  levelZeroBranchId:any;
  customActionSheetOptions:any;

  imageTaken:SafeResourceUrl;
  customerContactConfirmation:any={};
  oncustomerContactConfirmation:boolean = false;
  
  idTypeRef:any = [];

  validation_messages = {
    selectInstitution:[
      {type: 'required', message:'Please select institution'}
    ],
    title:[
      {type:'required', message: 'Please select title'}
    ],
    firstName:[
      {type:'required', message: 'First name is required'}
    ],
    lastName:[
      {type:'required', message: 'Last name is required'}
    ],
    dateOfBirth:[
      {type:'required', message: 'Date of birth is required'}
    ],
    gender:[
      {type:'required', message: 'Gender is required'}
    ],
    contactCode:[
      {type:'required', message: 'Please select country code'}
    ],
    phoneNo:[
      {type:'required', message: 'Phone number is required'},
      {type:'pattern', message: 'Please fill in a valid phone number'}
    ],
    email:[
      {type:'required', message: 'Email is required'},
      {email: 'This is not an email'},
      {type:'pattern', message: 'Invalid Email Format'}
    ],
    region:[
      {type:'required', message: 'Please select region'}
    ],
    district:[
      {type:'required', message: 'Please select district'}
    ],
    county:[
      {type:'required', message: 'Please select county'}
    ],
    subCounty:[
      {type: 'required', message: 'Please select sub-county'}
    ],
    parish:[
      {type:'required', message: 'Please select sub-county'}
    ],
    village:[
      {type:'required', message: 'Village is required'},
    ],
    idtype:[
      {type:'required', message: 'Please select ID type'}
    ],
    idNo:[
      {type:'required', message: 'ID number is required'},
      {type:'pattern', message: 'Please fill in a valid ID number'}

    ],
    issueDate:[
      {type:'required', message: 'ID issue date is required'},
    ],
    expDate:[
      {type:'required', message: 'ID expiery date is required'},

    ]
  }




  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    private fb: FormBuilder,
    public platform: Platform,
    public alertController: AlertController,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    public toastController: ToastController,
    public navCtrl: NavController,
    // public camera: Camera,
    public sanitizer: DomSanitizer,
    public loadingController: LoadingController
  ) { 
    super(http, helper, loadingController);
    this.commonFunction.backButtonRedirect('/self-registration','/new-login');
  }

  ngOnInit() {
    super.ngOnInit();

    this.getInstitutions();
    this.getTitleRef();
    this.getContactRef();
    this.getGenderRef();
    this.getRegions();
    this.getIdTypeRefData();
    this.displayInstitution='block'

    let today = new Date();
    this.currentDate = today.getFullYear()+'-'+String(today.getMonth() + 1).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0');
    this.selfRegistration = this.fb.group({
      selectInstitution: new FormControl(null, Validators.compose([Validators.required])),
      level1: new FormControl(''),
      level2: new FormControl(''),
      level3: new FormControl(''),
      level4: new FormControl(''),
      level5: new FormControl(''),
      level6: new FormControl(''),
      level7: new FormControl(''),
      level8: new FormControl(''),
      level9: new FormControl(''),
      level10: new FormControl(''),
      title: new FormControl('', Validators.compose([Validators.required])),
      firstName: new FormControl('', Validators.compose([Validators.required])),
      lastName: new FormControl('', Validators.compose([Validators.required])),
      middletName: new FormControl(''),
      dateOfBirth: new FormControl('', Validators.compose([Validators.required])),
      gender: new FormControl('', Validators.compose([Validators.required])),
      oldCustNo: new FormControl(''),
      contactType: new FormControl(''),
      contactCode: new FormControl('', Validators.compose([Validators.required])),
      phoneNo: new FormControl('', [Validators.required, Validators.pattern('^\\d{9}$')]), //Validators.compose([Validators.required, Validators.pattern('^\\d{9}$')])
      email: new FormControl('', Validators.compose([Validators.required,  Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])),
      addressType: new FormControl(''),
      region: new FormControl('', Validators.compose([Validators.required])),
      district: new FormControl('', Validators.compose([Validators.required])),
      county: new FormControl('', Validators.compose([Validators.required])),
      subCounty: new FormControl('', Validators.compose([Validators.required])),
      parish: new FormControl('', Validators.compose([Validators.required])),
      village: new FormControl('', Validators.compose([Validators.required])),
      plotNo: new FormControl(''),
      cordinates: new FormControl(''),
      profilePic: new FormControl(''),
      idtype: new FormControl('', Validators.compose([Validators.required])),
      idNo: new FormControl('', Validators.compose([Validators.required])),
      issueDate: new FormControl('', Validators.compose([Validators.required])),
      expDate: new FormControl('', Validators.compose([Validators.required])),
      idFront: new FormControl(''),
      idBack: new FormControl(''),
    })

    this.selfRegistration.controls['contactCode'].setValue(this.countryCode)

 

  }
  getInstitutions() {
    let postData ,search;
    search= {
      searchWord:'getInstitutions',
      allowSelfRegistration: true,
      status:1
  }
    postData = {
      requestData: '',
      search
    }

    let that = this;
    this.sendRequestToServer(
      "CustomerManagement",
      "getCustomerRegData",
      JSON.stringify(postData),
      function(response) {
        that.handleGetInstitution(response);
      },
      function(err) {
        console.log(err.message);
      }
    )
  }

  handleGetInstitution(response){
    // console.log
    // console.log(response)
    this.institutionList = response.returnData.rows;
    console.log("***************************")
    console.log(this.institutionList)
    this.institutionList = [...new Map(this.institutionList.map(item => [item.id, item])).values()];
 
    console.log("-----------------------------")
    this.institutionList.forEach(element => {
      console.log(element.institution_name);
    });

  }


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }




  // NV2730001561

  institutionChange(event){
    console.log(event.value);
    // this.selfRegistration.controls['selectInstitution'].setValue(event.value.id);
    this.institutionHierarchy(event.value.id);
    this.getBranches(event.value.id, 0);
    console.log(event.value);
    console.log('______________________________________________________________')
  this.Blevl1  ='none';
  this.Blevl2 ='none';
  this.Blevl3 ='none';
  this.Blevl4 ='none';
  this.Blevl5 ='none';
  this.Blevl6 ='none';
  this.Blevl7 ='none';
  this.Blevl8 ='none';
  this.Blevl9 ='none';
  this.Blevl10 ='none';
  this.lvl1="";
  this.lvl2="";
  this.lvl3="";
  this.lvl4="";
  this.lvl5="";
  this.lvl6="";
  this.lvl7="";
  this.lvl8="";
  this.lvl9="";
  this.lvl10="";
  }

  level1Change(event){
    this.getBranches1(this.institutionId, 1, event.value.branch_id);
    console.log("level 1")
    console.log(event.value)
    console.log(event.value.branch_id)
  }

  level2Change(event){
    console.log('level 2')
    console.log(event.value.branch_name)
  this.getBranches2(this.institutionId, 2, event.value.branch_id);
  }

  level3Change(event){
    console.log('level 3')
    console.log(event.value.branch_name)
    this.getBranches3(this.institutionId, 3, event.value.branch_id);
  }

  level4Change(event){
    console.log('level 4')
    console.log(event.value.branch_name)
    this.getBranches4(this.institutionId, 4, event.value.branch_id);

  }
  level5Change(event){
    console.log('level 5')
    console.log(event.value.branch_name)
    this.getBranches5(this.institutionId, 5, event.value.branch_id);

  }
  level6Change(event){
    console.log('level 6')
    console.log(event.value.branch_name)
    this.getBranches6(this.institutionId, 6, event.value.branch_id);

  }
  level7Change(event){
    console.log('level 7')
    console.log(event.value.branch_name)
    this.getBranches7(this.institutionId, 7, event.value.branch_id);

  }
  level8Change(event){
    console.log('level 8')
    console.log(event.value.branch_name)
    this.getBranches8(this.institutionId, 8, event.value.branch_id);

  }
  level9Change(event){
    console.log('level 9')
    console.log(event.value.branch_name)
    this.getBranches9(this.institutionId, 9, event.value.branch_id);


  }
  level10Change(event){
    console.log('level 10')
    console.log(event.value.branch_name)
  }

  

 

  institutionHierarchy(id){
    let postData, search;
    search={
      sortField: 'id'
    }
    postData = {
      institutionId: id,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getInstitutionHierarchy",
      JSON.stringify(postData),
      function(response){
        that.handleInstitutionHierarchy(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleInstitutionHierarchy(response){
    console.log(response);
    this.hirachyList = response.returnData.rows
    this.determineDisplaylevel();
  }

  determineDisplaylevel(){
    let that = this;
    this.hirachyList.forEach( function(val){
     
      that.institutionId = val.institution_id;
      if(val.heirachy_code === 0){
        that.Blevl1= 'none';
        that.lvl1 = val.heirachy_name;
        console.log("*********************");
        that.levelZeroBranchId=val.branch_id;
        // that.selfRegistration.controls['level1'].setValue(val.branch_id);
        // console.log(val.branch_id);
        // console.log(val);

        that.getBranches(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 1){
        that.Blevl2= 'block';
        that.lvl2= val.heirachy_name;
        // that.getBranches1(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 2){
        that.Blevl3= 'block';
        that.lvl3= val.heirachy_name;
        // that.getBranches2(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 3){
        that.Blevl4= 'block';
        that.lvl4= val.heirachy_name;
        // that.getBranches3(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 4){
        that.Blevl5= 'block';
        that.lvl5= val.heirachy_name;
        // that.getBranches4(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 5){
        that.Blevl6= 'block';
        that.lvl6= val.heirachy_name;
        // that.getBranches5(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 6){
        that.Blevl7= 'block';
        that.lvl7= val.heirachy_name;
        // that.getBranches6(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 7){
        that.Blevl8= 'block';
        that.lvl8= val.heirachy_name;
        // that.getBranches7(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 8){
        that.Blevl9= 'block';
        that.lvl9= val.heirachy_name;
        // that.getBranches8(val.institution_id, val.heirachy_code);
      }
      if(val.heirachy_code === 9){
        that.Blevl10= 'block';
        that.lvl10= val.heirachy_name;
        // that.getBranches9(val.institution_id, val.heirachy_code);
      }
      else{
  

      }


      
      // console.log(val)
      // console.log(val.heirachy_code)
      // console.log(typeof(val.heirachy_code))
    })
  }



  getBranches(instId, parentId){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleBrances(response){
    console.log("************************************** 1")
    // console.log(response.returnData.rows
    this.branchList = response.returnData.rows;
    console.log(this.branchList[0].branch_id);
    console.log(this.institutionId);
    let that = this;
    this.branchList.forEach(val =>{
      that.getBranches1(that.institutionId, 1, val.branch_id);
      console.log("||||||||||||||||||||||||||");
      console.log(val)
    })
    // this.getBranches1(this.institutionId, 1, event.value.branch_id);
  }


  getBranches1(instId, parentId, parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances1(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleBrances1(response){
    console.log("************************************** 1")
    // console.log(response.returnData.rows
    this.branchsLevel1 =response.returnData.rows
    console.log(this.branchsLevel1)
  }

  getBranches2(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances2(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances2(response){
    console.log("************************************** 2")
    // console.log(response
    this.branchsLevel2 =response.returnData.rows
    console.log(this.branchsLevel2)
  }

  getBranches3(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances3(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances3(response){
    console.log("************************************** 3")
    // console.log(response
    this.branchsLevel3 =response.returnData.rows
    console.log(this.branchsLevel3)
  }

  getBranches4(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances4(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances4(response){
    console.log("************************************** 4")
    // console.log(response
    this.branchsLevel4 =response.returnData.rows
    console.log(this.branchsLevel4)
  }

  getBranches5(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances5(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances5(response){
    console.log("************************************** 5")
    // console.log(response
    this.branchsLevel5 =response.returnData.rows
    console.log(this.branchsLevel5)
  }

  getBranches6(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances6(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances6(response){
    console.log("************************************** 6")
    // console.log(response
    this.branchsLevel6 =response.returnData.rows
    console.log(this.branchsLevel6)
  }

  getBranches7(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances7(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances7(response){
    console.log("************************************** 7")
    // console.log(response
    this.branchsLevel7 =response.returnData.rows
    console.log(this.branchsLevel7)
  }


  getBranches8(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances8(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances8(response){
    console.log("************************************** 8")
    // console.log(response
    this.branchsLevel8 =response.returnData.rows
    console.log(this.branchsLevel8)
  }

  getBranches9(instId, parentId , parent){
    let postData, search, requestData;
    search={
      sortField: 'Q.branch_id'
    }
    requestData={
      institutionId: instId,
      parentid : parentId,
      mobileLevels: parent
    }
    postData = {
      requestData:requestData,
      search:search
    }

    let that = this;
    this.sendRequestToServer(
      "InstitutionManagement",
      "getParentBranch",
      JSON.stringify(postData),
      function(response){
        that.handleBrances9(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleBrances9(response){
    console.log("************************************** 9")
    // console.log(response
    this.branchsLevel9 = response.returnData.rows
    console.log(this.branchsLevel9)
  }

  getTitleRef(){
    let postData, search, requestData , auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
    requestData={
      
    }
    postData = {
      requestData:requestData,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getCustomerTitleRefData",
      JSON.stringify(postData),
      function(response){
        that.handleTitleRef(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleTitleRef(response){
    // console.log("**************** Titles **********************")
    this.titleList= response.returnData;
    // console.log(this.titleList);
  }

  getContactRef(){
    let postData, search, requestData , auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
    requestData={
      
    }
    postData = {
      requestData:requestData,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getCountryRefData",
      JSON.stringify(postData),
      function(response){
        that.handleContactRef(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleContactRef(response){
    console.log("**************** contact codes **********************");
    this.contactCodelist= response.returnData
    console.log(this.contactCodelist)
  }


  getGenderRef(){
    let postData, search, requestData , auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
    requestData={
      
    }
    postData = {
      requestData:requestData,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getGenderRefData",
      JSON.stringify(postData),
      function(response){
        that.handleGenderRef(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleGenderRef(response){
    // console.log("**************** gender **********************");
    // console.log(response)
    this.genderList = response.returnData;
    // console.log(this.genderList);
  }


  getRegions(){
    let postData, search, requestData , auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
    requestData={
      
    }
    postData = {
      requestData:requestData,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getRegions",
      JSON.stringify(postData),
      function(response){
        that.handleRegions(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleRegions(response){
    console.log("**************** Regions **********************");
    // console.log(response)
    this.regionList = response.returnData;
    console.log(this.regionList);
    console.log(this.regionList.countryId);

    // this.genderList = response.returnData;
    // console.log(this.genderList);
    
    
  }

  onSelectRegion(event){
    console.log(event.value)
    // this.getDestricts(+event.detail.value);
    this.getDestricts(event.value.id);

  }

/**
 * 
 * @param regionId 
 */
  getDestricts(regionId){
    let postData, search,auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
   
    postData = {
      requestData:regionId,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getAllDistrict",
      JSON.stringify(postData),
      function(response){
        that.handleDestricts(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleDestricts(response){
    console.log("**************** Districts **********************");
    // console.log(response)
    this.districtList = response.returnData;
    console.log(this.districtList)
  }

  onSelectDistrict(event){
    console.log(event.value)
    // this.getCounty(+event.detail.value)
    this.getCounty(event.value.id)

  }


  getCounty(districtId){
    let postData, search,auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
   
    postData = {
      requestData:districtId,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getAllCounty",
      JSON.stringify(postData),
      function(response){
        that.handleCounty(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleCounty(response){
    console.log("**************** County **********************");
    console.log(response)
    this.countylist = response.returnData;
    console.log(this.countylist);
  
  }

  onSelectCounty(event){
    console.log(event.value);
    this.getSubCounty(event.value.id);
  }

  /**
   * 
   * @param countyId get subcounty
   */

  getSubCounty(countyId){
    let postData, search,auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
   
    postData = {
      requestData:countyId,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getAllSubcounties",
      JSON.stringify(postData),
      function(response){
        that.handleSubCounty(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }
  
  handleSubCounty(response){
    console.log("**************** SubCounty **********************");
    console.log(response)
    this.subCountylist = response.returnData;
    console.log(this.subCountylist);
  
  }

  onSelectSubCounty(event){
    console.log(event.value)
    // console.log(event.detail.value);
    this.getParish(+event.value.id)
  }


/**
 * 
 * @param parishId getting parishes
 */
  getParish(parishId){
    let postData, search,auth, userData;
    search={
      sortField: 'Q.branch_id'
    }
    userData={}
    auth={
      userData:userData
    }
   
    postData = {
      requestData:parishId,
      search:search,
      auth:auth
    }

    let that = this;
    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getAllParishes",
      JSON.stringify(postData),
      function(response){
        that.handleParish(response);
      },
      function(err){
        console.log(err.message);
      }
    )
  }

  handleParish(response){
    console.log("**************** Parish **********************");
    console.log(response)
    this.parishList = response.returnData
  }

/**
 * 
 * @param event 
 */
  onSelectParish(event){
    console.log(event);
  }

/**
 * 
 * @param event 
 */
  onSelectCcountryCode(event){
    console.log(event)
  }


/**
 * 
 * @param event Processing image
 */
  base64ImgIdBack(event){
    let url;
    console.log(event.target.files)
    let files = event.target.files 
    let reader = new FileReader();
    reader.onload = (img:any)=>{
       url = reader.result;
       this.idBackImg = reader.result;
       console.log(url);
    }
    reader.readAsDataURL(files[0]);
    
  }

  base64ImgIdFront(event){
    let url;
    console.log(event.target.files)
    let files = event.target.files 
    let reader = new FileReader();
    reader.onload = (img:any)=>{
       url = reader.result;
       this.idFrontImg = reader.result;
       console.log(url);
    }
    reader.readAsDataURL(files[0]);

  }
  base64ImgProfilePic(event){
    let url;
    console.log(event.target.files)
    let files = event.target.files 
    let reader = new FileReader();
    reader.onload = (img:any)=>{
       url = reader.result;
       this.profilePicImg = reader.result;
      //  console.log(url);
    }
    reader.readAsDataURL(files[0]);
  }


/**
 * selfReg
 * 
 */

  selfReg(){
    // this.commonFunction.presentLoading("Registering...", 5000, "md","lines-small");
    console.log(this.selfRegistration.value)
    let postData, auth,loggedInUser, userData,requestData, basicInfo, branch_id, idType;
    
    if(this.selfRegistration.controls['level10'].value !=null){
      branch_id=this.selfRegistration.controls['level10'].value.branch_id
    }
    else if(this.selfRegistration.controls['level9'].value !=null){
      branch_id=this.selfRegistration.controls['level9'].value.branch_id
    }
    else if(this.selfRegistration.controls['level8'].value !=null){
      branch_id=this.selfRegistration.controls['level8'].value.branch_id
    }
    else if(this.selfRegistration.controls['level7'].value !=null){
      branch_id=this.selfRegistration.controls['level7'].value.branch_id
    }
    else if(this.selfRegistration.controls['level6'].value !=null){
      branch_id=this.selfRegistration.controls['level6'].value.branch_id
    }
    else if(this.selfRegistration.controls['level5'].value !=null){
      branch_id=this.selfRegistration.controls['level5'].value.branch_id
    }
    else if(this.selfRegistration.controls['level4'].value !=null){
      branch_id=this.selfRegistration.controls['level4'].value.branch_id
    }
    else if(this.selfRegistration.controls['level3'].value !=null){
      branch_id=this.selfRegistration.controls['level3'].value.branch_id
    }
    else if(this.selfRegistration.controls['level2'].value !=null){
      branch_id=this.selfRegistration.controls['level2'].value.branch_id
    }
    else if(this.selfRegistration.controls['level1'].value !=null){
      branch_id=this.selfRegistration.controls['level1'].value.branch_id
    }
    else{

      let that = this;
      this.hirachyList.forEach( function(val){
        if(val.heirachy_code == 0){
        that.levelZeroBranchId=val.branch_id;
        console.log("Got the level zero");
        }else{
          console.log("Not to got");
        }
      })
      branch_id = this.levelZeroBranchId;
    }

    if(branch_id == null){

      // let that = this;
      this.branchList.forEach(val =>{
        console.log(val)
        if(val.branch_level ==0){
          branch_id =val.branch_id
        }
      })


    }

    this.idTypeRef.forEach(element => {
      if(element.description == this.selfRegistration.controls['idtype'].value){
        idType = element.id;
      }
    });

    // if(this.selfRegistration.controls['idtype'].value =='National Id'){
    //   idType=4;
    // }
    // if(this.selfRegistration.controls['idtype'].value =='Employee Id'){
    //   idType=5;
    // }
    // if(this.selfRegistration.controls['idtype'].value =='Driving permit'){
    //   idType=1;
    // }
    // if(this.selfRegistration.controls['idtype'].value =='NSSF Card'){
    //   idType=12;
    // }
    // if(this.selfRegistration.controls['idtype'].value =='Student Id'){
    //   idType=13;
    // }
    // if(this.selfRegistration.controls['idtype'].value =='Passport'){
    //   idType=11;
    // }
    console.log("Branch Id");
    console.log(branch_id);
    console.log()

  
    basicInfo={
      firstName:this.selfRegistration.controls['firstName'].value,
      lastName:this.selfRegistration.controls['lastName'].value,
      middleName:this.selfRegistration.controls['middletName'].value,
      dateOfBirth:this.selfRegistration.controls['dateOfBirth'].value,
      gender:this.selfRegistration.controls['gender'].value,
      title:this.selfRegistration.controls['title'].value,
      maritalStatus:'',
      numDependents:'',
      occupation:'',
      income:'',
      residentCountry:'',
      addresstype:1,
      addressValue:'',
      region:this.selfRegistration.controls['region'].value.name,
      district:this.selfRegistration.controls['district'].value.districtName,
      county:this.selfRegistration.controls['county'].value.countyName,
      village:this.selfRegistration.controls['village'].value,
      parish:this.selfRegistration.controls['parish'].value.parishName,
      plotNumber:this.selfRegistration.controls['plotNo'].value,
      coordinates:this.selfRegistration.controls['cordinates'].value,
      subcounty:this.selfRegistration.controls['subCounty'].value.subCountyName,
      contact_type:1,
      idName:this.selfRegistration.controls['idtype'].value,
      idIssueDate:this.selfRegistration.controls['issueDate'].value,
      idExpiryDate:this.selfRegistration.controls['expDate'].value,
      idNumber:this.selfRegistration.controls['idNo'].value,
      idRegLocation:'',
      maidenName:'',
      riskClass:'',
      educLevel:'',
      originCountry:'',
      createdVia: 'MOBILE_SELF',
      customerCat:1,
      oldCustNo:this.selfRegistration.controls['oldCustNo'].value,
      contactCode:this.countryCode,     //this.selfRegistration.controls['contactCode'].value.dialingCode,
      contact:this.selfRegistration.controls['phoneNo'].value,
      emailContact:this.selfRegistration.controls['email'].value,
      kinFirstName:'',
      kinLastName: '',
      kinContact: '',
      kinEmail: '',
      kinRelationship:'',
      kinAddress:'',
      tempContactsArray:[
        {contact_type:1, contact:this.countryCode + this.selfRegistration.controls['phoneNo'].value, otherContact:'', contactValue:'Mobile Number'},
        {contact_type:2, contact:this.selfRegistration.controls['email'].value, otherContact:'', contactValue:'E-mail'}
      ]
    }
    requestData={
      institutionId: this.selfRegistration.controls['selectInstitution'].value.id,
      branchId:branch_id,
      idBackPic:{fileContent:this.idBackImg,},
      idFrontPic:{fileContent:this.idFrontImg,},
      customerTypeId:1,
      basicInfo:basicInfo,
      idType:idType,
      profilePicture:{fileContent:this.profilePicImg,},
      fingerPrint: {fileContent: '',},
      agreement: {fileContent: ''},
    } 
    userData
    auth={
      userData:userData
    }
    loggedInUser={}
    postData={
      requestData:requestData,
      auth:auth,
      loggedInUser:loggedInUser,
    }
    console.log('********************************')
    console.log(postData);
    // console.log(branch_id);
    // console.log(this.branchList);
    // console.log(this.hirachyList)
    console.log('------------------------------')

    let that = this;
    try {

      this.sendRequestToServer(
        "CustomerManagement",
        "addCustomerRequest",
        JSON.stringify(postData),
        function(response){
          that.handleSelfReg(response);
        console.log("//////////////////////////////////////")
  
        },
        function(err){
          that.commonFunction.closeLoading();
          that.commonFunction.presentAlert('Failed', 'Customer Self registration', "Registration failed please try again", 'Ok');
          // console.log(err.message);
        // console.log("erererererererereerererererer")
  
        });
      
    } catch (error) {
      console.log(error);
      alert(error.message);
      alert(typeof(error));
      
    }


  }


  handleSelfReg(response){
    this.returnDataList = response.returnData;
    this.commonFunction.closeLoading();
    console.log(response)
    if(response.returnCode !=0){
      // alert(response.returnMessage);
      alert("Failed to register member")
    }else{
      this.displayresults= 'block';
      this.displayProfile='none';
    }
  }

  // NV2550006777

  goToLogin(){
    this.navCtrl.navigateForward("/new-login")
  }



/**
 * Next buttons and previous buttons
 */
  firstPage(){
    console.log(this.selfRegistration.controls['selectInstitution'].status)
    // = this.selfRegistration.controls['selectInstitution'].status 
    if(this.selfRegistration.controls['selectInstitution'].status==='VALID'){
      // this.firstBtnStus= false;
      // if(){}
      if(this.hirachyList.length <=1){
        this.displayLevels= 'none';
        this.displayInstitution = 'none';
        this.displayBasicInfo='block';
      }else{
      this.displayInstitution = 'none';
      this.displayLevels= 'block';
      }
      
    }else if(
      this.selfRegistration.controls['selectInstitution'].status ==='INVALID'
    ){
      this.presentToast('Please select institution');
    }
 
  }
  secondPage(){
    this.displayLevels= 'none';
    this.displayBasicInfo='block';
  }
  backFirstPage(){
    this.displayInstitution = 'block';
    this.displayLevels= 'none';
  }
  thirdPage(){

    if(
      this.selfRegistration.controls['title'].status==='VALID' &&
      this.selfRegistration.controls['firstName'].status==='VALID' &&
      this.selfRegistration.controls['lastName'].status==='VALID' &&
      this.selfRegistration.controls['dateOfBirth'].status==='VALID' &&
      this.selfRegistration.controls['gender'].status==='VALID'
    ){
      // this.thirdBtnStus = false;
      this.displayContact='block'
      this.displayBasicInfo='none';
    }else if(this.selfRegistration.controls['title'].status==='INVALID'){
      this.presentToast('Please select a title');
    }else if( this.selfRegistration.controls['firstName'].status==='INVALID'){
      this.presentToast('Please fill in first name');
    }else if( this.selfRegistration.controls['lastName'].status==='INVALID'){
      this.presentToast('Please fill in last name');
    }else if(this.selfRegistration.controls['dateOfBirth'].status==='INVALID' ){
      this.presentToast('Please fill in date of birth');
    }
    else if(this.selfRegistration.controls['gender'].status==='INVALID' &&
    this.selfRegistration.controls['title'].status==='VALID' &&
    this.selfRegistration.controls['firstName'].status==='VALID' &&
    this.selfRegistration.controls['lastName'].status==='VALID' &&
    this.selfRegistration.controls['dateOfBirth'].status==='VALID' 
    ){
      this.presentToast('Please select a gender');
    }

  }
  backSecondPage(){

    if(this.hirachyList.length <=1){
      this.displayLevels= 'none';
      this.displayInstitution = 'block';
      this.displayBasicInfo='none';
    }else{
      this.displayLevels= 'block';
      this.displayBasicInfo='none';
    }

    
  }
  forthPage(){
    let contact = this.selfRegistration.controls['phoneNo'].value;
    // contact?contact.length === 10:0
    if(
      this.selfRegistration.controls['contactCode'].status==='VALID' &&
      // contact?contact.length === 9:0 &&
      this.selfRegistration.controls['email'].status==='VALID'
    ){
      this.displayAddress='block';
      this.displayContact='none'
    }
    // else if(this.selfRegistration.controls['contactCode'].status==='INVALID'){
    //   this.presentToast('Please select a country code');
    // }
    else if(this.selfRegistration.controls['phoneNo'].status==='INVALID'){
      this.presentToast('Phone number is required');
    }
    // else if(contact?contact.length != 9:0){
    //   this.presentToast('Please fill in a valid number')
    //   alert(contact);
    // }
    else if(this.selfRegistration.controls['email'].status==='INVALID'){
      this.presentToast('Email is required');
    }

  }
  backthirdPage(){
    this.displayContact='none'
    this.displayBasicInfo='block';
    // console.log(" backthirdPage()")
  }
  fifthPage(){
    if(
      this.selfRegistration.controls['region'].status==='VALID' &&
      this.selfRegistration.controls['district'].status==='VALID' &&
      this.selfRegistration.controls['county'].status==='VALID' &&
      this.selfRegistration.controls['subCounty'].status==='VALID' &&
      this.selfRegistration.controls['parish'].status==='VALID' &&
      this.selfRegistration.controls['village'].status==='VALID'
    ){
      this.displayAddress='none';
      this.displayID='block'
    }else if(
      this.selfRegistration.controls['region'].status==='INVALID'
    ){
      this.presentToast('Please select region');
    }else if(
      this.selfRegistration.controls['district'].status==='INVALID'
    ){
      this.presentToast('Please select district');
    }else if(
      this.selfRegistration.controls['county'].status==='INVALID'
    ){
      this.presentToast('Please select county');
    }else if(
      this.selfRegistration.controls['subCounty'].status==='INVALID'
    ){
      this.presentToast('Please select subCounty');
    }else if(
      this.selfRegistration.controls['parish'].status==='INVALID'
    ){
      this.presentToast('Please select parish');
    }else if(this.selfRegistration.controls['village'].status==='INVALID'){
      this.presentToast('Village is required');
    }
 

  }
  backForthPage(){
    this.displayAddress='none';
    this.displayContact='block'
    // console.log( "backForthPage()")
  }
  sixthPage(){

    if(
      this.selfRegistration.controls['idtype'].status==='VALID' &&
      this.selfRegistration.controls['idNo'].status==='VALID'  &&
      this.selfRegistration.controls['issueDate'].status==='VALID' &&
      this.selfRegistration.controls['expDate'].status==='VALID'


    ){
      this.displayID='none'
      this.displayProfile='block'
    }else if(this.selfRegistration.controls['idtype'].status==='INVALID'){
      this.presentToast('Please select ID type');
    }else if(this.selfRegistration.controls['idNo'].status==='INVALID' ){
      this.presentToast('ID number is required');
    }else if(this.selfRegistration.controls['issueDate'].status==='INVALID'){
      this.presentToast('ID issue date is required');
    }else if(this.selfRegistration.controls['expDate'].status==='INVALID'){
      this.presentToast('ID expiery date is required');
    }

  }
  backFifthPage(){
    this.displayAddress='block';
    this.displayID='none'
    // console.log( "backFifthPage()")
  }
  backSixthPage(){
    this.displayID='block'
    this.displayProfile='none'
  }


 async takePicture() {
  const image = await Camera.getPhoto({
    quality: 10,
    allowEditing: false,
    resultType: CameraResultType.Base64
  });
  this.captured_img = "data:image/jpeg;base64,"+image.base64String;
  }

  async idFrontView(){
    const image = await Camera.getPhoto({
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    this.idFrontImg = "data:image/jpeg;base64,"+image.base64String;
  }

  async idBackView(){
    const image = await Camera.getPhoto({
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    this.idBackImg = "data:image/jpeg;base64,"+image.base64String;
  }

  async profilePic(){
    const image = await Camera.getPhoto({
      quality: 10,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
    this.profilePicImg = "data:image/jpeg;base64,"+image.base64String;
  }



  showCode(event){
    console.log("**** showCode *****")
    console.log(event.target.value)
    // this.selfRegistration.controls['phoneNo'].setValue(event.target.value);
    let contact = event.target.value, phoneNumber,contactType;
    if( contact?contact.length === 9:0){
      phoneNumber=this.countryCode+contact.replace(/^0/, "");
      contactType=1;
      // alert(this.countryCode+contact.replace(/^0/, ""));
      this.getCustomerVerificationData(contactType, phoneNumber)
    }
    
  }


  /**
   * 
   * @param country 
   * @author bashMan
   */
  onCountryChange(country: any) {
    this.country =country.iso2;
    this.countryCode= country.dialCode;
    console.log(this.country+" - "+this.countryCode)
    this.selfRegistration.controls['contactCode'].setValue(this.countryCode)
  }
  hasError($event){
    console.log($event);
  }
  telInputObject(obj) {
    console.log("**** telInputObject *****")
    console.log(obj);
    obj.setCountry('ug');
  }

  getNumber($event){
    console.log("**** getNumber *****")
    console.log($event)
  }


  // loading(){
  //   this.commonFunction.presentLoading('losding..', 2000, 'md','lines-small')
  // }

  tost(){
    // console.log(this.currentDate);
    // alert(this.currentDate);
    
    // let feed = this.commonFunction.presentAlertWithOptions("Test","testing","try again","ok","cancel");
  }


  /**
   * returns customer name ,NIN number of the national ID if the phone no. is registered  
   * @param contactType 
   * @param phoneNumber
   * @author bashMan
   */
  getCustomerVerificationData(contactType, phoneNumber) {
    let controller = this, search, auth,postData;
     search = {
      sortField: "Q.created_on",
      sortOrder: "desc",
      phoneNumber: phoneNumber,
    };
    postData = {
      auth: auth,
      search: search,
    };
    this.sendRequestToServer(
      'CustomerManagement', 
      'getCustomerVerificationData', 
      JSON.stringify(postData),
      function (response: any) {
        controller.handleCustomerVerificationData(response);
      },
      function (err) {
        controller.commonFunction.presentAlert("Failed","Error",err.message, "ok");
      }
      )
  }

  /**
   * Notifies the customer with the phone number details of the customer
   * @param response 
   * @author bashMan
   */
  handleCustomerVerificationData(response){
    if(response.returnCode != 0){
      this.commonFunction.presentAlert("Failed","Connetion Error","Please Try Again", "ok");
    }else{
      this.customerContactConfirmation = response.returnData.rows[0];
      if(response.returnData.rows===undefined || response.returnData.rows.length===0){
        this.presentAlertWithOptions("Please confirm these details","Are you sure this phone number is correct?","","Agree", "Disagree");
      }else{
      this.presentAlertWithOptions("Please confirm these details",'Name: '+this.customerContactConfirmation.customer_name,'NIN: '+this.customerContactConfirmation.nin, "Agree", "Disagree");
      }
    }

  }

  /**
   * Notification with a options for feedback
   * @param header 
   * @param subHeader 
   * @param message 
   * @param agree 
   * @param disAgree 
   * @author Karanzi
   */
  async presentAlertWithOptions(header, subHeader, message,agree, disAgree){
    let that = this;
    const alert = await this.alertController.create({
      header:header,
      subHeader: subHeader,
      message:message,
      buttons:[
        {
          text: disAgree,
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
            that.oncustomerContactConfirmation = false;
            console.log(that.oncustomerContactConfirmation)
          }
        },
        {
          text: agree,
          handler: () => {
            console.log('Confirm Okay');
            that.oncustomerContactConfirmation = true;
            console.log(that.oncustomerContactConfirmation)

          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * When u change the identification type
   * @param event 
   * @author bashMan
   */
  onIdTypeChange(event){
    console.log(event.target.value);
    if(event.target.value==="National Id" && this.oncustomerContactConfirmation){
      this.selfRegistration.controls['idNo'].setValue(this.customerContactConfirmation.nin);
    }else{
      this.selfRegistration.controls['idNo'].reset();
    }
  }


  getIdTypeRefData(){
    let that=this, search, auth, postData;
    search ={};
    auth = {};
    postData = {
      search: search,
      auth: auth,
    };

    this.sendRequestToServer(
      "ReferenceDataManagement",
      "getIdentificationTypes",
      JSON.stringify(postData),
      function(response){
        that.idTypeRefResponse(response)
      },
      function (err) {
        console.log(err);
      }
    )
  }

  idTypeRefResponse(response){
    if(response.returnCode != 0){
    }else{
      this.idTypeRef = response.returnData;
      // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
      // console.log(this.idTypeRef)
    }
  }



}


