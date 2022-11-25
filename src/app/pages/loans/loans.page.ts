import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController, IonRouterOutlet, Platform, LoadingController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  styleUrls: ['./loans.page.scss'],
})
export class LoansPage extends LoginService {
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  constructor(
    public navCtrl:NavController,
    public platform: Platform,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public http: HttpClient,
    public helper: HelperService,
    private authService: AuthService,
    // public navCtrl: NavController,
    public loaderService:LoaderServiceService,
    public loadingController: LoadingController
    // public platform: Platform,
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

  ngOnInit() {
  }

  loanApraisal(){
    this.navCtrl.navigateForward('/menu/what-if-analysis')
  }

  currentLoans(){
    this.navCtrl.navigateForward('/menu/current-loans');
  }
  settledLoans(){
    this.navCtrl.navigateForward('/menu/settled-loans');

  }
  loanApplication(){
    this.navCtrl.navigateForward('/menu/loan-form');

  }

}
