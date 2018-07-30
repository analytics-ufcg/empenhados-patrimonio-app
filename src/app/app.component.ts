import { Component} from '@angular/core';
import { MatDialog } from '@angular/material';

import { AboutComponent } from './about/about.component';
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

  openDialog(): void {
    const dialogRef = this.dialog.open(AboutComponent, {
      width: '80%',
      height: '90%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


}

export class matToolbarRow { }

