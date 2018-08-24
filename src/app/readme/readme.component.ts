import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-readme",
  templateUrl: "./readme.component.html",
  styleUrls: ["./readme.component.css"]
})
export class ReadmeComponent {
  constructor(public dialogRef: MatDialogRef<ReadmeComponent>) {}

  public moveToStructure(nextStructure):void {
          let element = document.getElementById(nextStructure);            

          element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
          
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
