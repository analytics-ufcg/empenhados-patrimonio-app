import { Component} from '@angular/core';
import { MatDialog } from '@angular/material';

import { AboutComponent } from './about/about.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Capital dos Candidatos';

  constructor(public dialog: MatDialog) { }

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

