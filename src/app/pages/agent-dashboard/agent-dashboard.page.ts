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
import { MainPage } from '../main/main.page';
import { MessagesService } from 'src/app/services/messages.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.page.html',
  styleUrls: ['./agent-dashboard.page.scss'],
})
export class AgentDashboardPage extends LoginService {

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
  appraisalData:any[]=[];
  data:any[]=[];
  appraisalList=[];
  @Output() customerImage:any;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;

  constructor(
    public modalController: ModalController,
    private router:Router,
    public http: HttpClient,
    public helper: HelperService,
    private fb: FormBuilder,
    public loaderService: LoaderServiceService,
    public commonFunction: CommonFunctions,
    private authService:AuthService,
    public navCtrl:NavController,
    private alertCtrl:AlertController,
    private main:MainPage,
    private message:MessagesService,
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
    //this.main.getCustomersPic();
// ################################### GRAPHS #########################################
    //     this.barChart = new Chart(this.barCanvas.nativeElement, {
    //   type: "bar",
    //   data: {
    //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange","Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    //     datasets: [
    //       {
    //         label: "# of Votes",
    //         data: [12, 19, 3, 5, 2, 3,12, 19, 3, 5, 2, 3],
    //         backgroundColor: [
    //           "rgba(54, 162, 235, 0.2)",
    //           "rgba(255, 99, 132, 0.2)",
              
    //           "rgba(255, 206, 86, 0.2)",
    //           "rgba(75, 192, 192, 0.2)",
    //           "rgba(153, 102, 255, 0.2)",
    //           "rgba(255, 159, 64, 0.2)",
    //           "rgba(255, 99, 132, 0.2)",
    //           "rgba(54, 162, 235, 0.2)",
    //           "rgba(255, 206, 86, 0.2)",
    //           "rgba(75, 192, 192, 0.2)",
    //           "rgba(153, 102, 255, 0.2)",
    //           "rgba(255, 159, 64, 0.2)",
    //         ],
    //         borderColor: [
    //           "rgba(255,99,132,1)",
    //           "rgba(54, 162, 235, 1)",
    //           "rgba(255, 206, 86, 1)",
    //           "rgba(75, 192, 192, 1)",
    //           "rgba(153, 102, 255, 1)",
    //           "rgba(255, 159, 64, 1)"
    //         ],
    //         borderWidth: 1
    //       }
    //     ]
    //   },
    //   options: {
    //     scales: {
    //       yAxes: [
    //         {
    //           ticks: {
    //             beginAtZero: true
    //           }
    //         }
    //       ]
    //     }
    //   }
    // });


    this.getPieStats();
    this.getLineStats();
  }

  getLineStats(){
    var controller = this;
    let auth = this.helper.getUserRequestCredentials();

    let postData = {
      auth: auth,
      search: {}
    };

    this.sendRequestToServer(
      "MobileAppManagement",
      "appraisalLineGraph",
      JSON.stringify(postData),
      function(response) {
        if(response.returnCode === 0){
          controller.commonFunction.showElement('monthly_appraisal');
          controller.appraisalData = response.returnData.rows;
          controller.data = [0,0,0,0,0,0,0,0,0,0,0,0];
      
        let tempArray = [];
        controller.appraisalData.forEach(element=>{
          let x =element.created_on;
        
          controller.appraisalList.push(x);
         
        });
        controller.appraisalList = controller.appraisalList.reverse();

        for(var i in controller.appraisalList){
          tempArray.push(controller.appraisalList[i]);
        }
        controller.lineChartGraph(tempArray)
        }else{
          // controller.message.logMessage("Error",response.returnMessage);
        }
       
   
      },
      function(err) {
        controller.message.logMessage("Error",err);
      }
    );

  }

  lineChartGraph(tempArray){
    
    var today = new Date();
    var aMonth = today.getMonth();
    let monthsLebel= ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let months=[],i;
    //let data =this.data;


    for(i=0; i<12; i++){
      months.push(monthsLebel[aMonth]);
      aMonth--;
      if (aMonth < 0) {
        aMonth = 11;
      }
    }

    let xAxis = months.reverse();
  
    tempArray.forEach(element=>{
      let month = new Date(element).toLocaleString('default', { month: 'short' });
     
       let index = xAxis.findIndex(element=>element===month);
       this.data[index]+=1;
       
   })


    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: xAxis,
        datasets: [
          {
            label: "Appraisal Frequency",
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
            data: this.data,
            spanGaps: true
          }
        ]
      }
    });
  }

  getPieStats(){
    var controller = this;
    let auth = this.helper.getUserRequestCredentials();

    let postData={
      auth:auth,
      search:{}
    }

    this.sendRequestToServer(
      "MobileAppManagement",
      "getappraisalStats",
      JSON.stringify(postData),
       function(response) {
        if (response.returnCode === 0) {
          // $('#appraisal_pie').show();
          controller.commonFunction.showElement('appraisal_pie');

          controller.doughnutChart = new Chart(controller.doughnutCanvas.nativeElement, {
            type: "doughnut",
            data: {
              labels: ["Rejected", "Success"],
              datasets: [
                {
                  label: "# of Votes",
                  data: [response.returnData.above, response.returnData.below],
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

      

        } else {
        }
      },
      function(err) {
        controller.message.logMessage("Error",err);

      }
    );
  }

}
