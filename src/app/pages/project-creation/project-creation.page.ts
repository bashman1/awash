import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ReportsService } from 'src/app/services/reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-creation',
  templateUrl: './project-creation.page.html',
  styleUrls: ['./project-creation.page.scss'],
})
export class ProjectCreationPage implements OnInit {

  projectForm:FormGroup;
  constructor(
    private fb:FormBuilder,
    private report:ReportsService,
    private router:Router
    ) { }

  ngOnInit() {
    this.projectForm = this.fb.group({
      projectName:new FormControl(),
      category:new FormControl(),
      projectDescription:new FormControl()
    })

    this.projectForm.controls['category'].setValue("retail")
  }

  submit(){

    this.report.projectDetails(this.projectForm.value)
    this.router.navigate(['/menu/customer-details'])

  }

}
