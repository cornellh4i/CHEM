import { Request, Response, NextFunction } from "express";
import admin from "firebase-admin";

const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(403).json({ message: "no token provided" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        // attach user info
        (req as any).user = decodedToken;
        return next();

    } catch (error) {
        return res.status(401).json({ message: "unauthorized", error });
    }
    
};

export default auth;