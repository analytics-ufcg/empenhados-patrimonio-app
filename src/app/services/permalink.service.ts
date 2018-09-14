import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Injectable()
export class PermalinkService {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }


  updateUrlParams(parameter: string, value: any) {
    var queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams[parameter] = value;
    this.router.navigate([], { queryParams: queryParams });
 }

  // private getUrlParams() {
    
  //   var queryParams: Params = this.activatedRoute.snapshot.queryParams;
  //   if (queryParams['cargo']) {
  //     this.onChangeCargo(queryParams['cargo']);
  //   }
  //   if (queryParams['ano']) {
  //     this.onChangeAno(queryParams['ano']);
  //     this.anoSelecionado = queryParams['ano'];
  //   }
  //   if (queryParams['situacao']) {
  //     this.onChangeSituacao(queryParams['situacao']);
  //   }
  //   if (queryParams['estado']) {
  //     this.onChangeEstado(queryParams['estado']);
  //   }
  //   if (queryParams['municipio']) {
  //     this.onChangeMunicipio(queryParams['municipio']);
  //   }    
  // }
}
