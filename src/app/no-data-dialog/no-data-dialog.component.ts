import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-no-data-dialog',
  templateUrl: './no-data-dialog.component.html',
  styleUrls: ['./no-data-dialog.component.css']
})
export class NoDataDialogComponent {

  constructor(public dialogRef: MatDialogRef<NoDataDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}