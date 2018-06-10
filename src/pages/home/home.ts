import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import 'rxjs/add/operator/map'

import { Http, HttpModule  } from '@angular/http';
import {NgProgress}from 'ngx-progressbar';
import { AlertController } from 'ionic-angular';

//Pages
import { BattleScreenPage } from '../battle-screen/battle-screen';
import { ListAdversaryScreenPage } from '../list-adversary-screen/list-adversary-screen';
import { TestePage } from '../teste/teste';
import { LoginScreenPage } from '../login-screen/login-screen';
import { ProfilePlayerScreenPage } from '../profile-player-screen/profile-player-screen';

import { Storage } from '@ionic/storage';



declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  map: any;
  amountDamage = 0;
  damageP1 = 20;
  damageP2 = 20;
  amountBomb = 5;
  amountLifeP1 = 100 + '%';
  amountLifeP2 = "100%";
  
  //barra de progresso  
  loadProgressDefense: number;
  loadProgressAttack: number;
  attackAmount: number;
  defenseAmount :number;
  //Barra de progresso
  colorBackForce = "progress-forceBack";
  colorProgressAtack = "progress-attack";
  colorProgressDefense = "progress-defense";
  labelProgress = '';
  public lat: any;
  public lng: any;

  user_name:any;
  btnDisable = false;
  url:string;
  dataPlayer = [];
  
  homeScreenOn = false;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, private http: Http, public alertCtrl: AlertController,
    public ngProgress: NgProgress, private geolocation: Geolocation, public storage: Storage) {


    
   }

  //Pages 
  battleScreenPage = BattleScreenPage;
  listAdversaryScreenPage = ListAdversaryScreenPage;
  loginScreenPage = LoginScreenPage;
  profilePlayerScreenPage = ProfilePlayerScreenPage;
  testPage = TestePage;


  //barra de progresso gnx-Progresso  //aux desenvolvimento
  ngOnInit(){

    this.ngProgress.start();
    this.ngProgress.set(0.8);
    this.ngProgress.minimum = 0;

  }

  //aux desenvolvimento
 profilePlayerScreenOn(){
    let user_name = this.user_name;

   let loadProgressDefense = this.loadProgressDefense;
   let loadProgressAttack = this.loadProgressAttack;
   let attackAmount = this.attackAmount;
   let defenseAmount = this.defenseAmount;
   
   let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando' 
    });
    loading.present();

    setTimeout(() => {
      this.navCtrl.push(this.profilePlayerScreenPage, { user_name, loadProgressDefense, loadProgressAttack, attackAmount, defenseAmount });
      loading.dismiss();
    }, 1000);

   
  }


  //aux desenvolvimento
  loginScreenOn(){ 
    //this.navCtrl.push(this.loginScreenPage);
    this.navCtrl.setRoot(this.loginScreenPage);
  }

  ///teste teste teste
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  adversaryBombTrow() {
    let v = this.getRandomInt(0, 100);
    console.log(v);
    //teste disable butao
    this.btnDisable = true;

  }
  ///fim teste


  //barra de progresso gnx-Progresso
  test1(){
    var i = 2
    this.amountDamage = this.amountDamage - 0.2; // 
    this.ngProgress.initState;
  
    this.ngProgress.set(this.amountDamage);
    this.ngProgress.maximum = this.amountDamage;
    console.log(this.ngProgress.maximum);

    
    
  }

  plus() {
    //this.loadProgress++;
  }

  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

