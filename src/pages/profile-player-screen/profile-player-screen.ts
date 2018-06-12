import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  LoadingController  } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { Http, HttpModule } from '@angular/http';
import { AlertController } from 'ionic-angular';



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
 
  lat:any;
  lng:any;




  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, private geolocation: Geolocation, public storage: Storage) {
  }

  alertNetwork(message, title) {
    let alertBattle = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [

        {
          text: 'Recarregar',
          handler: () => {
            this.ionViewDidEnter();

          }
        },
        {
          text: 'ok',
          handler: () => {
            this.navCtrl.pop();

          }

        }
      ]
    });
    alertBattle.present()
  }

  ionViewDidEnter() {

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando'
    });
    loading.present();

    this.user_name = this.navParams.get('user_name');

    this.loadProgressDefense = this.navParams.get('loadProgressDefense');
    this.loadProgressAttack = this.navParams.get('loadProgressAttack');
    this.attackAmount = this.navParams.get('attackAmount');
    this.defenseAmount = this.navParams.get('defenseAmount');

    this.dataPlayer = [];

    let url = 'https://battleshiptcc.000webhostapp.com/api/getPlayer';
    let user_name = this.user_name;
    this.http.post(url, { user_name }).toPromise().then((response) => {
      this.dataPlayer.push(response.json());
      this.dataPlayer = this.dataPlayer[0];
      loading.dismiss();
      console.log("dados", this.dataPlayer[0]);

    }).catch(()=>{
      this.alertNetwork('Problemas com a conexão à internet :(', 'Ohh não!!');
      loading.dismiss();

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

 


  alertLocation(message, title) {
    let alertBattle = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [

        {
          text: 'Ok',
          handler: () => {
            

          }
        }
      ]
    });
    alertBattle.present();
  }


  

 setDataLocation( lat, lng){
   let user_name = this.user_name
   this.http.post('https://battleshiptcc.000webhostapp.com/api/setLocation', { user_name, lat, lng }).toPromise().then((response) => {

   });

 }



  setLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0
    };


        this.geolocation.getCurrentPosition(options).then((res) => {

          this.lat = res.coords.latitude;
          this.lng = res.coords.longitude;


          this.alertLocation('Localização atualizada com sucesso! Pode desligar seu GPS se desejar! ;)', 'Tudo certo!');

          this.setDataLocation(this.lat, this.lng);

        }).catch(() => {
          this.alertLocation('Por favor ative seu Gps ou certifique-se de ter concedido as permissões necessárias!', 'Ooh não!!! :(');
        });


  

  }





}



