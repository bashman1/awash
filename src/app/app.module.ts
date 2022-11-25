import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { LoginModalPageModule } from './pages/login-modal/login-modal.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonFunctions } from './services/CommonFunctions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPage } from './pages/main/main.page';
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
// import { IonicImageViewerModule } from 'ionic-img-viewer';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IonicSelectableModule } from 'ionic-selectable';
// import { Camera } from '@ionic-native/Camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
// import { QRScanner } from '@ionic-native/qr-scanner/ngx';



@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot({
            backButtonText: ''
        }),
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        // LoginModalPageModule,
        BrowserAnimationsModule,
        ShowHidePasswordModule,
        NgxDatatableModule,
        IonicSelectableModule,
    ],
    providers: [
        StatusBar,
        // Camera,
        SplashScreen,
        CommonFunctions,
        ScreenOrientation,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        MainPage,
        BarcodeScanner,
        // QRScanner,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
