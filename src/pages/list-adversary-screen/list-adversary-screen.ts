import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

//Pages
import { BattleScreenPage } from '../battle-screen/battle-screen';


@IonicPage()
@Component({
  selector: 'page-list-adversary-screen',
  templateUrl: 'list-adversary-screen.html',
})
export class ListAdversaryScreenPage {

  typeOfBattle: string;
  user_name: string;
  public opponentPlayers = [];
  public opponentPlayersRematch = [];
  public stateRematch;
  public opponentPlayerSelected: any;
  public typeB: any;


  public lat: any;
  public lng: any;
  //modificar 
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public geolocation: Geolocation,
     public loadingCtrl: LoadingController, public storage: Storage, public alertCtrl: AlertController,) {
    
  }


  //Pages
  battleScreenPage = BattleScreenPage;
 
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


  alertLocation(message, title) {
    let alertBattle = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [

        {
          text: 'Tentar novamente',
          handler: () => {
            this.setLocation(this.opponentPlayerSelected, this.typeB );

          }
        },
        {
          text: 'Ok',
          handler: () => {
          

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
          text: 'Vamos lá!',
          handler: () => {
            this.battleScreenOn()

          }
        }
      ]
    });
    alertBattle.present();
  }

  setDataLocation(lat, lng) {
    let user_name = this.user_name
  //  this.alertLocation('oinnn!', 'Ooh não!!! :(');
    this.http.post('https://battleshiptcc.000webhostapp.com/api/setLocation', { user_name, lat, lng }).toPromise().then((response) => {
    let rs: any;
    rs = response.json();
    //  this.alertLocation('oinnnnnnnnnnnnnnnnnnnnnn!', 'Ooh não!!! :(');
      console.log(response);
      
      if (rs == "success") {
      this.alertLocationSuccess('Localização coletada com sucesso! Pode desligar seu GPS se desejar! ;)', 'Tudo certo, hora de batalhar!');
    
      }  else{
    this.alertLocation('Por favor ative seu Gps ou certifique-se de ter concedido as permissões necessárias TT!', 'Ooh não!!! :(');
      }
    
      

    });

  }


  setLocation(opponentPlayerSelected, typeB) {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Coletando coordenadas'
    });
    loading.present();
    this.opponentPlayerSelected = opponentPlayerSelected;
    this.typeB = typeB;

    var options = {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0
    };


    this.geolocation.getCurrentPosition(options).then((res) => {

      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;
      
      loading.dismiss();
      this.setDataLocation(this.lat, this.lng);


    }).catch(() => {
      loading.dismiss();
      this.alertLocation('Por favor ative seu Gps ou certifique-se de ter concedido as permissões necessárias!', 'Ooh não!!! :(');
      // Vá em: configurações->aplicativos->selecione este app->permissões->permita a localização
    });

  }




  ionViewDidEnter(){


    this.user_name = this.navParams.get('user_name');
    this.typeOfBattle = this.navParams.get('typeOfBattle');
    let user_name = this.user_name;

   
    //tratamento de carregando na volta da tela de batalha
    var loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando'
    });
    loading.present();

    //net
    let timeOutNetwork = setTimeout(() => {

      this.alertNetwork('Problemas com a conexão à internet :(', 'Ohh não!!');
      loading.dismiss();

    }, 15000);
    

    //Tratamento: Error trying to diff '[object Object]'
    this.opponentPlayers = [];
    this.opponentPlayersRematch = [];
   
    
    var len;
    var inter = setTimeout(() => {

      

      this.http.get('https://battleshiptcc.000webhostapp.com/api/opponentPlayers/' + this.user_name).toPromise().then((response) => {
        this.opponentPlayers.push(response.json());
        len = this.opponentPlayers[0].length;

        //normatização
      


        this.opponentPlayers = this.opponentPlayers[0];
      
        if (len > 0) {
          clearTimeout(timeOutNetwork);//net
          loading.dismiss();
          clearInterval(inter);
        }

        

      });


      this.http.post('https://battleshiptcc.000webhostapp.com/api/getRematch', { user_name } ).toPromise().then((response) => {
        this.opponentPlayersRematch.push(response.json());
        if (this.opponentPlayersRematch[0].length == 0) {
          this.stateRematch = 'vazio';

        }else{
          this.stateRematch = 'nVazio';
        }
  

        this.opponentPlayersRematch = this.opponentPlayersRematch[0];

        console.log("re",this.opponentPlayersRematch );//teste
      
      });

    }, 200);


   
 

  }

  
  battleScreenOn(){

    

    let user_name = this.user_name;
    

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando'
    });
    loading.present();
   // setTimeout(() => {
      
    //}, 5000);
    
    console.log("Page List Opponents",this.opponentPlayerSelected); //aux desenvolvimento
    
    var aux = [];
    //convertando em um array
    aux[0] = this.opponentPlayerSelected;
    
    let user_name_adversary = aux[0].player_adversary;

    console.log("aa", user_name_adversary);//teste

    if(this.typeB == 'rematch'){
      this.http.post('https://battleshiptcc.000webhostapp.com/api/delRematch', { user_name, user_name_adversary }).toPromise().then((response) => {
      }).catch(()=>{
        this.alertNetwork('Problemas com a conexão à internet :(', 'Ohh não!!');
        loading.dismiss();
        
      });

    }

    setTimeout(() => {
      //this.navCtrl.push(this.battleScreenPage);
      loading.dismiss();
      let typeB = this.typeB;
      this.navCtrl.push(this.battleScreenPage, { aux, user_name, typeB  });

    }, 1000);

    
    
  }



}
