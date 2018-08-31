import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { GlobalService } from "./services/global.service";
import { RequestService } from "./services/request.service";
import { DataService } from "./services/data.service";
import { UtilsService } from "./services/utils.service";
import { AlertService } from "./services/alert.service";
import { CandidatoService } from "./services/candidato.service";
import { FlexLayoutModule } from "@angular/flex-layout";

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
  MatSlideToggleModule,
  MatDialogModule,
  MatTooltipModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatExpansionModule
} from "@angular/material";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from "./app.component";
import { FilterComponent } from "./filter/filter.component";
import { ScatterplotPatrimonioComponent } from "./scatterplot-patrimonio/scatterplot-patrimonio.component";
import { ResumoCandidatoComponent } from "./resumo-candidato/resumo-candidato.component";
import { JoyplotEstadosComponent } from "./joyplot-estados/joyplot-estados.component";
import { FactSheetComponent } from "./fact-sheet/fact-sheet.component";
import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { ReadmeComponent } from "./readme/readme.component";
import { Top10Component } from "./top-10/top-10.component";

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
    ScatterplotPatrimonioComponent,
    ResumoCandidatoComponent,
    JoyplotEstadosComponent,
    FactSheetComponent,
    AboutComponent,
    HomeComponent,
    ReadmeComponent,
    Top10Component
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
    MatListModule,
    HttpClientModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatExpansionModule
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
  bootstrap: [AppComponent],
  entryComponents: [AboutComponent, ReadmeComponent]
})
export class AppModule {}
