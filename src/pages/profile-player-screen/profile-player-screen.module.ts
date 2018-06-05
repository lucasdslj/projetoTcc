import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePlayerScreenPage } from './profile-player-screen';

@NgModule({
  declarations: [
    ProfilePlayerScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePlayerScreenPage),
  ],
})
export class ProfilePlayerScreenPageModule {}
