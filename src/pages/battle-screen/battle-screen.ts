import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController  } from 'ionic-angular';


import {FormBuilder, Validators} from '@angular/forms'
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { NativeAudio } from '@ionic-native/native-audio';

import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
//import { SmartAudioProvider } from '../../providers/smart-audio/smart-audio';
import { Storage } from '@ionic/storage';

//Pages
import { HomePage } from '../home/home';
import { ListAdversaryScreenPage } from '../list-adversary-screen/list-adversary-screen';
import { ModalBattleScreenPage } from '../modal-battle-screen/modal-battle-screen';


//import { JsonPipe } from '@angular/common';
import { mapStyle } from './mapStyle';

declare var google;

@IonicPage()
@Component({
  selector: 'page-battle-screen',
  templateUrl: 'battle-screen.html',
})
export class BattleScreenPage {
  
  markers = [];
  coordinates = {};
  map: any;
    
  mapStyle = mapStyle;
  public battleData = [];

   ab=true;

  trackerPause = false;
  //Barras de progressos
  amountLifeP1 = 100 + '%';
  amountLifeP2 = 100 + '%';

  amountDamageP1 = 0;
  amountDamageP2 = 0;

  amountBomb = 0;
  time: any;
  btnDisable = false;
  user_name_adversary;
  
  setInter:any;
  typeOfBattle;
  public possibleBattle = "possible";
  public timeBreak = false;
  public user_name:string;
  public dataPlayer = [];

  public dataOpponentPlayer: any;
  public url: string;

  //form
  public formBattle: any;

  constructor(public navCtrl: NavController,  public navParams: NavParams, public http: Http, public formBuilder: FormBuilder, 
    private toastCtrl: ToastController, public modalCtrl: ModalController, private nativeAudio: NativeAudio,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public storage: Storage ) {

    this.nativeAudio.preloadSimple('soundtrack', 'assets/sounds/track.mp3');
    this.nativeAudio.preloadSimple('bomb', 'assets/sounds/Bomb.mp3');
    
    //validação do form de lançar bomba
    this.formBattle = formBuilder.group({
      coordinateX: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(6), 
        Validators.pattern('((-)?[0-9]+)|((-)?[0-9]+([.]|[,])[0-9]+)'), Validators.required])],
      coordinateY: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(6),
        Validators.pattern('((-)?[0-9]+)|((-)?[0-9]+([.]|[,])[0-9]+)'), Validators.required])]
    });

    //[0-9]{0,10}[,]{1,1}[0-9]{0,4}
    //| (-) ? [0 - 9] + ([.] | [,])[0 - 9] +
    
