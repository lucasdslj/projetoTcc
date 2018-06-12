import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { Geolocation } from '@ionic-native/geolocation';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NativeAudio } from '@ionic-native/native-audio';
import { SmartAudioProvider } from '../providers/smart-audio/smart-audio';

import { NgProgressModule} from 'ngx-progressbar';

import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

//Pages
import { HomePage } from '../pages/home/home';
import { BattleScreenPage } from '../pages/battle-screen/battle-screen';
import { ListAdversaryScreenPage } from '../pages/list-adversary-screen/list-adversary-screen';
import { TestePage } from '../pages/teste/teste';
import { ModalBattleScreenPage } from '../pages/modal-battle-screen/modal-battle-screen';
import { LoginScreenPage } from '../pages/login-screen/login-screen';
import { SignUpScreenPage } from '../pages/sign-up-screen/sign-up-screen';
import { ProfilePlayerScreenPage } from '../pages/profile-player-screen/profile-player-screen';
import { IonicStorageModule } from '@ionic/storage';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    BattleScreenPage,
    TestePage,
    ListAdversaryScreenPage,
    ProgressBarComponent,
    ModalBattleScreenPage,
    LoginScreenPage,
    SignUpScreenPage,
    ProfilePlayerScreenPage
   
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule,
    NgProgressModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql' ]
    })
  
  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    BattleScreenPage,
    TestePage,
    ListAdversaryScreenPage,
    ModalBattleScreenPage,
    LoginScreenPage,
    SignUpScreenPage,
    ProfilePlayerScreenPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    NativeAudio,
    SmartAudioProvider 
  ]
})
export class AppModule {}
