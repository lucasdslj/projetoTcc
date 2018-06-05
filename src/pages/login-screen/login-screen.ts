import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms'

//pages

import { SignUpScreenPage } from '../sign-up-screen/sign-up-screen';
import {HomePage} from '../home/home';

import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-login-screen',
  templateUrl: 'login-screen.html',
})
export class LoginScreenPage {

  email: any;
  password: any;
  formLogin: any;
  userData= [];
  
  alert:any; //sem uso
  aux = false; // auxilio desenvolvimento

  private url ='http://localhost:8000/api/login';
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public formBuilder: FormBuilder,
    private toastCtrl: ToastController, public storage: Storage) {

    this.formLogin = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(70), 
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'),
         Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });



  }

  //pages
  signUpScreenPage = SignUpScreenPage;
  homePage = HomePage;

  authenticateLogin(email, password) {

    this.http.post(this.url, {email, password}).toPromise().then((response) =>{
      this.userData.push(response.json());

      if(this.userData[0] != "err"){
        let toast = this.toastCtrl.create(
          {
            message: 'Usuário logado com sucesso!',
            duration: 2000,
          });
        toast.onDidDismiss;
        toast.present();
        this.storage.ready().then(() => {
        });

        this.userData = this.userData[0];

       // console.log(this.userData[0].user_name);
        //this.storage.remove('user_name');
        let nick_name = this.userData[0].user_name + '';
        this.storage.set('user_name', nick_name );
       
        
        
       
        this.navCtrl.setRoot(this.homePage);

      }else{
        this.userData=[];
       
        let toast = this.toastCtrl.create(
          {
            message: 'Email ou Senha incorreto!!',
            duration: 2000,
          });
        toast.onDidDismiss;
        toast.present();
        

        console.log("No");
      }
     // this.userData = this.userData[0];
    //  
     // console.log(this.userData);
    });
   
   

    
   
  }

  signUpScreenOn(){
    this.navCtrl.push(SignUpScreenPage);
  }

}
