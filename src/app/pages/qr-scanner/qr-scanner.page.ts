import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, Platform, LoadingController, AlertController, IonRouterOutlet, NavController } from '@ionic/angular';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { HelperService } from 'src/app/services/helper.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { LoginService } from 'src/app/services/login.service';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
// import jsQR from 'jsqr';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthService } from 'src/app/services/auth.service';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage extends LoginService{
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  resultsList:any = [];
  showData:any=false;
  clientName:any;

  constructor(
    public modalController: ModalController,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    private fb: FormBuilder,
    public platform: Platform,
    public loadingController: LoadingController,
    private barcodeScanner: BarcodeScanner,
    private authService:AuthService,
    public navCtrl:NavController,
    private alertCtrl:AlertController,


  ) {
    super(http, helper, loadingController);

    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/qr-scanner') {
        navigator['app'].exitApp();
      } else {
       
      }
    });

   } 

  ngOnInit() {
    super.ngOnInit();
    this.scan();
  }


  scan(){
    let that = this;
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      // alert(JSON.stringify(barcodeData.text));
      that.getCustomerPayments(barcodeData.text);
     }).catch(err => {
         console.log('Error', err);
        //  alert('Error '+JSON.stringify(err));
     });


  }

  getCustomerPayments(cust_no){
    let search, postData; 
    if(cust_no == ''){
      this.commonFunction.presentToast("Scanning did not complete", 500, '');
      return
    }
    search ={
      custNo:cust_no,
    }

    postData ={
      search:search
    }
    let that = this;
    this.sendRequestToServer(
      "MerchantManagement",
      "getCustomerSubscriptions",
      JSON.stringify(postData),
      function(response) {
        that.customerPaymentResponse(response);
      },
      function(err){
        that.commonFunction.presentToast(err.message, 5000, 'warning');
      }
    )
  }

  customerPaymentResponse(response){
    if(response.returnCode != 0){
      this.commonFunction.presentToast(response.returnMessage, 5000, 'warning');
    }else{
      this.resultsList = response.returnData.rows;

      if (this.resultsList === undefined || this.resultsList.length == 0) {
        // array empty or does not exist
        this.showData=false;
    }else{
      this.showData=true;
      this.clientName = this.resultsList[0].name;
    }
    }
  }

 

}
