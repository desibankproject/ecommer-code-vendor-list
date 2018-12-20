import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product';
import { CookieService } from 'ngx-cookie';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { SavelaterService } from 'src/app/services/savelater.service';
import { SaveLater } from 'src/app/model/savelater';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/config/app.config';
import { WishList } from 'src/app/model/wishlist';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public productList:Product[] = [];
  public saveForLaterList:Product[] = [];
  private total:number = 0;
  private needsSaveForLaterList = false;
  private needsWishList = false;

  public url = AppConfig.BASE_ENDPOINT;   

  constructor(private _cookieService:CookieService, 
    private shoppingCartService:ShoppingCartService, 
    private saveLaterService:SavelaterService, 
	private wishlistService:WishlistService, 
    private productService:ProductService, 
    private router: Router) { }

  ngOnInit() {

    // Retrieve the object from storage
    //var cartObject = localStorage.getItem('cart');

    // Retrieve the object from session storage
    //var cartObject = sessionStorage.getItem('cart');

    //Retrieve the object from cookie 
    var cartObject = this._cookieService.getObject("cart");

    console.log("Scart getObject:");
    console.log(cartObject);

    var prodArr = [];
    prodArr.push(cartObject);

    //var prodArr = JSON.parse(cartObject);
    //var prodArr = [];

    //console.log("cart:" + JSON.stringify(prodArr)); 

    //console.log('UpdateCart() - cartObject: ' + JSON.stringify(prodArr[0]) );
    //console.log('UpdateCart() - cartObject 2: ' + JSON.stringify(prodArr[0][0]) );

    //this.productList.push( prodArr[0][0] );

    //console.log(this.productList);

    this.productList = [];


    var testProd:Product = new Product();

    //prodArr[0].forEach( (p) => {

    if(typeof prodArr[0] != 'undefined' ){
      prodArr[0].forEach( (p) => {

        testProd = new Product();

        console.log("p:");
        console.log(p);
        console.log("stringify p:");
        console.log(JSON.stringify(p));

        //alert(p.title);
        /*
        testProd.pid = p.pid;
        testProd.title = p.title;
        testProd.price = p.price;
        testProd.sprice = p.sprice;
        testProd.imageURL = p.imageURL;

        console.log("forEach - title: " + p.title);

        console.log("test prod:");
        console.log(testProd);
        */
        testProd = p;

        var myProp = 'qty';
        if(testProd.hasOwnProperty(myProp)){
            //alert("yes, i have that property");
            console.log("qty property exists");
        }      
        else{
          testProd.qty = 1;
        }

        testProd.itemPriceTotal = testProd.price;
        this.total += testProd.price;
        this.total = +this.total.toFixed(2);

        console.log("new item");
        this.productList.push(testProd); 


      });
    }      

    // Done loading the items in the cart from cookies

    // Now load the Save For Later items from db
    var testSaveLater:SaveLater = new SaveLater();
    testSaveLater.cid = "C100"; // dummy customer id for now

    this.saveLaterService.findSaveForLaterByCid(testSaveLater.cid).subscribe(data =>{

      console.log("Now to init load the SFL from db");

      console.log("["+data[0].products[0]+"]");
      if( data[0].products[0] == ""){
        console.log("save for later list is blank!!!");
      }
      else{	  
	  
		  // get the pids from the SFL list in products[]

		  //this.productService.test(data[0].products[0]);

		  this.productService.getProductByMultipleIds(data[0].products[0]).subscribe(data =>{
			console.log("returned data from get Product By Multiple Ids:")
			console.log(data);

			if(data && data.body && data.body[0] && data.body[0] != ""){

			  console.log("data.body[0]");
			  console.log( JSON.parse(data.body) );

			  var arrayOfProducts = JSON.parse(data.body);

			  arrayOfProducts.forEach( (p) => {

				testProd = new Product();
		  
				console.log("p:");
				console.log(p);
				console.log("stringify p:");
				console.log(JSON.stringify(p));

				testProd = p;

				console.log("get Prod By Mult - testProd");
				console.log(testProd);

				this.saveForLaterList.push(testProd);
			  });
			}else{
			  console.log("data was null !");
			}


			//this.saveForLaterList.push(data);
		  });
		  
      }
	  
	  
      // push each product into SFL area
      /*
      this.productService.getProductByPid("5bff6a1f56ffe310f8240b2a").subscribe(data =>{
        console.log("product:");
        console.log(data);

        this.saveForLaterList.push(data[0]);
        //this.productList.push(data[0]);
      });
      */


    });

  }

  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
  }

  removeItem(item, index){

    console.log(item);
    console.log("index is: "+ index);

    //this.shoppingCartService.removeProductFromCart(item, index);

    this.total = this.total - (item.price * item.qty);
    this.total = +this.total.toFixed(2);
    this.productList.splice(index, 1);
  }

  minus(item, i){
    console.log(i);
    console.log(item);

    if(item.qty > 1){

      item.qty--;
      console.log(item);
      item.itemPriceTotal = item.price * item.qty;
      if(item.itemPriceTotal < item.price) item.itemPriceTotal = item.price;
      this.total -= item.price;
      this.total = +this.total.toFixed(2);

    }
  }

  plus(item, i){
    console.log(i);
    console.log(item);
    item.qty++;
    console.log(item);
    item.itemPriceTotal = item.price * item.qty;
    if(item.itemPriceTotal < item.price) item.itemPriceTotal = item.price;
    this.total += item.price;
    this.total = +this.total.toFixed(2);
  }

  uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
  }   

  removeStrFromCSV(list, value) {
    var separator = ",";
    var values = list.split(separator);
    for(var i = 0 ; i < values.length ; i++) {
      if(values[i] == value) {
        values.splice(i, 1);
        return values.join(separator);
      }
    }
    return list;
  }

  checkOut(aProducts){
    console.log("checkOut");
    console.log(aProducts);
    //alert("checking out...");
    // save all products inside 'productList' into cookie named 'checkoutCart'
    this.shoppingCartService.saveCheckoutProducts(aProducts);
    this.router.navigate(['checkout']);
  }

  addToCartFromSaveForLater(item, index){
    alert("add back to cart from Save For Later Area !");

    // imageUrl into imageURL
    item.imageURL = item.imageUrl;

    // set initial value for item Price Total
    item.itemPriceTotal = item.price
    item.qty = 1;
    this.total += item.price;
    this.total = +this.total.toFixed(2);

    console.log("add to cart from save for later:");
    console.log(item);

    this.productList.push(item);
  }
  
  removeFromSaveForLater(item, index){
    console.log("remove from save for later");
    console.log(item);
    console.log(item._id);

    // remove this from the SFL list for this current customer

    var testSaveLater:SaveLater = new SaveLater();
    testSaveLater.cid = "C100"; // dummy customer id for now

    this.saveLaterService.findSaveForLaterByCid(testSaveLater.cid).subscribe(data =>{


      console.log("data[0].products");
      console.log(data[0].products);

      console.log("data[0].products[0]");
      console.log(data[0].products[0]);

      // get existing product id list
      testSaveLater.products = data[0].products;

      console.log("item _id: "+ item._id);

      // now to remove it

      var removedList = this.removeStrFromCSV( testSaveLater.products[0] , item._id);

      console.log("removed list:");
      console.log(removedList);

      testSaveLater.products = [];
      testSaveLater.products.push(removedList);

      console.log(testSaveLater.products);

      // Save the updated SFL list into the db

        // public editSaveForLater(saveLater:SaveLater,id)
        this.saveLaterService.editSaveForLater(testSaveLater, testSaveLater.cid).subscribe(data =>{
          if(data.status== "success"){
            console.log('Remove SFL item - edit SaveLater successfull - SFL List edited!');
                    
          }else{
            console.log("Remove SFL item - edit SaveLater failed:");
            console.log(data);
          }
        });

            // now remove it from the SFL list
            console.log("index: " + index);

            this.saveForLaterList.splice(index, 1);        


    });

  } 

  addToSaveForLater(item){
    console.log("addToSaveForLater:");
    console.log(item); 

    this.saveLaterService.findSaveForLaterLists().subscribe(data =>{
      console.log("find save for later lists() :");
      console.log(data);
    });    

    var testSaveLater:SaveLater = new SaveLater();

    this.needsSaveForLaterList = false;

    // get customer id , cid , check if we have a SaveForLater List for this cid
    // if we get back an empty array [] , then this customer doesnt have SFL list yet
    testSaveLater.cid = "C100"; // dummy customer id for now
    this.saveLaterService.findSaveForLaterByCid(testSaveLater.cid).subscribe(data =>{

        console.log("sfl:");
        console.log(data);
        console.log(data[0]);
        console.log( (<any>data).length ); // display # of items, prevent length doesnt exist err

        if( (<any>data).length == 0){
          console.log("sfl empty!");
          this.needsSaveForLaterList = true;

          console.log("Need SFL? " + this.needsSaveForLaterList);

            // create SFL for this customer if it doesnt exist yet

            console.log(item._id);

            var testSaveLater:SaveLater = new SaveLater();

            testSaveLater.products = [];
          
            testSaveLater.cid = "C100"; // dummy customer id for now
            testSaveLater.products.push( item._id ); // the pid for this product 

            this.saveLaterService.addSaveLater(testSaveLater).subscribe(data =>{
              if(data.status== "success"){
                console.log('save addSaveLater successfull - SFL List created!');
              }else{
                console.log("addSaveLater failed:");
                console.log(data);
              }
            });     

        }
        else{

          console.log("sfl already exists");

          // else update the existing SFL list   
          var testSaveLater:SaveLater = new SaveLater();
          testSaveLater.products = [];

          // get existing SFL products and put into testSaveLater
          console.log("data[0].products");
          console.log(data[0].products);

          console.log("data[0].products[0]");
          console.log(data[0].products[0]);

          // push array values into array
          //testSaveLater.products.concat( data[0].products );
            
          testSaveLater.cid = "C100"; // dummy customer id for now
          //testSaveLater.products.push( item._id ); // the pid for this product 

          console.log("item _id: " + item._id);

          if(data[0].products.length != 0 && data[0].products != ""){
            console.log("sfl products not empty, get existing products");
            testSaveLater.products = data[0].products;
          }
          // check if item._id already exists in the list

          if( data[0].products[0].indexOf(item._id) !== -1 ){
          //if( data[0].products.includes(item._id) ){
            console.log("item._id already exists");
          }
          else{
            console.log("item._id isnt in there yet");
            testSaveLater.products.push(item._id);
          }
          
          console.log("pre uniq");
          console.log(testSaveLater.products);

          testSaveLater.products = this.uniq(testSaveLater.products);

          console.log("post uniq");
          console.log(testSaveLater.products);

          console.log("Edit save for later - product id array:");
          console.log(testSaveLater.products);

          // public editSaveForLater(saveLater:SaveLater,id)
          this.saveLaterService.editSaveForLater(testSaveLater, testSaveLater.cid).subscribe(data =>{
            if(data.status== "success"){
              console.log('edit SaveLater successfull - SFL List edited!');
            }else{
              console.log("edit SaveLater failed:");
              console.log(data);
            }
          });


        }

        // display this item in the SFL area
        // get product info from the pid, ex: 5bff6a1f56ffe310f8240b2a
        
        console.log("item._id");
        console.log(item._id);

        if( data[0].products[0].indexOf(item._id) !== -1 ){
          //if( data[0].products.includes(item._id) ){
            console.log("item._id already exists, do not push into SFL area");
        }
        else{
          console.log("item._id isnt in there yet, push into SFL area");

          //this.productService.getProductByPid("5bff6a1f56ffe310f8240b2a").subscribe(data =>{
          this.productService.getProductByPid(item.pid).subscribe(data =>{
            console.log("product:");
            console.log(data);
	
            if(data && data[0]){	
				this.saveForLaterList.push(data[0]);
				//this.productList.push(data[0]);
            }
            else{
              console.log("data was empty for some reason!");
            }				
			
          });
        }
                


    }); 

    



  }

  
  

  addToWishListFromSaveForLater(item){
    console.log(item);

    var wishlist:WishList = new WishList();

    this.needsWishList = false;

    // get customer id , cid , check if we have a SaveForLater List for this cid
    // if we get back an empty array [] , then this customer doesnt have SFL list yet
    wishlist.cid = "C100"; // dummy customer id for now

    this.wishlistService.findWishLists().subscribe(data =>{
      console.log(data);
    });
    
    this.wishlistService.findWishListByCid(wishlist.cid).subscribe(data =>{

        console.log("wl:");
        console.log(data);
        console.log(data[0]);
        console.log( (<any>data).length ); // display # of items, prevent length doesnt exist err
    
        if( (<any>data).length == 0){
          console.log("wishlist empty!");
          this.needsWishList = true;

          console.log("Need Wishlist? " + this.needsWishList);

            // create Wishlist for this customer if it doesnt exist yet

            console.log(item._id);

            var wishListItem:WishList = new WishList();

            wishListItem.products = [];
          
            wishListItem.cid = "C100"; // dummy customer id for now
            wishListItem.wid = "W"+item._id;
            wishListItem.products.push( item._id ); // the pid for this product 

            this.wishlistService.addWishList(wishListItem).subscribe(data =>{
              if(data.status== "success"){
                console.log('save addWishList successfull - Wish List created!');
              }else{
                console.log("addWishList failed:");
                console.log(data);
              }
            });     

        }
        else{

          console.log("wish list already exists");

          // else update the existing SFL list   
          var wishListItem:WishList = new WishList();
          wishListItem.products = [];

          // get existing SFL products and put into wishListItem
          console.log("data[0].products");
          console.log(data[0].products);

          console.log("data[0].products[0]");
          console.log(data[0].products[0]);

          // push array values into array
          //wishListItem.products.concat( data[0].products );
            
          wishListItem.cid = "C100"; // dummy customer id for now
          //wishListItem.products.push( item._id ); // the pid for this product 

          console.log("item _id: " + item._id);

          if(data[0].products.length != 0 && data[0].products != ""){
            console.log("wish list products not empty, get existing products");
            wishListItem.products = data[0].products;
          }
          // check if item._id already exists in the list

          if( data[0].products[0].indexOf(item._id) !== -1 ){
          //if( data[0].products.includes(item._id) ){
            console.log("item._id already exists");
          }
          else{
            console.log("item._id isnt in there yet");
            wishListItem.products.push(item._id);
          }
          
          console.log("pre uniq");
          console.log(wishListItem.products);

          wishListItem.products = this.uniq(wishListItem.products);

          console.log("post uniq");
          console.log(wishListItem.products);

          console.log("Edit save wish list - product id array:");
          console.log(wishListItem.products);

          // public editSaveForLater(saveLater:SaveLater,id)
          this.wishlistService.editWishList(wishListItem, wishListItem.cid).subscribe(data =>{
            if(data.status== "success"){
              console.log('edit Wish List successfull - Wish List edited!');
            }else{
              console.log("edit Wish List failed:");
              console.log(data);
            }
          });


        }


    });


  }
  
  
  

}
