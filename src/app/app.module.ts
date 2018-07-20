import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { GlobalService} from './services/global.service';
import { RequestService } from './services/request.service';
import { DataService } from './services/data.service';
import { UtilsService } from './services/utils.service';
import { AlertService } from './services/alert.service';
import { CandidatoService } from './services/candidato.service';
import { FlexLayoutModule } from '@angular/flex-layout';


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
  MatListModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatTooltipModule
} from '@angular/material';

import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { ScatterplotPatrimonioComponent } from './scatterplot-patrimonio/scatterplot-patrimonio.component';
import { ResumoCandidatoComponent } from './resumo-candidato/resumo-candidato.component';
import { JoyplotEstadosComponent } from './joyplot-estados/joyplot-estados.component';
import { FactSheetComponent } from './fact-sheet/fact-sheet.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';

import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    ScatterplotPatrimonioComponent,
    ResumoCandidatoComponent,
    JoyplotEstadosComponent,
    FactSheetComponent,
    AboutComponent,
    HomeComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FlexLayoutModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    AppRoutingModule 
  ],
  providers: [
    HttpClientModule,
    RequestService,
    GlobalService,
    DataService,
    UtilsService,
    AlertService,
    CandidatoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
