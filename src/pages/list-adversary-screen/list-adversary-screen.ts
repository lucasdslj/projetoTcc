import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

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

  //modificar 
  url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
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

    }, 10000);
    

    //Tratamento: Error trying to diff '[object Object]'
    this.opponentPlayers = [];
    this.opponentPlayersRematch = [];
   
    
    var len;
    var inter = setTimeout(() => {

      this.url = 'https://battleshiptcc.000webhostapp.com/api/opponentPlayers/' + this.user_name;

      this.http.get(this.url).toPromise().then((response) => {
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

  
  battleScreenOn(opponentPlayerSelected, typeB){

    let user_name = this.user_name;
    

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando'
    });
    loading.present();
   // setTimeout(() => {
      
    //}, 5000);
    
    console.log("Page List Opponents",opponentPlayerSelected); //aux desenvolvimento
    
    var aux = [];
    //convertando em um array
    aux[0] = opponentPlayerSelected;
    
    let user_name_adversary = aux[0].player_adversary;

    console.log("aa", user_name_adversary);//teste

    if(typeB == 'rematch'){
      this.http.post('https://battleshiptcc.000webhostapp.com/api/delRematch', { user_name, user_name_adversary }).toPromise().then((response) => {
      }).catch(()=>{
        this.alertNetwork('Problemas com a conexão à internet :(', 'Ohh não!!');
        loading.dismiss();
        
      });

    }

    setTimeout(() => {
      //this.navCtrl.push(this.battleScreenPage);
      loading.dismiss();
      this.navCtrl.push(this.battleScreenPage, { aux, user_name, typeB  });

    }, 1000);

    
    
  }



}
