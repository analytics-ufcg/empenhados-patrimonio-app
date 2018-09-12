import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { RouteTestComponent } from "./route-test/route-test.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "roteamento", component: RouteTestComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
