const ErrorHnadler=require("../utils/ErrorHandler");
module.exports=(err,req,res,next)=>{
err.statusCode=err.statusCode || 500;
err.message=err.message || "Internal Server Error";
  if(err.name==="CastError"){
    const message=`Resource not found with this id ... Invalid ${err.path} `;
    err=new ErrorHnadler(message , 400);

} 
if(err.code===11000){
    const message=`Duplicate ${Object.keys(err.keyValue)} entered`;
    err=new ErrorHnadler(message , 400);
}
if(err.message==="JsonWebTokenError"){
    const message="Your url is invalid please try again letter";
    err=new ErrorHnadler(message , 400);
}
if(err.message==="TokenExpiredError"){
    const message="Your url is expired pleae try again letter";
    err=new ErrorHnadler(message , 400);
}
res.status(err.statusCode).json({
    success:false,
    message:err.message,
})
}