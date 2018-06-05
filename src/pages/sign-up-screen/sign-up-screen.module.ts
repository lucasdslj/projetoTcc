import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignUpScreenPage } from './sign-up-screen';

@NgModule({
  declarations: [
    SignUpScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(SignUpScreenPage),
  ],
})
export class SignUpScreenPageModule {}
