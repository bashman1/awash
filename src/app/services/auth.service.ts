import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { LoaderServiceService } from './loader-service.service';
import { LoadingController } from '@ionic/angular';

export interface User {
  //name:string;
  roles:string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends LoginService {

  currentUser: User
  // BehaviorSubject<User>  = new BehaviorSubject(null);

  constructor(
    private loginService: LoginService,
    public http: HttpClient,
    public helper: HelperService,
    public loaderService: LoaderServiceService,
    public loadingController: LoadingController

    ) {
      super(http, helper, loadingController);
    }

  user_check(type: string) {

    return new Promise((resolve, reject) => {

      if (type === 'agent') {
        console.log(type)
        this.currentUser = {
          roles:type
        };
        resolve(true)
      }else if (type === 'customer') {
        console.log(type);
        this.currentUser = {
          roles:type
        };
        resolve(true)
      }else{
        console.log("There is no type")
        reject(false)
      }
    });
  }

  isLoggedIn(){
    return this.currentUser != null;
  }

  logout(){

    let controller:any = this;
    const auth = this.loginService.getUserRequestCredentials();
    let postData= {
      auth:auth,
    }
    this.sendRequestToServer(
      "UserManagement",
      "logOutRequest",
      JSON.stringify(postData),
      true,
      function (response) {
        controller.handleLoginResponse(response)
      }
    )
    this.helper.setLoginStatus(false);
    this.loginService.clear();    
  }


  isAgent(){
    return this.currentUser.roles === 'agent'
  }

  
//is it agent or customer
  // login(name){
  //   if(name ==='user'){
  //     this.currentUser.next({
  //       name:'Dummy User',
  //       roles:['read-content', 'purchase-items', 'user']
  //     });
  //   }else if(name === 'admin'){
  //     this.currentUser.next({
  //       name:'The Admin',
  //       roles:['read-content','write-content','admin']
  //     })
  //   }
  // }
  // getUserSubject(){
 
  //   return this.currentUser.asObservable();
  // }   

  // logout(){
  //   this.currentUser.next(null);
  // }

  // hasRoles(roles: string[]):boolean {
  //   for (const oneRole of roles){
  //     if(!this.currentUser.value || !this.currentUser.value.roles.includes(oneRole)){
  //       return false;
  //     }
  //   }
  //   return true;

  // }


}
