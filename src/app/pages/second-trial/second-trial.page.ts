import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-second-trial',
  templateUrl: './second-trial.page.html',
  styleUrls: ['./second-trial.page.scss'],
})
export class SecondTrialPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  onClick(){
   this.router.navigate(['/menu/second-trial/trial'])
  }
}
