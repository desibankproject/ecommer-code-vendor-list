import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { CookieService } from 'ngx-cookie';
import { User } from 'src/app/model/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public productList:Product[] = [];  
  public itemsInCart = 0;
  public status:String;
  public isUser:boolean;
  public isAdmin:boolean;
  public currentUser:User;
  
  constructor(private shoppingCartService:ShoppingCartService,private _cookieService:CookieService) { }

  ngOnInit() {
    this.status = 'inactive';
    this.isUser = true;
    this.isAdmin = false;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if(this.currentUser != null){
      if(this.currentUser.role=='admin'){
        this.isUser = false;
        this.isAdmin = true;
      }
      this.status = 'active';
    }

    this.shoppingCartService.productObservable.subscribe(
      pProductArray=>{

        //console.log("header update");

        this.itemsInCart = pProductArray.length;

      }
    );

    // Retrieve the object from storage
    //var cartObject = localStorage.getItem('cart');
    //var cartObject = sessionStorage.getItem('cart');
    var cartObject = this._cookieService.getObject("cart");

    //var prodArr = JSON.parse(cartObject);
    var prodArr = [];
    prodArr.push(cartObject);
    
    if(typeof prodArr[0] != 'undefined' ){
      console.log( "header - prodArr[0].length: " );
      console.log( prodArr[0].length );

      this.itemsInCart = prodArr[0].length;
    }
    else{
      this.itemsInCart = 0; 
    }


  }

}
