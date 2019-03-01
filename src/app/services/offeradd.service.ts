import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';
@Injectable({
  providedIn: 'root'
})
export class OfferaddService {
  constructor(private http:HttpClient) { }

  public getofferAdd():Observable<any>{
   // console.log("service layer is called for offer add");
    
    const endpoint=AppConfig.OFFERADD_ENDPOINT;
   // console.log("service layer is called");
    //console.log(endpoint);
    return this.http.get(endpoint);
  }
}
