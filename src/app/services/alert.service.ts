import { Component, Inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition} from '@angular/material';

@Injectable()
export class AlertService {

  constructor(public snackBar: MatSnackBar) { }

  public openSnackBar(message: string, action: string) {

    let verticalPosition : MatSnackBarVerticalPosition = "top";
    let horizontalPosition :  MatSnackBarHorizontalPosition = "center";
    this.snackBar.open(message, action, {
      duration: 3000, verticalPosition: verticalPosition, horizontalPosition: horizontalPosition
    });
  }
}

