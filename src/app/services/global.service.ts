import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class GlobalService {
  private serverHost: String;

  constructor() {
    this.serverHost = environment.api;
   }

  public getServerHost() {
    return this.serverHost;
  }

}
