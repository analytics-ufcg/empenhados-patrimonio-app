import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class VisPatrimonioService {

  constructor() { }

  // Observable string sources
  private apagaTooltipSource = new Subject<any>();

  // Observable string streams
  apagaTooltipSource_ = this.apagaTooltipSource.asObservable();
  
  apagaTooltip() {
    this.apagaTooltipSource.next();
  }

}
