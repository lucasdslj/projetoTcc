import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

import { FormBuilder, Validators } from '@angular/forms'
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-sign-up-screen',
  templateUrl: 'sign-up-screen.html',
})
export class SignUpScreenPage {

  formSignUp: any;
  formUserName:  any;
  password_type: string = 'password';
  url: string;
  sex: any;
  checkUser_name=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public formBuilder: FormBuilder,
    private toastCtrl: ToastController) {

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

  verifyNickname(user_name){

  

    let message:string;
    this.url ="http://localhost:8000/api/verifyUserName"
    this.http.post(this.url, { user_name }).toPromise().then((response) => {
      let verify = [];
      verify.push(response.json());
      
      if (verify[0] == 'available'){
        message="Nickname Validado!";
        this.checkUser_name=true;

      }else{
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
      this.url = 'http://localhost:8000/api/verifyEmail';

      this.http.post(this.url, { user_name, name, email, sex, password }).toPromise().then((response) => {
          verify.push(response.json());
      
      console.log(verify[0]);
      if (verify[0] == 'available') {
         this.url = 'http://localhost:8000/api/createNewPlayer';
         this.http.post(this.url, { user_name, name, email, sex, password }).toPromise().then((response) => {
            this.toastMessage('Cadastro realizado com Sucesso!');
             setTimeout(() => {
              this.navCtrl.pop();
              }, 2000);

          });

      } else {
        this.toastMessage("Email informado já utilizado!");
              
      }
      });


     

      console.log(user_name);
    }
    
    
  }

}


/*<ion-item >
  <ion-label color = "primary" > Sexo < /ion-label>
    < /ion-item>


    < ion - segment >

    <ion-segment - button value = "masculino" checked >
      Masculino
      < /ion-segment-button>
      < ion - segment - button value = "feminino" >
        Feminino
        < /ion-segment-button>

        < /ion-segment>

        < /ion-row>*/