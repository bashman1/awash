import { InstitutionSelfRegistrationService } from 'src/app/services/institution-self-registration.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-institution-reg',
  templateUrl: './institution-reg.page.html',
  styleUrls: ['./institution-reg.page.scss'],
})
export class InstitutionRegPage implements OnInit {

  status = false;
  constructor(
    public commonFunction: CommonFunctions,
    public router: Router,
    public selfRgeService: InstitutionSelfRegistrationService
    ) { }

  ngOnInit() {
    this.router.navigateByUrl('institution-reg/institution-self-registration');
  }

  selected(value) {
    console.log(value);
    this.status = this.selfRgeService.status;
    if (value === 'institution' && this.status === false) {
      this.commonFunction.feedback('Please Complete the user form', 5000, 'warning');
      return;
    } else {
      this.router.navigateByUrl('institution-reg/institution-registration');
      console.log(this.status);
    }

  }

}