//'(-)?[0-9]+(.)?[0-9]+'

  }

  //Pages
  homePage = HomePage;
  listAdversaryScreenPage = ListAdversaryScreenPage;
  

  playerBombThrow(coordinates){

    var geoX = 0, geoY = 0, valueX= false, valueY = false;

    this.nativeAudio.play('bomb');
    
    var checkEnd = false;

    //time para decrementar variavel em tela, bombas
    setTimeout(() => {
      this.amountBomb -= 1;
    }, 1800);
   

    parseInt(coordinates.x);
    parseInt(coordinates.y);
    this.btnDisable = true; // controle para evitar o jogador atirar em determinados momentos
    
    //acertou
    if ((coordinates.x == this.battleData[4][0]) && (coordinates.y == this.battleData[4][1]) ){
      this.markerBoardBomb(this.map, this.battleData[2][0], this.battleData[2][1], 'bombWater4.gif', '');

      setTimeout(() => {
        // this.amountDamageP1 += atack_force do Player 1; Exemplo como deve ser
        this.amountDamageP1 += parseInt(this.dataPlayer[0].attack_force);

        this.amountLifeP2 = (100 - ((this.amountDamageP1 * 100 ) / parseInt(this.dataOpponentPlayer[0].amount_life))) + '%';

        if (parseInt(this.amountLifeP2.slice(0,-1)) <= 0) {
          this.amountLifeP2 = "0%";
          //vitoria

          this.openModalScreenVictory('victory', parseInt(this.dataPlayer[0].amount_xp), parseInt(this.dataOpponentPlayer[0].xp_given),
            parseInt(this.dataPlayer[0].amount_level_up) + 1, this.user_name, parseInt(this.dataPlayer[0].level) );

          clearInterval(this.setInter);
          checkEnd = true;

        }else{

          if ((this.amountBomb != 0)) {

            
              this.initBattle(); // nova rodada
         

          }
        }

       


      }, 2000);
        
       
    //Errou
    }else{   
      
      //buscando coordenadas informadas pelo usuário, nos eixos X e Y
      for(var i=0; i< this.battleData[0].length; i++){  
        if (coordinates.x == this.battleData[5][1][i]) {
          geoX = this.battleData[5][0][i];
          //controle de coordenada encontrada no tabuleiro
          valueX = true;
          console.log("x:", geoX);// teste
        }
        if (coordinates.y == this.battleData[6][1][i]){
          geoY = this.battleData[6][0][i];
          //controle de coordenada encontrada no tabuleiro
          valueY = true; 
          console.log("y: ",geoY); // teste
        }   
                     
      }

      //passando valor inverso de X e Y, Plotagem no tabuleiro
      this.markerBoardBomb(this.map, geoY, geoX, 'bombWater4.gif', '');
      console.log("errou"); // teste

    
      setTimeout(() => {
        if (!valueX || !valueY) {

          // Coordendas informadas pelo usuário não se encontram no tabuleiro
          let toast = this.toastCtrl.create({
            message: 'A Bomba caiu em águas desconhecidas!',
            duration: 2000,
          });
          toast.onDidDismiss;
          toast.present();

        } else {
          // Coordendas informadas pelo usuário não correspondem à do inimigo
          let toast = this.toastCtrl.create({
            message: 'A Bomba caiu no mar :(',
            duration: 2000,

          });

          toast.onDidDismiss;

          toast.present();
          }
        
      }, 1500);

    }

    //Verifica saidas Derrota  
    setTimeout(() => {
      if ((this.amountBomb == 0) && (checkEnd == false)) {
        this.openModalScreenDefeat('defeat',"Suas Bombas Acabaram!", this.user_name);
        clearInterval(this.setInter);
      }else{
        if ((checkEnd == false)){
        //CHAMADA FUNÇÃO TIRO DO ADVERSÁRIO
        setTimeout(() => {
          let toast =this.toastCtrl.create({
            message: this.dataOpponentPlayer[0].patent + ' ' + this.dataOpponentPlayer[0].user_name + ' Lança Bomba',
            duration: 2000,
            position: 'top'

          });
          toast.onDidDismiss;

          toast.present();
          this.adversaryBombTrow(parseInt(this.dataOpponentPlayer[0].level));
        }, 3000); //verificar se esta certo tiro
      }
      }
    
    
    }, 2050);  // tempo precisa ser maior do que o tempo de lançamento da bomba                             
    
  

    console.log("x:", geoX);
    console.log("y:", geoY);

    //limpando campos
    coordinates.x =null;
    coordinates.y = null;
    
    

  

}

//arredondamento
getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//Player adversário acerta
bombHit(){

  if (this.timeBreak == false) {
    this.nativeAudio.play('bomb');
   
    setTimeout(() => {
      this.markerBoardBomb(this.map, this.battleData[1][0], this.battleData[1][1], 'bombWater4.gif', ''); //coordenada do jogador

      console.log("somatorio de dano antes", this.amountDamageP2);//teste
      this.amountDamageP2 = this.amountDamageP2+ parseInt(this.dataOpponentPlayer[0].attack_force);
      console.log("somatorio de dano", this.amountDamageP2);//teste

      // este "100" que divide é para substituir pela quantidade de vida do Player 1 (banco de dados local)
      this.amountLifeP1 = (100 - ((this.amountDamageP2 * 100) / parseInt(this.dataPlayer[0].amount_life))) + '%';

      console.log("Life", this.amountLifeP1);//teste

      let toast = this.toastCtrl.create({
        message: this.dataOpponentPlayer[0].patent + ' ' + this.dataOpponentPlayer[0].user_name + ' Acertou seu navio!',
        duration: 2000,
        position: 'top'

      });
      toast.onDidDismiss;
      toast.present();

      if (parseInt(this.amountLifeP1.slice(0, -1)) <= 0) {
        this.amountLifeP1 = "0%";

        //Derrota
        this.openModalScreenDefeat('defeat', "Seu navio afundou!", this.user_name);
        clearInterval(this.setInter);


      }
    }, 2005);
  }

  }

