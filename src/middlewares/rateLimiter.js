const client = require("../config/redisClient");

const rateLimiter = (limit, windowSeconds) => {
    return async (req, res, next)=>{
        try{
            const userId = req.user._id;
            console.log(userId);
            const key = `rate_limit:${userId}`;
            
            const requests = await client.incr(key);

            if(requests==1){
                await client.expire(key, windowSeconds);
            }
            if(requests > limit){
                const ttl = await client.ttl(key);
                return res.status(429).send(`Too many requests. Try again in ${ttl}s.`)
            }
            next();
        }
        catch(err){
            console.error("Rate limiter error:", err);
            next();
        }
    }
}

module.exports = rateLimiter;