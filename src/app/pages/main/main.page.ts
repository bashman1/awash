import { Component, Pipe, PipeTransform, ElementRef, ViewChild, Output } from "@angular/core";
import { Chart } from "chart.js";
import { ModalController, NavController, AlertController, IonRouterOutlet, Platform, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HelperService } from 'src/app/services/helper.service';
import { FormBuilder } from '@angular/forms';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { CommonFunctions } from 'src/app/services/CommonFunctions';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';
import { Plugins } from "@capacitor/core";


const { Storage } = Plugins;

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"]
})
export class MainPage extends LoginService {
  @ViewChild("barCanvas", { static: true }) barCanvas: ElementRef;
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
  TransactionSavingsList:any;
  data=[];
  savingList=[];
  @ViewChild(IonRouterOutlet,  {static: false}) routerOutlet: IonRouterOutlet;
  arryData=[0,0];
  totalloan:any;
  totalSaving:any;
  acctBalanceList:any[]=[];
  totalBalance:number = 0;
  lastTransation:any[]=[];
  loansStatics:any ={};
  SharesStatistics:any={}
  transactionLists:any = [];
  productType:String;
  institutionType: number;
  loanList: Record<string,any>[] = [];
  transactionLabel:String;
  currency: String;


  option = {
    slidesPerView: 1.6,
    spaceBetween: 0,
    centeredSlides: true,
  };

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
    public platform: Platform,
    public loadingController: LoadingController
  ) {
    super( http,helper, loadingController);
    this.platform.backButton.subscribeWithPriority(0, () => {

      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else {
        navigator['app'].exitApp();
        // this.generic.showAlert("Exit", "Do you want to exit the app?", this.onYesHandler, this.onNoHandler, "backPress");
        // GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO jerry;
      }
    });
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
        this.institutionType = user.institutionTypeId;
    //#################### Storage Data ########################################
    // this.getCustomersPic();

    this.lastTransaction();
    this.getCurrentLoans();
    this.transactionLabel = 'Loan Repayments';
    // if(this.institutionType === 2){
    //   this.getCurrentLoans();
    //   this.transactionLabel = 'Loan Repayments';

    // }else {
    //   this.getTotalSavings();
    //   this.transactionLabel = 'Transactions';
    // }
    this.getTotalLoans();
    // this. doughnutsChart();


    // this.linesChaert();
    // this. barsChart();
    this.getTransactionsGraphData();
    this.accountBalance();

    this.getCustomerCumulativeLoans();
    
  }

  getTransactionsGraphData(){
    let auth,search,postData;
    auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };
     search={
      sortField: 'create_dt',
      sortOrder: 'desc'
    }
    postData = {
      auth: auth,
      search: search
    }
    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "savingsGraph",
      JSON.stringify(postData),
      function(response) {
        that.handleTransactionsGraphData(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );

  }

  handleTransactionsGraphData(response){
    this.TransactionSavingsList = response.returnData.rows;
    this.data=[0,0,0,0,0,0,0,0,0,0,0,0]
    let tempArray = [];
    this.TransactionSavingsList.forEach(element => {
     let x= element.tran_amt;
      this.savingList.push(x);
    });
    this.savingList = this.savingList.reverse();
    for(var i in this.savingList){
        tempArray.push(this.savingList[i])
    }

    for(var i in tempArray){
      this.data.push(tempArray[i]);
    }
    this.data = this.data.slice(tempArray.length);
    this.linesChaert();
  }

  getTotalLoans(){
    let auth,search,postData;
    auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };
     search={
      sortField: 'Q.id',
      sortOrder: 'desc',
      custNo: this.custNo
    }
    postData = {
      auth: auth,
      search: search
    }
    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "countTotalLoans",
      JSON.stringify(postData),
      function(response) {
        that.handleTotalLoans(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );
  }

  getTotalSavings(){
    let auth,search,postData;
    auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };
     search={
      sortField: 'Q.acct_id',
      sortOrder: 'desc',
      custNumber: this.custNo

    }
    postData = {
      auth: auth,
      search: search
    }
    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "countTotalSaving",
      JSON.stringify(postData),
      function(response) {
        that.handleTotalSavings(response);
      },
      function(err) {
        console.log(err.message); //Error handler
      }
    );
  }
  handleTotalLoans(response){
    if(response.returnData && response.returnData.totalRecords > 0) {
      this.totalloan = response.returnData.rows[0].loans;
    } else {
      this.totalloan =[];
    }
   
    this.arryData[0]=this.totalloan;
    // this.arryData.push(this.totalloan);

  }
  getCurrentLoans(){
    let auth = {
      token: this.token,
      username: this.custNo,
      type:"mobile"
    };

    let search={
      custNo: this.custNo,
      branchId: this.branchId,
      institution: this.institution,
      loanStatus: "Active"

    }

    let postData = {
      auth: auth,
      search: search
    };

    let controller = this;
    this.sendRequestToServer(
      "LoansManagement",
      "getLoanData",
      JSON.stringify(postData),
      function(response) {
        if(response.returnData && response.returnData.totalRecords > 0) {
          controller.loanList = response.returnData.rows;
          console.log(controller.loanList, '---loanlist---');
        }
        controller.transactionHistory();

        
      },
      function(err) {
      }
    );
  }
  handleTotalSavings(response){
    if(response.returnData && response.returnData.totalRecords > 0) {
      this.totalSaving = response.returnData.rows[0].saving;
    } else {
      this.totalSaving = [];
    }
   
    
    this.arryData[1]=this.totalSaving;
    // this.arryData.push(this.totalSaving);

  }



  linesChaert(){
    let that = this;
    var today = new Date();
    var aMonth = today.getMonth();
    let monthsLebel= ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    let months=[],i;
    let data =this.data //[0,0,0,0,0,0,0,0,0,0,0,0]
    for(i=0; i<12; i++){
      months.push(monthsLebel[aMonth]);
      aMonth--;
      if (aMonth < 0) {
        aMonth = 11;
      }
    }

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: months.reverse(),
        
        datasets: [
          {
            label: "Transactions",
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
            data: data,
            // data: [65, 59, 80, 81, 56, 55, 40, 90, 20.4, 18,79,80],
            spanGaps: true
          }
        ]
      }
    });
  }


  // barsChart(){

  //   this.barChart = new Chart(this.barCanvas.nativeElement, {
  //     type: "bar",
  //     data: {
  //       labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange","Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //       datasets: [
  //         {
  //           label: "# of Votes",
  //           data: [12, 19, 3, 5, 2, 3,12, 19, 3, 5, 2, 3],
  //           backgroundColor: [
              
  //             "rgba(255, 99, 132, 0.2)",
  //             "rgba(54, 162, 235, 0.2)",
  //             "rgba(255, 206, 86, 0.2)",
  //             "rgba(75, 192, 192, 0.2)",
  //             "rgba(153, 102, 255, 0.2)",
  //             "rgba(255, 159, 64, 0.2)",
  //             "rgba(255, 99, 132, 0.2)",
  //             "rgba(54, 162, 235, 0.2)",
  //             "rgba(255, 206, 86, 0.2)",
  //             "rgba(75, 192, 192, 0.2)",
  //             "rgba(153, 102, 255, 0.2)",
  //             "rgba(255, 159, 64, 0.2)",
  //           ],
  //           borderColor: [
  //             "rgba(255,99,132,1)",
  //             "rgba(54, 162, 235, 1)",
  //             "rgba(255, 206, 86, 1)",
  //             "rgba(75, 192, 192, 1)",
  //             "rgba(153, 102, 255, 1)",
  //             "rgba(255, 159, 64, 1)"
  //           ],
  //           borderWidth: 1
  //         }
  //       ]
  //     },
  //     options: {
  //       scales: {
  //         yAxes: [
  //           {
  //             ticks: {
  //               beginAtZero: true
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   });


  // }

  lastTransaction(){
    let auth, search, postData;
    auth ={
      token: this.token,
      username: this.custNo,
      type: "mobile"
    };
    search={
      sortField: 'id',
      sortOrder: 'desc',
      custNo: this.custNo
    };
    postData = {
      auth: auth,
      search: search
    };

    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "lastTransaction",
      JSON.stringify(postData),
      function(response){
        that.handleLastTrans(response);
      },
      function(err){
        console.log(err.message);
      });    
  }

  handleLastTrans(response){
    this.lastTransation = response.returnData.rows;
    if(response.returnCode != 0){
    }
  }

  accountBalance(){
    let auth, search, postData;
    auth ={
      token: this.token,
      username: this.custNo,
      type: "mobile"
    };
    search={
      sortField: 'Q.acct_id',
      sortOrder: 'desc',
      custNo: this.custNo
    };
    postData = {
      auth: auth,
      search: search
    };

    var that = this;
    this.sendRequestToServer(
      "MobileAppManagement",
      "acctBalance",
      JSON.stringify(postData),
      function(response){
        that.handleAccountBalance(response);
      },
      function(err){
        console.log(err.message);
      });
  }

  handleAccountBalance(response){
    this.acctBalanceList = response.returnData.rows;
    this.currency = this.acctBalanceList[0].crncy_cd
    console.log(this.acctBalanceList, '---avv')
    this.acctBalanceList.forEach(obj => {
      obj.displayName = this.toUpper(obj.product_name);
      this.totalBalance += parseFloat(obj.balance);
    })

  }

   toUpper(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(function(word) {
          if(word[0]){
            return word[0].toUpperCase() + word.substr(1);
          }
            
        })
        .join(' ');
     }
     
 
     transactionHistory() {
      let postData, search, auth;
      search={
        startDate: '2022-02-10',
        endDate: '2022-05-12',
        custNo: this.custNo,
        searchWord: 'getAwashLoanRepayments',
        loanAcctNo: this.loanList[0].acct_no,
      }
      auth = {
        token: this.token,
        username: this.custNo,
        type: "mobile"
      };
      postData = {
        auth: auth,
        search: search
      };
  
      var controller = this;
      this.sendRequestToServer(
        "CustomerManagement",
        "getCustomerRegData",
        JSON.stringify(postData),
        function(response) {
          console.log(response, '---ma response---');
          // controller.transactionLists = response.returnData.rows;
          // controller.transactionLists = controller.transactionLists.splice(0, 3);
        },
        function(err) {
          console.log("my error in transaction")
          console.log(err.message); //Error handler
        }
      );
  
     }

  transHistory(){
    this.router.navigate(["/menu/payments"]);
  }

  goToShares(){
    this.router.navigate(['/menu/shares']);
  }

  goToLoans(){
    this.router.navigate(['/menu/loans']);
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

     /**
   * @author BashMan
   */
  getCustomerCumulativeLoans(){
    let auth, search, postData,that= this;
    auth={
      token:this.token,
      username: this.custNo,
      type: "mobile"
    }

    search={
      custNo: this.custNo,
      branchId: this.branchId,
      institution: this.institution,
      loanStatus: "Active"
    }
    postData = {
      auth: auth,
      search: search
    };

    this.sendRequestToServer(
      "LoansManagement",
      "getLoanData",
      JSON.stringify(postData),
      function(response){
        that.cumulativeCustomerLoanResponse(response);
      },
      function(err){
        console.log(err)
      }
    )

  }

  /**
   * 
   * @param response 
   * @author BashMan
   */
  cumulativeCustomerLoanResponse(response){
    let principal= 0;
    response.returnData.rows.forEach(element => {
      principal = principal + element.principal_amount
    });

    this.loansStatics = {principle:principal }
  }


  /**
   * @author BashMan
   */
  getCustomerCumulativeShares(){
    let auth, search, postData,that= this;
    auth = {
      token: this.token,
      username: this.custNo,
      type : "mobile"
    }

    search ={
      custNo:this.custNo,
      status: 'Active'
    }

    postData={
      auth:auth,
      search:search
    }

    this.sendRequestToServer(
      "MobileAppManagement",
      "customerShares",
      JSON.stringify(postData),
      function(response){
        that.cumulativeCustomerSharesResponse(response);
      },
      function(err){
        console.log(err)
      }
    )
  }

  /**
   * 
   * @param response 
   * @author BashMan
   */
  cumulativeCustomerSharesResponse(response){
    let subTotal= 0, no_shares= 0, that=this;
    response.returnData.rows.forEach(element => {
      subTotal = subTotal + (element.price_per_share * element.no_of_shares);
      no_shares= no_shares+ element.no_of_shares;
    });

    this.SharesStatistics= {total: subTotal, shares:no_shares };
    
  }


}
