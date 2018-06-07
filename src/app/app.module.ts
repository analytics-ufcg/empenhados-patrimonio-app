import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { GlobalService} from './services/global.service';
import { UtilsService } from './services/utils.service';
import { FilterService } from './services/filter.service';
import { AlertService } from './services/alert.service';

import {
  MatToolbarModule,
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatOptionModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatInputModule,
  MatSnackBarModule,
  MatSlideToggleModule
} from '@angular/material';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { ScatterplotPatrimonioComponent } from './scatterplot-patrimonio/scatterplot-patrimonio.component';


@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    ScatterplotPatrimonioComponent
  ],
  imports: [
    BrowserAnimationsModule,
    
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    HttpClientModule
  ],
  providers: [
    HttpClientModule,
    UtilsService,
    GlobalService,
    FilterService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
