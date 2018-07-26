import { Component} from '@angular/core';

import { AboutComponent } from './about/about.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Capital dos Candidatos';

  constructor() { }

  openAbout() {
    console.log("SOBRE");
  }

}

export class matToolbarRow { }

