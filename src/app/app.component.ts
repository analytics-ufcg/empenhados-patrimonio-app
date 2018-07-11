import { Component} from '@angular/core';

import { AboutComponent } from './about/about.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Patrimônios';

  constructor(private router: Router) { }

  openAbout() {
    this.router.navigate(['/sobre']);
  }

}

export class matToolbarRow { }

