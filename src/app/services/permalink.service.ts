import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataService } from "./data.service";

@Injectable()
export class PermalinkService {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }


  async updateUrlParams(parameter: string, value: any) {
    var queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams[parameter] = value;
    queryParams = this.parseFiltersToURL(queryParams);  
    await this.router.navigate([], { queryParams: queryParams });
 }

  getQueryParams() {
    var queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    return this.parseURLToFilters(queryParams);    
  }

  async updateAllUrlParams(queryParams: Params) {
    await this.router.navigate([], {queryParams});

  }

  private parseFiltersToURL(queryParams) {    
    Object.keys(queryParams).map(function(key, index) {   
      var parameter = queryParams[key];
      
      if (typeof parameter === "string" && !["municipio"].includes(key)) {          
        queryParams[key] = parameter.split(' ').join('-').toLowerCase();       
      }  
    });
        
    if (queryParams["municipio"]) {
      queryParams["municipio"] = queryParams["municipio"].split(' ').join('-')
    }
    
    return queryParams;
  }

  private parseURLToFilters(queryParams) {  
    Object.keys(queryParams).map(function(key, index) {   
      var parameter = queryParams[key];
      if (typeof parameter === "string" && !["municipio"].includes(key)) {          
        queryParams[key] = parameter.split('-').join(' ').toUpperCase();      
      }  
    });
    
    // Caso especial para situação. Deve ser lowercase
    if (queryParams["situacao"] === this.dataService.getTodasSituacoes().toUpperCase()) {
      queryParams["situacao"] = this.dataService.getTodasSituacoes();
    }

    // Caso especial para o estado. Deve ser lowercase
    if (queryParams["estado"] ===  this.dataService.getTodosEstados().toUpperCase()) {
      queryParams["estado"] = this.dataService.getTodosEstados();
    }

    if (queryParams["municipio"]) {
      queryParams["municipio"] = queryParams["municipio"].split('-').join(' ')
    }
  
    return queryParams;
  }
}
