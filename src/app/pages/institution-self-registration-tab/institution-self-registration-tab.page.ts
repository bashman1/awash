import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { InstitutionSelfRegService } from 'src/app/services/institution-self-reg.service';

@Component({
  selector: 'app-institution-self-registration-tab',
  templateUrl: './institution-self-registration-tab.page.html',
  styleUrls: ['./institution-self-registration-tab.page.scss'],
})
export class InstitutionSelfRegistrationTabPage implements OnInit {

  status = false;
  constructor(
    private router: Router,
    private loader: LoaderServiceService,
    public selfRgeService: InstitutionSelfRegService

  ) { }

  ngOnInit() {
    // $('#customerDetails').hide();
  
    this.router.navigateByUrl('/institution-self-registration-tab/institution-user-registration');

  }

  selected(value) {
    console.log(value);
    this.status = this.selfRgeService.status;
    if (value === 'institution' && this.status === false) {
      this.loader.presentToast('warning', 'Please Complete the user form');
      return;
    } else {
      this.router.navigateByUrl('/institution-self-registration-tab/institution-self-registration');
      console.log(this.status);
    }

  }

}
