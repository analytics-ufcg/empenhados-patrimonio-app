import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-readme",
  templateUrl: "./readme.component.html",
  styleUrls: ["./readme.component.css"]
})
export class ReadmeComponent {
  constructor(public dialogRef: MatDialogRef<ReadmeComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
