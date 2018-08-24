import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-readme",
  templateUrl: "./readme.component.html",
  styleUrls: ["./readme.component.css"]
})
export class ReadmeComponent {
  constructor(public dialogRef: MatDialogRef<ReadmeComponent>) {}

  public imageUrlArray = ["assets/img/readme-1.jpg", "assets/img/readme-2.jpg", "assets/img/readme-3.jpg", "assets/img/readme-4.jpg"];

  onNoClick(): void {
    this.dialogRef.close();
  }
}
