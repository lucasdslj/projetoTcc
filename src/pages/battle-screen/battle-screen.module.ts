import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BattleScreenPage } from './battle-screen';

@NgModule({
  declarations: [
    BattleScreenPage,
  ],
  imports: [
    IonicPageModule.forChild(BattleScreenPage),
  ],
})
export class BattleScreenPageModule {}
