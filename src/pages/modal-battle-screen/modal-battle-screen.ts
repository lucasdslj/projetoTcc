import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { ListAdversaryScreenPage } from '../list-adversary-screen/list-adversary-screen';
import { BattleScreenPage } from '../battle-screen/battle-screen';

import { Http, HttpModule } from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-modal-battle-screen',
  templateUrl: 'modal-battle-screen.html',
})
export class ModalBattleScreenPage {

  defeatMessage:String;
  outType: String;
  xpCurrent = 0;
  xpGained = 0;
  xpLevelUp = 0;

  //ProgressBarComponent
  loadProgress: number;
  loadProgressEnd: number;
  xpAmount: number;
  xpAmountEnd: number;
  level: number;
  //setInter:any

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public http: Http ) {
   
  }

  listAdversaryScreenPage = ListAdversaryScreenPage;
  battleScreenPage = BattleScreenPage;

 

  ionViewDidEnter() {
    var user_name;
    
    this.outType = this.navParams.get('outType');
    user_name = this.navParams.get('user_name');

    if (this.outType == "defeat") {
      this.defeatMessage = this.navParams.get('defeatMessage');
      

      let url = 'https://battleshiptcc.000webhostapp.com/api/plusDefeat';
      this.http.post(url, { user_name }).toPromise().then((response) => {
      });

    }else{
      console.log("aqui entrou");//aux desen
      let user_name_adversary = this.navParams.get('user_name_adversary');
      this.xpCurrent = this.navParams.get('xpCurrent');
      this.xpGained = this.navParams.get('xpGained');
      this.xpLevelUp = this.navParams.get('xpLevelUp');
      this.level = this.navParams.get('level');
      let typeOfBattle = this.navParams.get('typeOfBattle');
      
      //controle do Xp
      this.xpAmount = this.xpCurrent;
      this.xpAmountEnd = this.xpCurrent + this.xpGained;


      if (typeOfBattle != 'rematch') {
        this.http.post('https://battleshiptcc.000webhostapp.com/api/addRematch', { user_name, user_name_adversary }).toPromise().then((response) => {
        });
      }
      
      
      let url = 'https://battleshiptcc.000webhostapp.com/api/plusVictory';
      this.http.post(url, { user_name }).toPromise().then((response) => {
      });

      url = 'https://battleshiptcc.000webhostapp.com/api/plusXp';
      let xpGained = this.xpGained; //Variavel para passar na rota
      this.http.post(url, { user_name, xpGained }).toPromise().then((response) => {
      });


      if (this.level == 5) {
        this.loadProgress = 100;
        this.loadProgressEnd = 100;
       
        
      }else{
        //Controle do progressBar
        this.loadProgress = (this.xpCurrent * 100)/ this.xpLevelUp;
        this.loadProgressEnd = ((this.xpCurrent + this.xpGained)*100) / this.xpLevelUp;
        //normatizando
        this.loadProgress = Math.floor(this.loadProgress);
        this.loadProgressEnd = Math.floor(this.loadProgressEnd);

        if ((this.xpCurrent + this.xpGained) >= this.xpLevelUp ){

          url = 'https://battleshiptcc.000webhostapp.com/api/plusLevel';
          let xpGained = this.xpGained; //Variavel para passar na rota
          this.http.post(url, { user_name }).toPromise().then((response) => {
          });
          this.level++;

        }

        //crescimento da barra de progressão
        var setInterLoad = setInterval(() => {
          if (this.loadProgress == 100) {

              clearInterval(setInterLoad);
                setTimeout(() => {
                this.openLevelUp();
              }, 1000);
          } else {
            if (this.loadProgress < this.loadProgressEnd) {
              this.loadProgress += 1;
            }
          }
        }, 100);

      }
      
      console.log("loi", this.loadProgress);
      console.log("lof", this.loadProgressEnd );
      


      //quantidade de Xp
      var setInterXp = setInterval(()=> {
        if (this.xpAmount < this.xpAmountEnd  ) {
          this.xpAmount++;        
        }else{
          clearInterval(setInterXp);
        }

      } ,50);

    } 
    
    

    console.log("mesagem recebida: ", this.defeatMessage); 
    console.log("mesagem : ", this.outType);
    console.log("xp ganho: ", this.xpGained);
    console.log("xp atual: ", this.xpCurrent);
    console.log("xp level up: ", this.xpLevelUp);
  }


  openLevelUp() {

    setTimeout(() => {
      this.outType = "levelUp";
    }, 2000);
  }


  closeModal(){
    this.viewCtrl.dismiss();
    
  }

}
