import { Component, Input, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { formatCurrency } from '@angular/common';


@Component({
  selector: 'app-modal-popover',
  templateUrl: './modal-popover.page.html',
  styleUrls: ['./modal-popover.page.scss'],
})
export class ModalPopoverPage implements OnInit {

  // Data passed in by componentProps
  @Input() loanAccountNumber: number;
  @Input() custNo: string;
  @Input() savingAccounts: any;
  amount:number =null;
  savingAccount:any
  paymentForm:FormGroup;
  date: Date;

  constructor(private modalController: ModalController,public toastController: ToastController, public login:LoginService) { }

  ngOnInit() {
    this.date = new Date();
    this.paymentForm = new FormGroup({
      loanAcctNo: new FormControl(this.loanAccountNumber, Validators.required),
      custNo: new FormControl(this.custNo, Validators.required),
      amountToRepay: new FormControl('',Validators.required),
      // sourceAccount: new FormControl('',Validators.required),
      description: new FormControl(),
      accountType: new FormControl('LN'),
      rpmtDate: new FormControl(this.date),
  });
}
checkAmount(){  
  if(this.paymentForm.controls['amountToRepay'].value) {
    let amount_entered = this.paymentForm.controls['amountToRepay'].value ? parseInt(this.login.removeCommas(/(,)/, this.paymentForm.controls.amountToRepay.value)) : 0;
    // let acctNo = this.paymentForm.controls['sourceAccount'].value ? this.paymentForm.controls['sourceAccount'].value : 0;
    // let acctDetails = this.savingAccounts.find(val =>val.acct_no == acctNo);

    // if(acctDetails.balance < amount_entered) {
    //   //you have inadequate funds
    //   this.presentToast("You have inadequate funds on this account,please recharge and try again.","warning")
    // }
  // } else {
  //   console.log("one of em is empty");
  //   return;
  }
   
}
async presentToast(message, color) {
  const toast = await this.toastController.create({
    message,
    color,
    position: 'top',
    duration: 2000
  });
  toast.present();
}
  submit(){
    this.modalController.dismiss(this.paymentForm);
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
