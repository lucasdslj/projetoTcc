import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

 
  @Input('progress') progress;
  @Input('xpAmount') xpAmount;
  @Input('colorBackground') colorBackground = 'progress-xpBack';
  @Input('colorProgress') colorProgress = 'progress-xp';
  @Input('label') label = 'xp';
  
 

  constructor() {

  }

}