import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  title = "Capital dos Candidatos";

  constructor(
    //public dialogRef: MatDialogRef<AboutComponent>
  ) { }

  ngOnInit(){
    
  }

  onNoClick(): void {
    //this.dialogRef.close();
  }

}