import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { Router } from '@angular/router';
import { InstitutionSelfRegService } from 'src/app/services/institution-self-reg.service';

@Component({
  selector: 'app-institution-user-registration',
  templateUrl: './institution-user-registration.page.html',
  styleUrls: ['./institution-user-registration.page.scss'],
})
export class InstitutionUserRegistrationPage implements OnInit {


  institutionForm: FormGroup;
  userForm: FormGroup;
  showPassword = false;
  passwordToggleIcon = 'eye';

  validation_messages = {
    firstName: [
      {
        type: 'required',
        message: 'First name is required.'
      },
    ],
    lastName: [
      {
        type: 'required',
        message: 'Last name is required.'
      },
    ],
    emailAddress: [
      {
        type: 'pattern',
        message: 'Email must be in this format your@email.com'
      },
      {
        type: 'required',
        message: 'Email Address is required'
      }
    ],

    password: [
      {
        type: 'required',
         message: 'Password is required.'
         },
      {
        type: 'pattern',
        message: 'Password must contain at least one lowercase, one upper case one number and at least eight characters long'
      }
    ],
  };


  constructor(
    private institutionSelfReg: InstitutionSelfRegService,
    public commonFunction: CommonFunctions,
    public route: Router

    ) { }

  ngOnInit() {

    this.userForm = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        emailAddress: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('', Validators.compose([
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'),
          Validators.required
        ])),
        institutionId: new FormControl(),
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.passwordToggleIcon === 'eye') {
      this.passwordToggleIcon = 'eye-off';
    } else {
      this.passwordToggleIcon = 'eye';

    }
  }

  submit() {
    if (this.userForm.invalid) {
      
      return;
    } else {
          this.institutionSelfReg.createUser(this.userForm);
          this.route.navigate(['institution-self-registration-tab/institution-self-registration']);

    }

  }


}
