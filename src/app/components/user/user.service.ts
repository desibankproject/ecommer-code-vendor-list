import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/config/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private imageURI:string="";

  //for sharing identity of currentg user
  private user=new Subject<User>();
  public observableUser=this.user.asObservable();

  constructor(private http: HttpClient) { }

  public findAll():Observable<any>{
    const httpOptions = {headers:new HttpHeaders({'Content-Type':'application/json'})};
    const endpoint =AppConfig.ALL_USERS_ENDPOINT;
    // this.imageURI=AppConfig.USERS_IMAGE_ENDPOINT;
    return this.http.get<User[]>(endpoint);
  }
  public findUser(username):Observable<any>{
    const endpoint=AppConfig.USERS_ENDPOINT;
    return this.http.get(endpoint+"?username="+username);
  }
  
  public blockUser(username):Observable<any>{
    const endpoint =AppConfig.BLOCK_USER_ENDPOINT;
    return this.http.put(endpoint+"?username="+username,username);
  }
  public unblockUser(username):Observable<any>{
    const endpoint =AppConfig.UNBLOCK_USER_ENDPOINT;
    return this.http.put(endpoint+"?username="+username,username);
  }
  public editUser(username):Observable<any>{
    const endpoint =AppConfig.EDIT_USER_ENDPOINT;
    return this.http.put(endpoint+"?username="+username,username);
  }
  public deleteUser(username):Observable<any>{
    const endpoint =AppConfig.DELETE_USER_ENDPOINT;
    return this.http.delete(endpoint+"?username="+username);
  }

    //Terry service for informing current user
    public addShareUser(user):void{
      this.user.next(user);
      //this.movie.complete();
    }

}
