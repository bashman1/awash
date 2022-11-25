import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AppUser, HelperService} from './helper.service';
import {LoaderServiceService} from './loader-service.service';
// import { Platform, ToastController, IonRouterOutlet } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { finalize, tap } from 'rxjs/operators';


const { Storage, } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnInit{

  
  httpOptions=null;
  
  active: string;
  branchId:any;
  custNo: string;
  id:any;
  name:string;
  token:string;
  institution:any;
  institutionName: any;
  network:any;
  loading = false;
  public user:AppUser;
  // public loaderService:LoaderServiceService  = new LoaderServiceService(toastController: ToastController);
  public commonFunction: CommonFunctions;


  constructor(
    public http: HttpClient,
    public helper: HelperService,
    public loadingController: LoadingController
   
  
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json'
      }),
      observe: "body"
    };
   }

   

   ngOnInit(){
      this.helper.user.subscribe((val: AppUser) => {
        this.user = val;
      });




  }

 async getUserRequestCredentials(){


    const ret = await Storage.get({ key: 'userData' });
    const user = JSON.parse(ret.value);
    this.token=user.token;
    this.branchId = user.branchId;
    this.custNo=user.custNo;
    this.id=user.id;
    this.name= user.name;
    this.institution = user.institution;
    this.institutionName = user.institutionName;

    JSON.stringify({
      token: this.token,
      username: this.custNo,
      type:"mobile",
      name:this.name,
      institution:this.institution,
      institutionName:this.institutionName
    })

  }

  async presentLoading(duration) {
    // Prepare a loading controller
    this.loading = true;
    return await this.loadingController.create({
        message: 'Loading...',
         duration
    }).then( obj => {
      obj.present().then(() => {
        console.log('Presented');
        if (!this.loading) {
          obj.dismiss().then(() => console.log('Abort Presenting'));
        }
      });
    });
}
formatAmount(amount: string) {
  return (Number(amount)).toLocaleString('en');
}
  /*
  * Format Currency On Key Press Using the Field ID
  * */
  formatCurrency(id: string) { //
    document.getElementById(id).addEventListener('input', event => {
  // @ts-ignore
  event.target.value = (parseInt(event.target.value.replace(/[^\d]+/gi, '')) || 0).toLocaleString('en-US');
    }
    
    );
  }

  removeCommas(regXpPattern: any, amount: any) {
  if (regXpPattern.test(amount) === true) {
      return amount.replace(/,/g, '');
  }
  return amount;
}

async dismiss() {
  this.loading = false;
  await this.loadingController.dismiss().then(() => console.log('dismissed'));
}

  protected sendRequestToServer(serviceCode: string, request: string, postData: string, responseHandler: any, errorHandler: any) {
    let duration;
    if (request === 'addInstitution') {
      duration = 26000;
    }
    else {
      duration = 2000;
    }
    
    this.presentLoading(duration);
    let requestOperation: Observable<any> = this.helper.sendPostToServer(serviceCode+"/"+request, postData);

    var controller = this;
    requestOperation
    .pipe(
      // tap({
      //   next: (x) => {
      //     console.log('tap success', x);
      //     this.dismiss();
      //   },
      //   error: (err) => {
      //     console.log('error', err);
      //     this.dismiss();
      //   },
      //   complete: () => console.log('tap complete')
      // })
      finalize( async () => {
        await this.dismiss();
      })
    )
    .subscribe(
      response => {
     
         if (responseHandler) responseHandler(response)
      },
      err => {
        controller.dismiss();
        if (!errorHandler) {
        console.log(err)
        }
        else {
          controller.dismiss();
          errorHandler(err)
        }

      })
  }

  hidepresentLoading() {
    // this.loaderService.display(false);
  }

  // showLoading() {
  //   this.loaderService.display(true);
  // }

  // hideLoading() {
  //   this.loaderService.display(false);
  // }

  async clear() {
    await Storage.clear();
  }
  

}
