import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppConfig} from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class BestsellerService {

  constructor(private http:HttpClient) { }

  public getbestsellerProduct():Observable<any>{
    //console.log("from best seller service layer");
    const endpoint=AppConfig.BESTSELLER_ENDPOINT;
    //console.log(endpoint);
    return this.http.get(endpoint);
  }

  public getRateing(pid:string):Observable<number>{
    const endpoint = AppConfig.PRODUCT_ENDPOINT + '/' + pid + '/rating';
    return this.http.get<number>(endpoint);
  }
}



