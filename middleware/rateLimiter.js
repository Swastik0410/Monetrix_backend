import ratelimit from "../config/upStash.js";
const rateLimiter=async(req,res,next)=>{
    try {
        //production ready applications will have userid or ipaddress as the key
        const {success}=await ratelimit.limit("my-rate-limit")
        if(!success){
            return res.status(429).json({
                message:"Too many requests, please try later"
            })
        }
        next()
    } catch (error) {
        console.log("Rate Limit Error:",error)
        next(error);
    }
}

export default rateLimiter
