import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

import { FormBuilder, Validators } from '@angular/forms'
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sign-up-screen',
  templateUrl: 'sign-up-screen.html',
})
export class SignUpScreenPage {

  formSignUp: any;
  formUserName:  any;
  password_type: string = 'password';
  sex: any;
  checkUser_name=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public http: Http, 
    public formBuilder: FormBuilder, private toastCtrl: ToastController, public alertCtrl: AlertController) {

    this.formSignUp = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
     /// nickname: ['', Validators.compose([Validators.minLength(4), Validators.pattern('^[a-zA-Z]+[_A-Za-z0-9-\\+]+'), Validators.required])], 
      email: ['', Validators.compose([Validators.maxLength(70),
      Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
      Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      sex: ['', Validators.compose([Validators.required])],
      
       
    });

    this.formUserName = formBuilder.group({
      user_name: ['', Validators.compose([Validators.minLength(4), Validators.pattern('^[a-zA-Z]+[_A-Za-z0-9-\\+]+'), Validators.required])], 
  

    });
    
    



  }


  
  togglePasswordMode() {
      this.password_type = this.password_type === 'text' ? 'password' : 'text';
      console.log(this.password_type);
    }

  testSeg(sex){
    console.log(sex);
    
  }

  toastMessage(message){
    let toast = this.toastCtrl.create(
      {
        message: message,
        duration: 2000,
      });
    toast.onDidDismiss;
    toast.present();
  }

  alertNetwork(message, title) {
    let alertBattle = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [

        {
          text: 'ok',
          handler: () => {

            
          }
        }
      ]
    });
    alertBattle.present()
  }
  

  verifyNickname(user_name){
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'carregando'
    });
    loading.present();

    //net
    let timeOutNetwork = setTimeout(() => {
      loading.dismiss();
      this.alertNetwork('Problemas com a conexão à internet :(', 'Ohh não!!');

    }, 15000);
   
  
 
    let message:string;
   
    this.http.post('https://battleshiptcc.000webhostapp.com/api/verifyUserName', { user_name }).toPromise().then((response) => {
      let verify = [];
      verify.push(response.json());
      
      if (verify[0] == 'available'){
        clearTimeout(timeOutNetwork);//net
        loading.dismiss();
        message="Nickname Validado!";
        this.checkUser_name=true;

      }else{
        clearTimeout(timeOutNetwork);//net
        loading.dismiss();
        message = "Nickname Indisponível! Tente outro!";
        this.checkUser_name = false;
      }

      this.toastMessage(message);
     
    });
    
  }


  signUp(user_name , name, email, sex, password){
    if(this.checkUser_name == false){
      this.toastMessage('Valide o seu nickname!');

    }else{
      var verify =[];
      let message: string;
      

      let loading = this.loadingCtrl.create({
        spinner: 'dots',
        content: 'carregando'
      });
      loading.present();

      //net
      let timeOutNetwork = setTimeout(() => {
        loading.dismiss();
        this.alertNetwork('Problemas com a conexão à internet :(', 'Ohh não!!');

      }, 15000);
     

      this.http.post('https://battleshiptcc.000webhostapp.com/api/verifyEmail', { user_name, name, email, sex, password }).toPromise().then((response) => {
          verify.push(response.json());
      
      console.log(verify[0]);
      if (verify[0] == 'available') {
        
         
        this.http.post('https://battleshiptcc.000webhostapp.com/api/createNewPlayer', { user_name, name, email, sex, password }).toPromise().then((response) => {

            this.toastMessage('Cadastro realizado com Sucesso! Realize seu login!');
            
              // retornando à página de login            
              
           clearTimeout(timeOutNetwork);//net     
              setTimeout(() => {
                 this.navCtrl.pop();
                  loading.dismiss();
              }, 1000);



          });

      } else {
        clearTimeout(timeOutNetwork);//net
        loading.dismiss();
        this.toastMessage("Email informado já utilizado!");
              
      }
      });


     

      console.log(user_name);
    }
    
    
  }

}
