import { Component, OnInit } from "@angular/core";
import { LoginService } from "src/app/services/login.service";
import {
  ModalController,
  NavParams,
  NavController,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "src/app/services/helper.service";
import { FormGroup, FormControl, FormBuilder,Validators, AbstractControl} from '@angular/forms';

import { LoaderServiceService } from "src/app/services/loader-service.service";
import { CommonFunctions } from "src/app/services/CommonFunctions";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.page.html",
  styleUrls: ["./reset-password.page.scss"]
})
export class ResetPasswordPage extends LoginService {

  PasswordResetFormGroup: FormGroup;
  constructor(
    public modalController: ModalController,
    private router: Router,
    // private navParams: NavParams,
    public http: HttpClient,
    public helper: HelperService,
    private fb: FormBuilder,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    private authService: AuthService,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {
    super(http, helper, loadingController);
  }

  ngOnInit() {
    super.ngOnInit();
    this.commonFunction.closePopUp("password");
    this.commonFunction.closePopUp("code");
    this.commonFunction.showElement("number");
  }

  cust() {
    this.commonFunction.closePopUp("password");
    this.commonFunction.closePopUp("number");
    this.commonFunction.showElement("code");
  }

  code() {
    this.commonFunction.closePopUp("code");
    this.commonFunction.closePopUp("number");
    this.commonFunction.showElement("password");
    // this.commonFunction.closePopUp("password");
    // this.commonFunction.closePopUp("code");
    // this.commonFunction.showElement("number");
  }
  password() {
    this.commonFunction.closePopUp("password");
    this.commonFunction.closePopUp("code");
    this.commonFunction.showElement("number");
  }
}
