import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  title = "Capital dos Candidatos";

  constructor(
    public dialogRef: MatDialogRef<AboutComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}