//uso dano barra
  test2(){
    
      console.log(this.amountDamage + "depois");
    
    this.amountDamage = this.amountDamage + 20;
    console.log(this.amountDamage)
    
      this.amountLifeP1 = 100 - this.amountDamage + '%';
  
  }

  //usando este ->  EM BREVE APAGAR ESTE
  presentLoadingText(){
    let loading = this.loadingCtrl.create({
      //spinner: 'hide',
      spinner: 'dots',
      content: 'carregando'
      /*`<div class="custom-spinner-container">
            <img class="loading" width="70px" height="70px" src="assets/imgs/t.gif" />
          </div>`,*/
    });

    loading.present();

    setTimeout(() => {
      this.navCtrl.push(this.battleScreenPage);
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

//chamando page lista de adversários
listAdversaryScreenOn(typeOfBattle) {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando' 
    });
    loading.present();

    let user_name = this.user_name; //auxiliar para envio como parametro
    setTimeout(() => {
      this.navCtrl.push(this.listAdversaryScreenPage, { user_name, typeOfBattle });
      loading.dismiss();
    }, 1000);

   
    }


    
  // apenas teste
  clearData(){
    this.storage.forEach((value: string, key: string, iterationNumber: Number) => {
      this.storage.remove('user_name');
      location.reload();
      
    })
  }


  setDataLocation(lat, lng) {
    let user_name = this.user_name
    this.http.post('https://battleshiptcc.000webhostapp.com/api/setLocation', { user_name, lat, lng }).toPromise().then((response) => {
    
    });

  }

  /*
   *Verificação de GPS status ->INICIO<-
   */

  alertLocation(message, title) {
    let alertBattle = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [

        {
          text: 'Ok',
          handler: () => {
            this.setLocation();

          }
        }
      ]
    });
    alertBattle.present()
  }

  alertLocationSuccess(message, title) {
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


  setLocation() {
    var options = {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0
    };


    this.geolocation.getCurrentPosition(options).then((res) => {

      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;


      this.alertLocationSuccess('Localização coletada com sucesso! Pode desligar seu GPS se desejar! ;)', 'Tudo certo!');

      this.setDataLocation(this.lat, this.lng);

    }).catch(() => {
      this.alertLocation('Por favor ative seu Gps ou certifique-se de ter concedido as permissões necessárias!', 'Ooh não!!! :(');
    });

  }

  /*
   * Verificação de GPS status ->Fim<-
   */



ionViewDidLoad(){
  

  var loading = this.loadingCtrl.create({
    spinner: 'dots',
    content: 'carregando'
  });
  loading.present();
   // this.dataPlayer = [];
  let user_name; // auxiliar para envio na requisição que não aceita variavel global
 
  //  this.storage.remove('user_name');
  //verificando se existe usuário logado
    this.storage.get('user_name').then((val) => {
      if (val == null){
        console.log("null");
        loading.dismiss();
        this.loginScreenOn();
      }else{
        console.log("not null");
        this.homeScreenOn= true;
  
 

  //atribuindo valor a variável

    this.storage.forEach((value: string, key: string, iterationNumber: Number) => {     
      if(value != null){
        this.user_name = value;
        
        setTimeout(() => {
          this.url = 'https://battleshiptcc.000webhostapp.com/api/getPlayer';
          user_name = this.user_name;

          this.http.post(this.url, { user_name }).toPromise().then((response) => {
            this.dataPlayer.push(response.json());
            this.dataPlayer = this.dataPlayer[0];
            console.log("dados", this.dataPlayer[0]); //teste
            //normatização
           


            this.loadProgressAttack = 100 - (parseInt(this.dataPlayer[0].attack_force) * 100) / 60;
            this.loadProgressDefense = 100 - (parseInt(this.dataPlayer[0].defense_force) * 100) / 50;
            this.attackAmount = parseInt(this.dataPlayer[0].attack_force);
            this.defenseAmount = parseInt(this.dataPlayer[0].defense_force);
          });
        }, 250);

      }   
    });

    let setT = setTimeout(() => {
      if ((this.dataPlayer.length == 0) && (this.homeScreenOn == true)) {
        location.reload();
      }else{
        this.setLocation();
        clearInterval(setT);
        loading.dismiss();
      }
    }, 2000);
   

      }
    });
      
  }


}