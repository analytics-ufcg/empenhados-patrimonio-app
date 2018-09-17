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

 getQueryParams() {
   return this.activatedRoute.snapshot.queryParams;
 }
}