//Player adversario erra
bombMiss(start1, end1, start2, end2){
  if (this.timeBreak == false) {
    this.nativeAudio.play('bomb');
     

    let x, y, rs = [];
    x = this.getRandomInt(start1, end1);
    y = this.getRandomInt(start2, end2);
    //evita-se que o tiro aleatório de erro acerte um dos adversários
    for (let i = 0; i < 1;) {
      if ((x == this.battleData[3][0]) || (y == this.battleData[3][1]) || (x == this.battleData[4][0]) || (y == this.battleData[4][1])) {
        x = this.getRandomInt(start1, end1);
        y = this.getRandomInt(start2, end2);
      } else {
        i = 1;//saída do for
      }
    }

   setTimeout(() => {
     let toast = this.toastCtrl.create({
       message: this.dataOpponentPlayer[0].patent + ' ' + this.dataOpponentPlayer[0].user_name + ' errou o Lançamento!',
       duration: 2000,
       position: 'top'

     });
     toast.onDidDismiss;
     toast.present();
 
   }, 2005);
     
    ///retorno
    rs.push(x);
    rs.push(y);
    return rs;

  }
  }


adversaryBombTrow(level){

    
    let aux = this.battleData[0].length - 1;
    let coordBomb = [];
    let middle;

  let checkbomb = this.getRandomInt(0, 100); //sorteio de acerto do tiro

    if(this.timeBreak == false){
      
    switch (level) {
      //Lv. 1
      case 1:
        if (checkbomb < 30) {
          console.log("check", checkbomb);//teste
          this.bombHit();
        }else{ 
          coordBomb = this.bombMiss(0, aux, 0, aux);         
          this.markerBoardBomb(this.map, this.battleData[0][coordBomb[0]][coordBomb[1]][0], this.battleData[0][coordBomb[0]][coordBomb[1]][1], 'bombWater4.gif', '');
         
          console.log("check e", checkbomb);
        }
        break;

      //Lv. 2
      case 2:
        if (checkbomb < 40) {
          this.bombHit();
          console.log("check ", checkbomb);//teste
        }else{
          middle = aux / 2;
          Math.floor(middle);
          if (this.battleData[3][0] <= middle ){
            coordBomb = this.bombMiss(0, middle, 0, aux); 
          }else{
            coordBomb = this.bombMiss(middle+1, aux, 0, aux); 
          }
          console.log("check e", checkbomb);
            
          this.markerBoardBomb(this.map, this.battleData[0][coordBomb[0]][coordBomb[1]][0], this.battleData[0][coordBomb[0]][coordBomb[1]][1], 'bombWater4.gif', '');
        }

        break;

      //Lv. 3
      case 3:
        if (checkbomb < 55) {
          this.bombHit();
        } else {
          middle = aux / 2;
          Math.floor(middle);
          if (this.battleData[3][0] <= middle) {
            coordBomb = this.bombMiss(0, middle, 0, aux);
          } else {
            coordBomb = this.bombMiss(middle + 1, aux, 0, aux);
          }
        this.markerBoardBomb(this.map, this.battleData[0][coordBomb[0]][coordBomb[1]][0], this.battleData[0][coordBomb[0]][coordBomb[1]][1], 'bombWater4.gif', '');
        }
        break;

        

      //Lv. 4
      case 4:
        if (checkbomb < 75) {
          this.bombHit();
        } else {
          middle = aux / 2;
          Math.floor(middle);
          if ((this.battleData[3][0] <= middle)) {
            if (this.battleData[3][1] <= middle) {
              coordBomb = this.bombMiss(0, middle, 0, middle);
            } else {
              coordBomb = this.bombMiss(0, middle, middle + 1, aux);
            }
          } else {
            if (this.battleData[3][1] <= middle) {
              coordBomb = this.bombMiss(middle + 1, aux, 0, middle);
            } else {
              coordBomb = this.bombMiss(middle + 1, aux, middle + 1, aux);
            }
          }

        this.markerBoardBomb(this.map, this.battleData[0][coordBomb[0]][coordBomb[1]][0], this.battleData[0][coordBomb[0]][coordBomb[1]][1], 'bombWater4.gif', '');
        }
        break;

      //Lv. 5
      case 5:
        if (checkbomb < 90) {
          this.bombHit();
        } else {
          middle = aux / 2;
          Math.floor(middle);
          if ((this.battleData[3][0] <= middle)) {
            if (this.battleData[3][1] <= middle) {
              coordBomb = this.bombMiss(0, middle, 0, middle);
            } else {
              coordBomb = this.bombMiss(0, middle, middle + 1, aux);
            }
          } else {
            if (this.battleData[3][1] <= middle) {
              coordBomb = this.bombMiss(middle + 1, aux, 0, middle);
            } else {
              coordBomb = this.bombMiss(middle + 1, aux, middle + 1, aux);
            }
          }
          this.markerBoardBomb(this.map, this.battleData[0][coordBomb[0]][coordBomb[1]][0], this.battleData[0][coordBomb[0]][coordBomb[1]][1], 'bombWater4.gif', '');
        }
        break;
      

      default:{///teste
        let toast = this.toastCtrl.create({
          message: 'entrouuuu!!!!!!!',
          duration: 2000,
        });
        toast.onDidDismiss;
        toast.present();

      }
        break;//fim teste
    
    }
    setTimeout(() => {
      this.btnDisable = false;
    }, 2000);
      
  }
      
   

  }

  
    
  
  //Função de arredondamento
  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  //Função Desenha linha
  drawPolyline(map, lat1, lng1, lat2, lng2, color){
    var pointLines = new Array();
    
    pointLines.push({ lat: lat1, lng: lng1 });
    pointLines.push({ lat: lat2, lng: lng2 });
    var poly = new google.maps.Polyline({
      path: pointLines,
      strokeColor: color,
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    poly.setMap(map);   
  }

  //marcação de bomba
  markerBoardBomb(map, lat, lng, icon, animation) {
  
    var position = new google.maps.LatLng(lat, lng);

    var marker = new google.maps.Marker({
      position: position,
      map: map,
      animation: animation,

      icon: { url: 'assets/imgs/' + icon }
    });

    this.markers.push(marker);
   // this.markers[0].setMap(map);

    
   
    let TIME_IN_MS = 1500;
     setTimeout(() => {
      for (var i = 0; i < this.markers.length; i++){
      
         this.markers[i].setMap(null);
       }
     }, TIME_IN_MS);

    console.log(this.markers.length);
    return;
    
    
  }


  
  //Adiciona um marcador no tabuleiro -> Escala e Embarcações
  markerBoard(map,lat, lng, icon, animation){
    var position = new google.maps.LatLng(lat, lng);

   var marker = new google.maps.Marker({
      position: position,
      map: map,
       animation: animation,
      
      icon: { url: 'assets/imgs/'+icon }
  });
}

//função de clock
subTime(hora, seconds) {
  var aux = [];
  var timeHoraFinal = hora - (( seconds /60) * 60 * 1000);
  var dt = new Date(timeHoraFinal);
  
  aux[0] = (dt.getMinutes() < 10) ? '0' + dt.getMinutes() + ':' : dt.getMinutes() + ':';
  aux[1]= (dt.getSeconds() < 10) ? '0' + dt.getSeconds() : dt.getSeconds();
  
  var horaRetorno = aux[0] + aux[1];
  return horaRetorno;
}

//função de conversão de um tempo em timestamp
toTimestamp(horario) {
  var aux = horario.split(':'), dt = new Date();
  dt.setHours(aux[0]);
  dt.setMinutes(aux[1]);
  dt.setSeconds(0);
  return dt.getTime();
}

//função de Alert (Sem uso)
alertBattleImpossible() {
    let alertBattle = this.alertCtrl.create({
      title: 'oohh Não!!! :(',
      message: 'Você não pode batalhar agora com ' + this.user_name_adversary +' devido suas coordenadas atuais! Tente mais tarde!',
      buttons: [
       
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

//Chamada toda vez que a page fica ativa

getDataPlayer(){
  this.dataPlayer = [];
  let url = 'https://battleshiptcc.000webhostapp.com/api/getPlayer';
  let user_name = this.user_name; 
  this.http.post(url, { user_name }).toPromise().then((response) => {
    this.dataPlayer.push(response.json());
    this.dataPlayer = this.dataPlayer[0];
    console.log("dados", this.dataPlayer[0]);
    //normatização
 
  });
}

  alertNetwork(message, title) {
    let alertBattle = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [

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


    var a = 1; //auxiliar para decremento do tempo
    
    this.user_name = this.navParams.get('user_name');
    
    this.typeOfBattle = this.navParams.get('typeB');

    this.getDataPlayer();

    console.log("user_name:", this.user_name);
    this.dataOpponentPlayer = this.navParams.get('aux'); //recebendo parâmentros da page

    if (this.typeOfBattle == 'rematch') {
      this.user_name_adversary = this.dataOpponentPlayer[0].player_adversary;
    } else{
      this.user_name_adversary = this.dataOpponentPlayer[0].user_name;
    }

    //url para requisição no gmaps
    this.url = 'https://battleshiptcc.000webhostapp.com/api/boardcomposition/' + this.user_name + '/' + this.user_name_adversary;

    
    this.amountBomb = parseInt(this.dataOpponentPlayer[0].amount_bomb);
    //this.time = this.subTime( this.dataOpponentPlayer[0].time,1);

    var timeStamp = this.toTimestamp(this.dataOpponentPlayer[0].time)
    this.time = this.subTime(timeStamp, 0);
    
    //tempo contador
    setTimeout(() => {
   
    this.setInter = setInterval(() => {

      this.time = this.subTime(timeStamp, a);
      a += 1;
      if(this.time=="00:00"){
        //modal
        this.timeBreak == true;
        this.openModalScreenDefeat('defeat',"O Tempo Acabou!", this.user_name);

        console.log("Tempo encerrado");//teste
        clearInterval(this.setInter);
      }

    }, 1000);
    
  }, 3500);

    console.log("tempo",this.time); // teste
    

    console.log("Page Battle", this.dataOpponentPlayer); // teste
    
        //Consutrução do Tabuleiro
  
  this.nativeAudio.play('soundtrack'); // alterar

  this.initBattle(); 
  
    

    //Tracker
    //this.smartAudio.playTracker('tracker');

   // let timeOut =59000;
   // for (var i = 1; i < 5  ; i++) {
    //  setTimeout(() => {
    //    if (this.trackerPause == true) {
     //     return
      //  }
       // this.smartAudio.playTracker('tracker');
    //  }, timeOut * i);
 //   }


  }

  //verificar o pause de todos plays -> executa antes da page sair 
  ionViewCanLeave() {

    this.nativeAudio.stop('soundtrack');
    this.trackerPause = true;
    clearInterval(this.setInter);
  }


//Modal teste// aux desenvolvimento
open(){
  
  // this.openModalScreenDefeat('defeat',"O Tempo Acabou!");
  this.openModalScreenVictory('victory', parseInt(this.dataPlayer[0].amount_xp), parseInt(this.dataOpponentPlayer[0].xp_given),
    parseInt(this.dataPlayer[0].amount_level_up) + 1, this.user_name, parseInt(this.dataPlayer[0].level) );
}///////////////

  //Modal derrota
  openModalScreenDefeat(outType, defeatMessage, user_name){
    let myModal = this.modalCtrl.create(ModalBattleScreenPage, { outType, defeatMessage, user_name});
    myModal.present();

    myModal.onDidDismiss(()=>{this.navCtrl.pop()});

  }

  //modal vitória
  openModalScreenVictory(outType, xpCurrent, xpGained, xpLevelUp, user_name, level) {
    
    let user_name_adversary = this.user_name_adversary;
    let typeOfBattle = this.typeOfBattle;
    let myModal = this.modalCtrl.create(ModalBattleScreenPage, { outType, xpCurrent, xpGained, xpLevelUp, user_name, level, user_name_adversary, typeOfBattle});
    myModal.present();

    myModal.onDidDismiss(() => { this.navCtrl.pop() });

  }




  //Pause Tracker (apenas teste)
  test(){
   // this.smartAudio.stopTracker('tracker');
    this.trackerPause = true;
  }///////////////




  initBattle(){

    var i, j;
    this.battleData = [];

    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando'
    });
    loading.present();

    //net
    let timeOutNetwork = setTimeout(() => {
      loading.dismiss();
      this.alertNetwork('Problemas com a conexão à internet :(', 'Ohh não!!');

    }, 10000);

    this.http.get(this.url).toPromise().then((response) => {
      this.battleData.push(response.json());
      console.log(this.battleData);
      
      if (this.battleData[0] == "impossible") {
        //set interval serve para ter a certeza do andamento 
        clearTimeout(timeOutNetwork);//net
        setTimeout(() => {
          this.alertBattleImpossible();
          clearInterval(this.setInter);
         
          loading.dismiss();
          clearInterval(inter);
          
          
        }, 3550);
          
      }else{
        clearTimeout(timeOutNetwork);//net

        this.battleData = this.battleData[0];
        for (j = 0; j < this.battleData[0].length; j++) {
          for (i = 0; i < this.battleData[0].length; i++) {

            //Normatização do json => 6 casas decimais
            //Tabuleiro
            this.battleData[0][j][i][0] = this.round(this.battleData[0][j][i][0], 6);
            this.battleData[0][j][i][1] = this.round(this.battleData[0][j][i][1], 6);

          }
          //Eixo X e Eixo Y
          this.battleData[5][0][j] = this.round(this.battleData[5][0][j], 6);
          this.battleData[6][0][j] = this.round(this.battleData[6][0][j], 6);
          //escala dicimal
          if (parseInt(this.dataOpponentPlayer[0].level) == 5) {
            this.battleData[5][1][j] = this.round(this.battleData[5][1][j], 1);
            this.battleData[6][1][j] = this.round(this.battleData[6][1][j], 1);
          }

        }

        //Coordenadas Jogadores
        for (i = 0; i < 2; i++) {
          //Player 1
          this.battleData[1][i] = this.round(this.battleData[1][i], 6);
          //Player 2
          this.battleData[2][i] = this.round(this.battleData[2][i], 6);
        }


        console.log("após");
        console.log(this.battleData[7]);
       

        this.map = this.createMap(this.battleData[0], this.battleData[5], this.battleData[6], this.battleData[1], this.battleData[2]);
       
       
        // verofocação de término de carregamento
        var inter = setTimeout(() => {
        if (this.map.controls.length > 0) {
          loading.dismiss();
          clearInterval(inter);
        }
        }, 200);

      }
    });
  }


  createMap(board, axisX, axisY, coordPlayer1, coordPlayer2) {

    var map: any;
    var edgeBoundsPoints = [];   
    var position, marker, edgeBoard, markerIcon, aux = board.length - 1, i; 
    var colorBoard = '#00BFFF', colorAxis = '#000000';
   
    //Definindo pontos da borda do Tabuleiro e auxiliando o cálculo do baricentro
    var edgeBounds = new google.maps.LatLngBounds();

    edgeBoundsPoints.push({ lat: board[0][0][0], lng: board[0][0][1] });
    edgeBoundsPoints.push({ lat: board[0][aux][0], lng: board[0][aux][1] });

    edgeBoundsPoints.push({ lat: board[aux][aux][0], lng: board[aux][aux][1] });
    edgeBoundsPoints.push({ lat: board[aux][0][0], lng: board[aux][0][1] });

    for (i = 0; i < edgeBoundsPoints.length; i++) {
      edgeBounds.extend(edgeBoundsPoints[i]);
    }

    

    //opções do mapa 
    const mapOptions = {
      zoom: 20,
     // minZoom: minZ,
     // maxZoom: 18,
      center: edgeBounds.getCenter(),
      disableDefaultUI: true,      
      zoomControl: false,
      styles: this.mapStyle,
      // draggable: false,
      // scrollwheel: false, panControl: false,
    }

    //criando o mapa
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    //Criando borda do Tabuleiro
    edgeBoard = new google.maps.Polygon({
      path: edgeBoundsPoints,
      strokeColor: colorBoard,
      strokeOpacity: 1.0,
      strokeWeight: 2,
      //fillColor: '#FF0000',
      fillOpacity: 0.0
    });
    edgeBoard.setMap(map);

    //Desenhando no Mapa
    for (i = 1; i < board.length; i++) {

      //linhas horizontais
      this.drawPolyline(map, board[i][0][0], board[i][0][1], board[i][aux][0], board[i][aux][1], colorBoard );

      //linhas verticais
      this.drawPolyline(map, board[0][i][0], board[0][i][1], board[aux][i][0], board[aux][i][1], colorBoard  );

  }
    
    //Eixos X e Y
    for (i = 0; i < board.length; i++) {
      //eixo X
      if (axisY[1][i] == 0 ){
     
       this.drawPolyline(map, axisY[0][i], axisX[0][0], axisY[0][i], axisX[0][aux], colorAxis  );
      }    
      //eixo Y
      if (axisX[1][i] == 0) {
        
        this.drawPolyline(map, axisY[0][0], axisX[0][i], axisY[0][aux], axisX[0][i], colorAxis   );
      }    
    }

    //Escalas dos Eixos
    for (var j = 0; j < board.length; j++) {
      //Escala eixo X
      if (axisY[1][j] == 0) {

        for (i = 0; i < board.length; i++) {
          //adequando valor 0
          if (axisX[1][i] == 0) {
            position = new google.maps.LatLng(axisY[0][j], axisX[0][i]);  
            markerIcon = { url: 'assets/imgs/label.png', labelOrigin: new google.maps.Point(0, 25) };
          }else{
            position = new google.maps.LatLng(axisY[0][j], axisX[0][i]);  
            markerIcon = { url: 'assets/imgs/label.png', labelOrigin: new google.maps.Point(8, 25) };
          }         

          marker = new google.maps.Marker({
            position: position,
            map: map,
            label: { text: axisX[1][i].toString(), color: colorAxis, fontSize: '12px', fontWeight: '475' },
            icon: markerIcon
          });
        }      
      }

      //Escala eixo Y
      if (axisX[1][j] == 0) {
        for (i = 0; i < board.length; i++) {
          if(axisY[1][i] != 0){
            position = new google.maps.LatLng(axisY[0][i], axisX[0][j]);

            marker = new google.maps.Marker({
              position: position,
              map: map,

              label: { text: axisY[1][i].toString(), fontSize: '12px', fontWeight: '475' },
              icon: {url: 'assets/imgs/label.png', labelOrigin: new google.maps.Point(0, 15 ) }
            });
          }
        }
      }
    }

    //Posicionando todos os pontos na tela
    map.fitBounds(edgeBounds, -5);

    //Controle de Zoom mínimo e máximo
    i = 0; //verificar utilização
    google.maps.event.addListener(map, 'idle', function () {
      if(i < 1){
        console.log(map.getZoom());
        map.setOptions({ minZoom: map.getZoom() });
        map.setOptions({ maxZoom: map.getZoom() + 2 })
      }
      i++;      
    });

    //controle de limites da tela
    google.maps.event.addListener(map, 'drag', function () {
      if (edgeBounds.contains(map.getCenter())) {
        return;
      }
      else {
        //map.setCenter(edgeBounds.getCenter());
        map.fitBounds(edgeBounds, -5);
      }
    });

    //fazer switch para alterar figura do barco

    //Platagem Das Embarcações Players
    this.markerBoard(map, coordPlayer1[0], coordPlayer1[1], 'barco1.png', google.maps.Animation.DROP);
    this.markerBoard(map, coordPlayer2[0], coordPlayer2[1], 'barco2.png', google.maps.Animation.DROP);
   
    return  map;

    
  }


}
