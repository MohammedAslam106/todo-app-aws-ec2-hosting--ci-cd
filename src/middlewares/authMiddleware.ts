
import {  Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/extends.js";

export default async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {

        // console.log('Inside the auth middleware');

        const authHeader = req.headers.authorization;

        const cookieToken = req.cookies.token; // This will only work if the server and client are on the same domain or if CORS is properly configured to allow credentials (This is only possible in websites, mobile apps won't pass cookies to the server, they need to store the token in secure storage and send it in the Authorization header)

        // console.log("Cookie token:", cookieToken);

        const token = authHeader ? authHeader.split(" ")[1] : undefined;

        // console.log("Auth header token:", token);
        // console.log("Cookie token:", cookieToken);
        // console.log("Boolean", !token && !cookieToken);

        if (!token && !cookieToken) {
            res.status(401).json({ success: false, message: "Unauthorized Aslam" });
            return;
        }

        const finalToken = token || cookieToken;

        // console.log("Final token:", finalToken);

        jwt.verify(finalToken, process.env.JWT_SECRETE!, (err:any, user:any) => {
            if(err){
                throw Error('Invalid token')
            }

            req.user = user as { id: string; email: string };
            
            next();
        })
    } catch (error:any) {
        res.status(401).json({ success: false, message: error.message || "Unauthorized" });
    }
}
