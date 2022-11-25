import { Component, OnInit, ElementRef, ViewChild, Output } from "@angular/core";
import { Chart } from "chart.js";
import { ModalController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { FormBuilder } from '@angular/forms';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';
import { Plugins } from "@capacitor/core";
import {MainPage} from '../main/main.page';
const { Storage } = Plugins;

@Component({
  selector: 'app-agent',
  templateUrl: './agent.page.html',
  styleUrls: ['./agent.page.scss'],
})
export class AgentPage extends LoginService {

  @ViewChild("barCanvas", { static: true }) barCanvas: ElementRef;
  @ViewChild("doughnutCanvas", { static: true }) doughnutCanvas: ElementRef;
  @ViewChild("lineCanvas", { static: true }) lineCanvas: ElementRef;

  active: string;
  branchId:any;
  custNo: string;
  id:any;
  name:string;
  token:string;
  institution:any;
  institutionName: string;
  @Output() customerImage:any;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;

  constructor(
    public modalController: ModalController,
    private router:Router,
    // private navParams: NavParams,
    public http: HttpClient,
    public helper: HelperService,
   // private loginService: LoginService,
    private fb: FormBuilder,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    private authService:AuthService,
    public navCtrl:NavController,
    private alertCtrl:AlertController,
    private main:MainPage,
    public loadingController: LoadingController
  ) {
    super( http,helper, loadingController);
  }

  async ngOnInit() {

    //#################### Storage Data #####################################
          const ret = await Storage.get({ key: 'userData' });
       
          const user = JSON.parse(ret.value);
          this.token=user.token;
          this.branchId = user.branchId;
          this.custNo=user.custNo;
          this.id=user.id;
          this.name= user.name;
          this.institution = user.institution;
          this.institutionName = user.institutionName;    
      //#################### Storage Data ########################################
      // this.main.getCustomersPic();
  // ################################### GRAPHS #########################################
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange","Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3,12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
  
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: "doughnut",
        data: {
          labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
          datasets: [
            {
              label: "# of Votes",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
              ]
            }
          ]
        }
      });
  
      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: "line",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          datasets: [
            {
              label: "My First dataset",
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgba(75,192,192,1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(75,192,192,1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [65, 59, 80, 81, 56, 55, 40, 90, 20.4, 18,79,80],
              spanGaps: true
            }
          ]
        }
      });
    }

}
