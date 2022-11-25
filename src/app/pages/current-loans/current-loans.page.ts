import { Component, Inject, ViewChild } from '@angular/core';
import { NavParams, NavController, AlertController, IonRouterOutlet, Platform, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { Plugins } from '@capacitor/core';
import {ModalPopoverPage} from '../modal-popover/modal-popover.page';


const { Storage } = Plugins;

@Component({
  selector: 'app-current-loans',
  templateUrl: './current-loans.page.html',
  styleUrls: ['./current-loans.page.scss'],
})
export class CurrentLoansPage extends LoginService {
  active: string;
  branchId:any;
  custNo: string;
  id:any;
  name:string;
  token:string;
  institution:any;
  loansList:any[];
  emptyMessage:any;
  emptycheck = true;
  accounts:any[] = [];
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    public navCtrl:NavController,
    public platform: Platform,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) {
    super(http, helper, loadingController);
    
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      }  else {
        this.router.navigate(['/menu/home-tabs/tabs/home']);
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
      }
    });
   }

  async ngOnInit() {


    const ret = await Storage.get({ key: 'userData' });
    const user = JSON.parse(ret.value);
    this.token=user.token;
    this.branchId = user.branchId;
    this.custNo=user.custNo;
    this.id=user.id;
    this.name= user.name;
    this.institution = user.institution
    
    let auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };

    let search={
      custNo: this.custNo,
      branchId: this.branchId,
      institution: this.institution,
      loanStatus: "Active",
      searchWord:"postAwashRepayment"

    }

    let postData = {
      auth: auth,
      search: search
    };

    var controller = this;
    this.sendRequestToServer(
      "LoansManagement",
      "getLoanData",
      JSON.stringify(postData),
      function(response) {
        controller.handleResponse(response);
      },
      function(err) {
      }
    );

  }

  handleResponse(response){
    this.emptycheck=true;
    let respData = response.returnData;
      this.loansList = response.returnData.rows;

      if(this.loansList.length==0){
        this.emptyMessage = 'No loans found'
        this.emptycheck = false;
      }


  }

  loanDetails(loansList){
    this.navCtrl.navigateForward('/menu/loan-detail/'+loansList.acct_no);
    
  }

  getAccounts(){
    let auth,search,postData;
    auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };
     search={
      sortField: 'acct_no',
      sortOrder: 'desc',
      custNumber: this.custNo

    }
    postData = {
      auth: auth,
      search: search,
      requestData: this.custNo
    }
    var that = this;
    this.sendRequestToServer(
      "AccountsManagement",
      "getCustomerSavingsAcct",
      JSON.stringify(postData),
      function(response) {
        if(response.returnCode == 0) {
          that.accounts = response.returnData
          // that.loanPayment(loanDetails);

        }
      },
      function(err) {
      }
      );
  }
  savingAccounts(loanDetails){
    let auth, search, postData;
    auth ={
      token: this.token,
      username: this.custNo,
      type: "mobile"
    };
    search={
      sortField: 'Q.acct_id',
      sortOrder: 'desc',
      custNo: this.custNo
    };
    postData = {
      auth: auth,
      search: search
    };

    let that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "acctBalance",
      JSON.stringify(postData),
      function(response){
        if(response.returnCode === 0) {
          that.accounts = response.returnData.rows;
          that.accounts.forEach(obj => {
            obj.displayName = that.commonFunction.toUpper(obj.product_name)
          })
          that.loanPayment(loanDetails);
        }
      },
      function(err){
      });
  }
  
async loanPayment(loan) {
  if(this.accounts.length > 0) {
    const modal = await this.modalController.create({
      component: ModalPopoverPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'loanAccountNumber': loan.acct_no,
        'custNo': loan.cust_no,
        'savingAccounts':this.accounts
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        const payment = data['data']; 
        if(payment.value) {
          let form = payment.value;
          form.accountToRepay = parseFloat(this.removeCommas(/(,)/,form.accountToRepay));
          form.branchCd = this.branchId;
          this.loanRepayment(form);
        }
        
    });

    return await modal.present();
  }
  
}
loanRepayment(form) {
  let auth,postData;
  auth = {
    token: this.token,
    username: form.custNo,
    type:"mobile"
  };
  let search={
    custNo: this.custNo,
    branchId: this.branchId,
    institution: this.institution,
    loanStatus: "Active",
    searchWord:"postAwashRepayment"

  }
   
  postData = {
    auth: auth,
    search: search,
    requestData: form
  }
  var that = this;
  this.sendRequestToServer(
    "CustomerManagement",
    "getCustomerRegData",
    JSON.stringify(postData),
    function(response) {
      console.log(response, '---response')
      if(response.returnCode == 0) {
        setTimeout(() => {
            that.presentToast(response.returnMessage, "success")
        })

      } else {
        setTimeout(() => {
          that.presentToast(response.returnMessage, "danger")
      })
      }
    },
    function(err) {
    }
    );
}
async presentToast(message, color) {
  const toast = await this.toastController.create({
    message,
    color,
    position: 'top',
    duration: 2000
  });
  toast.present();
}
  

}