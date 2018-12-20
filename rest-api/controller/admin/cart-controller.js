fs = require('fs')
var ProductEntity=require('../../model/product-entity')
//var CustomerEntity=require('../../model/customer-entity')
var SaveLaterEntity=require('../../model/savelater-entity')
var WishListEntity=require('../../model/wishlist-entity')
var ImageFolderPath = require('../../config/image-folder-path')
var randomstring = require("randomstring");

 module.exports.findProducts=(req,res)=> {
   console.log("@@@@@@@@@@@product@@@@@@@@@@@@@@");
   ProductEntity.find({},function(err,data){
          console.log(data);
          res.status(200).json(data);
   });

}

module.exports.findProductsByIds=(req,res)=> {
   var productIds = req.body.pids;

   console.log("Find Products By Ids:");
   console.log(productIds);

   var arrayPIDs = productIds.split(',');

   console.log("arrayPIDs");
   console.log(arrayPIDs);

   /*
         $in: [   
          '5bff6a1f56ffe310f8240b2a',
          '5bfc5d405f32c61bf86070e1'   
         ]          
   */

   ProductEntity.find({
      '_id': { 
         
         $in: arrayPIDs
         
      }
   }, function(err, data){
      if(err){
         //logger.log('error', err);
         res.status(200).json("Failure: " + err);
      }
      console.log(data);
      res.status(200).json(data);
   });
}


module.exports.getImage = (req,res) =>{
   console.log('its routing');
   var url = req.params.imageUrl;
   var imagePath = appRoot  + "/" +  ImageFolderPath.PRODUCTS_IMAGES +"/" + url;
   fs.readFile(imagePath,(err,data)=>{
      
      if (err){
         console.log(err)
         return res.status(500).json({status:"fail",message:"Sorry!! image not found"});
      }
      res.writeHead(200,{'Content-Type':'image/jpeg'});
      res.end(data);
   });
}


module.exports.findSaveForLaterLists=(req,res)=> {
   console.log("@@@@@@@@@@@ Save For Later Lists: @@@@@@@@@@@@@@");
   SaveLaterEntity.find({},function(err,data){
          console.log(data);
          res.status(200).json(data);
   });

}

module.exports.editSaveLaterList = (req,res)=>{

   var saveLater = req.body;

   console.log("editSaveLaterList");
   console.log(saveLater);   

   var saveLaterEntity = new SaveLaterEntity();

   var newProducts = req.body.products;

   for (key in saveLater){
      saveLaterEntity[key] = saveLater[key];
   }   

   console.log("sl cid:");
   console.log(saveLater.cid);

   console.log("newProducts:");
   console.log(newProducts);

   SaveLaterEntity.findOneAndUpdate(
      
      saveLater.cid, 

      { $set: { 
                  products : newProducts
      }}
      ,

      {new: true},
      
      (err,data)=>{

         if(err){
            return res.status(200).send({
               status:"fail",
               message: "EditSaveForLater List failed! " + err 
         });
         }

      return res.status(200).json(data);
   });
}

module.exports.getSaveLaterList = (req,res)=>{
   var cid = req.params.cid;
   console.log("getSaveLaterList");
   console.log(cid);
   SaveLaterEntity.find({cid:cid}, (err,data)=>{
      if(err){
         return res.status(404).send({
            status:"fail",
            message: "SaveForLater List not found with sid " + sid
        });
      }

      return res.status(200).json(data);
   });
}

module.exports.postSaveLater =(req,res)=>{
   var saveLater = req.body;
   var saveLaterEntity = new SaveLaterEntity();

   for (key in saveLater){
      saveLaterEntity[key] = saveLater[key];
   }

   saveLaterEntity['sid'] = randomstring.generate(7);

   console.log("postSaveLater called");

    saveLaterEntity.save(err =>{
        if(err){
            console.log(err);
            return res.status(200).json({status:"fail",message:"couldn't save save for later to database"});
        }else{
            return res.status(200).json({status:"success",message:"save for later sucessfully saved"})
        }
    });

}

/********************* WISH LIST *******************************/

module.exports.findWishLists=(req,res)=> {
   console.log("@@@@@@@@@@@ Wish Lists: @@@@@@@@@@@@@@");
   WishListEntity.find({},function(err,data){
          console.log(data);
          res.status(200).json(data);
   });

}

module.exports.editWishList = (req,res)=>{

   var wishList = req.body;

   console.log("editWishList");
   console.log(wishList);   

   var wishListEntity = new WishListEntity();

   var newProducts = req.body.products;

   for (key in wishList){
      wishListEntity[key] = wishList[key];
   }   

   console.log("sl cid:");
   console.log(wishList.cid);

   console.log("newProducts:");
   console.log(newProducts);

   WishListEntity.findOneAndUpdate(
      
      wishList.cid, 

      { $set: { 
                  products : newProducts
      }}
      ,

      {new: true},
      
      (err,data)=>{

         if(err){
            return res.status(200).send({
               status:"fail",
               message: "EditWishList List failed! " + err 
         });
         }

      return res.status(200).json(data);
   });
}

module.exports.postWishList =(req,res)=>{
   var wishList = req.body;
   var wishListEntity = new WishListEntity();

   for (key in wishList){
      wishListEntity[key] = wishList[key];
   }

    wishListEntity.save(err =>{
        if(err){
            console.log(err);
            return res.status(200).json({status:"fail",message:"couldn't save wishlist to database"});
        }else{
            return res.status(200).json({status:"success",message:"wishlist sucessfully saved"})
        }
    });

}

module.exports.getWishList = (req,res)=>{
   var cid = req.params.cid;
   console.log("getWishList");
   console.log(cid);
   WishListEntity.find({cid:cid}, (err,data)=>{
      if(err){
         return res.status(404).send({
            status:"fail",
            message: "WishList not found with cid " + cid
        });
      }

      return res.status(200).json(data);
   });
}


module.exports.getProduct = (req,res)=>{
   var pid = req.params.pid;
   ProductEntity.find({pid:pid}, (err,data)=>{
      if(err){
         return res.status(404).send({
            status:"fail",
            message: "Product not found with pid " + pid
        });
      }

      return res.status(200).json(data);
   });
}