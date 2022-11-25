import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  // public logout() {
  //   this.serverLogout();
  //   //Logout from profits
  // }

  // public serverLogout() {
  //   let controller:any = this;
  //   const auth = this.commonService.getUserRequestCredentials();
  //   let postData= {
  //     auth:auth,
  //   }
  //   this.sendRequestToServer(
  //     "UserManagement",
  //     "logOutRequest",
  //     JSON.stringify(postData),
  //     true,
  //     function (response) {
  //       controller.handleLoginResponse(response)
  //     },function () {

  //     }
  //   )
  //   this.showLoading();
  //   sessionStorage.clear();
  //   this.commonService.removeAll();
  //   this.commonService.setLoginStatus(false);
  //   this.hideLoading();

  // }
}
