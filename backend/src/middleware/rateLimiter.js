import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    const { success, limit, remaining, reset } = await rateLimit.limit("my-rate-limit");
    try {
        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later" });
        }
        next();
    } catch (error) {
        console.error("rateLimiter error", error);
        next(error); 
    }

    
    
};

export default rateLimiter;