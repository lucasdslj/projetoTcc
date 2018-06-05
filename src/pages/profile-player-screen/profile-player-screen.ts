import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  LoadingController  } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { Http, HttpModule } from '@angular/http';

//page
import {LoginScreenPage} from '../login-screen/login-screen';

@IonicPage()
@Component({
  selector: 'page-profile-player-screen',
  templateUrl: 'profile-player-screen.html',
})
export class ProfilePlayerScreenPage {

  loadProgress = 50;
  xpAmount = 250;
  public dataPlayer;
  public user_name;

  //barra de progresso  
  loadProgressDefense: number;
  loadProgressAttack: number;
  attackAmount: number;
  defenseAmount: number;
  //Barra de progresso
  colorBackForce = "progress-forceBack";
  colorProgressAtack = "progress-attack";
  colorProgressDefense = "progress-defense";
  labelProgress = '';



  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http,
    public loadingCtrl: LoadingController, private geolocation: Geolocation, public storage: Storage) {
  }

  ionViewDidEnter() {

    this.user_name = this.navParams.get('user_name');

    this.loadProgressDefense = this.navParams.get('loadProgressDefense');
    this.loadProgressAttack = this.navParams.get('loadProgressAttack');
    this.attackAmount = this.navParams.get('attackAmount');
    this.defenseAmount = this.navParams.get('defenseAmount');

    this.dataPlayer = [];

    let url = 'http://localhost:8000/api/getPlayer';
    let user_name = this.user_name;
    this.http.post(url, { user_name }).toPromise().then((response) => {
      this.dataPlayer.push(response.json());
      this.dataPlayer = this.dataPlayer[0];
      console.log("dados", this.dataPlayer[0]);

    });
  }

  

  logout(){
    this.storage.forEach((value: string, key: string, iterationNumber: Number) => {
      this.storage.remove('user_name');

      let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'carregando'
      });
      loading.present();
      setTimeout(() => {
        this.navCtrl.setRoot(LoginScreenPage);
        loading.dismiss();
      }, 2000);
      

    })
  }


}
