
const sendToken=async (user , statusCode , res)=>{
    const token=user.getJwtToken();
    const options={
        expires : new Date(Date.now()+90*24*60*60*1000),
        httpOnly:true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",// Critical for cross-origin cookies
        secure: process.env.NODE_ENV === "production" ? true : false,   // Required if sameSite is "none"
    }
    res.status(statusCode).cookie("token" , token , options).json({
        success:true , 
        token , 
        user,
    })
}
module.exports=sendToken;
