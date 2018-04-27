import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {
  private serverHost: String;

  constructor() {
    this.serverHost = 'http://127.0.0.1:3000/api/';
   }

  public getServerHost() {
    return this.serverHost;
  }

}
