import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { GlobalService} from './services/global.service';
import { UtilsService } from './services/utils.service';

import {
  MatToolbarModule,
  MatTabsModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatOptionModule,
  MatSelectModule
} from '@angular/material';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';


@NgModule({
  declarations: [
    AppComponent,
    FilterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    HttpClientModule
  ],
  providers: [
    HttpClientModule,
    UtilsService,
    GlobalService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
