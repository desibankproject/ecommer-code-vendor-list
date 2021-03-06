fs=require('fs');

var FeaturedEntity=require('../../model/featured-entity')
var ImageFolderPath=require('../../config/image-folder-path')

module.exports.getFeaturedProduct=(req,res)=>{
  //var ppid=req.query.pid;
  FeaturedEntity.find({ },(err,data)=>{
    if(!err){
      console.log(data);
      return res.status(200).json(data);
    }else{
      return res.status(400).send({
        status:"fail",
        message:"not found " +ppid
      });
    }
  });
}

module.exports.getProductRating = (req,res)=>{
  var pid = req.params.pid;
  ReviewEntity.find({pid:pid}, 'rating' ,(err,data)=>{
     var rating = 0;
     if(data.length>0){
        for(var i = 0; i< data.length;i++){
           rating = rating + data[i].rating;
        }
        rating = rating /data.length;
     }

     console.log(rating);
     if(err){
        return res.status(404).send({
           status:"fail",
           message: "Product not found with pid " + pid
       });
     }
     return res.status(200).json(rating);
  });
}



module.exports.save =(req,res)=>{
    console.log("save the feature details in db");
     var featured = req.body;
    console.log(featured);
var featuredEntity=new FeaturedEntity();
let pphoto=req.files.photo;
var imgtxt=pphoto.name.substring(pphoto.name.length-4);
var pphotoName=featured.pid+" "+imgtxt;
featuredEntity.imageUrl=pphotoName;
console.log(appRoot+"/"+featuredEntity.imageUrl);
pphoto.mv(appRoot+"/"+ImageFolderPath.FEATURED_IMAGES+"/"+featuredEntity.imageUrl,function(err){
  if(err){
    console.log("err");
    return res.status(500).json({status:"fail",message:"images are not saved"})
  }
  else{
    featuredEntity.userid=featured.userid;
featuredEntity.save(err=>{
      if(err){
          console.log(err);
          res.status(200).json({status:"fail",message:"Sorry!!  not able to  save in database"}); 
      }else{
         res.status(200).json({status:"success",message:"saved in database"}); 
      }
  });

}
      });
    }

