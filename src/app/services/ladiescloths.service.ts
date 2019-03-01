import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class LadiesclothsService {

  constructor(private http:HttpClient) { }

  public getladiesclothsProduct():Observable<any>{
   // console.log("from service layer");
    const endpoint=AppConfig.LADIES_CLOTH_ENDPOINT;
    //console.log(endpoint);
    return this.http.get(endpoint);
  }
}
