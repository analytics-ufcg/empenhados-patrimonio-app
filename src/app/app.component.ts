import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { VisPatrimonioService } from './services/vis-patrimonio.service';

import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Capital dos Candidatos';
  
  constructor(public dialog: MatDialog,
              private visPatrimonioService: VisPatrimonioService,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer) {

    this.matIconRegistry.addSvgIcon(
      `facebook`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/facebook-box.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `github`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/github-circle.svg")
    );    
  }

  apagaTooltip() {
    this.visPatrimonioService.apagaTooltip();
  }

}

export class matToolbarRow { }

