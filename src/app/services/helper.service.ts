import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {JsonConvert, JsonObject, JsonProperty} from 'json2typescript';

import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class HelperService implements OnInit {

  public user: BehaviorSubject<AppUser>;
  private httpOptions;
  licenseStatus = false;

    // private uatServerUrl = 'https://vantage.co.ug/vantage-ug/backend/VantageCore/ProcessRequest/';

  //  private uatServerUrl = 'https://vantage.co.ug/vantage-preprod/backend/VantageCore/ProcessRequest/'
  //  private uatServerUrl = 'https://uat.vantage.co.ug/vantage-test/backend/VantageCore/ProcessRequest/'
  //  private uatServerUrl = 'https://uat.vantage.co.ug:4443/vantage-test/backend/VantageCore/ProcessRequest/'
  //  https://uat.vantage.co.ug:4443/vantage-test/awash-bank/#/auth/login
     private uatServerUrl = 'http://localhost:7001/Vantage/backend/VantageCore/ProcessRequest/';
  // private serverUrl = 'https://vantage.co.ug/vantagetest/VantageInterface/';


//   - ************ What is new *****************
// - qr-scanner
// - password token verification
// - redesigned login page
// - backbuttons working
// - bug fixes

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json'
      }),
      observe: 'body'
    };

    const appUser = new AppUser();
    this.user = new BehaviorSubject<AppUser>(appUser);
  }

  sendPostToServer(uri: string, data: string): Observable<any> {
    // if (!environment.production) {
    //   this.serverUrl = this.uatServerUrl
    // }
    console.log('Will use url ' + this.uatServerUrl + uri);
    console.log('Sending to server ' + data);

    const component = this;

    return this.http.post<any>(this.uatServerUrl + uri, data, this.httpOptions);

  }

  ngOnInit() {

  }
  public getUserRequestCredentials() {
    const credentials: any = {};
    if (!this.user) {
      return credentials;
    }

    credentials.username = this.user.getValue().username;
    credentials.token = this.user.getValue().authenticationToken;
    credentials.institutionId = this.user.getValue().institution;
    credentials.userData = this.user.getValue().userData;
    return credentials;
  }

  public setLoginStatus(status) {
    this.user.getValue().setLoggedIn(status);
    if (!status) {
      // Logout should reset all values to nothing
      this.user.getValue().authenticationToken = '';
      this.user.getValue().fullname = '';
      this.user.getValue().userData = null;
      this.user.getValue().institution = '';
      this.user.getValue().branchName = '';
      // this.user.getValue().theme="#1f81c5";
      // this.user.getValue().firstTimeLogin = null;
      // this.user.getValue().systemDate = null;
      // this.user.getValue().userRole = null
      // this.user.getValue().instLogo = null;
      // this.user.getValue().processingDate = null;
      this.user.getValue().institution = null;
      this.user.getValue().username = null;
      this.user.getValue().password = '';

    } else {

      console.log(JSON.stringify(this.user.getValue()));


      // Setup the menus
      // sessionStorage.setItem("logInStatus",'true');
      // this.cookieService.set("loggedInUser",
      //   JSON.stringify({
      //     loggedIn:this.user.getValue().loggedIn,
      //     institution:this.user.getValue().institution,
      //     branchName:this.user.getValue().branchName,
      //     // userRole:this.user.getValue().userRole,
      //     // processingDate:this.user.getValue().processingDate,
      //     // systemDate:this.user.getValue().systemDate,
      //     // theme: this.user.getValue().theme,
      //     authenticationToken:this.user.getValue().authenticationToken,
      //     username:this.user.getValue().username,
      //     userData:this.user.getValue().userData,
      //     permissions:this.user.getValue().permissions}))
      // console.log(JSON.stringify(this.cookieService.get("loggedInUser")))

      // this.appComponent.setupMenus();
    }
  }




}


@JsonObject('AppUser')

export class AppUser {

  @JsonProperty('username', String, true)
  username: string = undefined;

  @JsonProperty('password', String, true)
  password: string = undefined;

  @JsonProperty('loggedIn', Boolean, true)
  loggedIn: boolean = undefined;

  @JsonProperty('fullname', String, true)
  fullname: string = undefined;

  @JsonProperty('permissions', [], true)
  permissions: any = undefined;

  @JsonProperty('authenticationToken', String, true)
  authenticationToken: any = undefined;

  @JsonProperty('mobileNumber', String, true)
  mobileNumber: string = undefined;

  @JsonProperty('userLevel', String, true)
  userLevel: string = undefined;

  @JsonProperty('userData', Object, true)
  userData: any = undefined;

  @JsonProperty('institution', String, true)
  institution: any = undefined;

  @JsonProperty('institutionId', Number, true)
  institutionId: number = undefined;

  @JsonProperty('branchName', String, true)
  branchName: any = undefined;

  setLoggedIn(status) {
    this.loggedIn = status;

    if (!status) {
      // Not logged in, clear fields
      this.username = null;
      this.fullname = null;
      this.password = '';
      this.permissions = [];
    }



  }
}

