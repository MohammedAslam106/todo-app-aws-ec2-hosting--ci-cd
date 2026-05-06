import { userServices } from "../services/user.service.js";
import { AuthenticatedRequest } from "../types/extends.js";
import { Response } from "express";


export class UserController {
    constructor() {};

    async signUpUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { name, email, password } = req.body;

            const result = await userServices.signUpUser(email, password, name);

            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 3600000 // 7 days
            });

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user: result.user,
                    token: result.token,
                    refreshToken: result.refreshToken
                }
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async loginUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { email, password } = req.body;

            // console.log('cookies', req.cookies);

            const result = await userServices.loginUser(email, password);

            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 3600000 // 7 days
            });

            res.status(200).json({
                success: true,
                message: "User logged in successfully",
                data: {
                    user: result.user,
                    token: result.token,
                    refreshToken: result.refreshToken
                }
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async logoutUserFromSingleDevice(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ success: false, message: "User ID is required" });
                return;
            }

            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                res.status(400).json({ success: false, message: "Refresh token is required" });
                return;
            }

            const result = await userServices.logoutUserFromSingleDevice(userId, refreshToken);

            res.cookie("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(0) // Expire the cookie immediately
            });

            res.cookie("refreshToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(0) // Expire the cookie immediately
            });

            res.status(200).json({
                success: true,
                message: "User logged out successfully",
                data: result
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async logoutUserFromAllDevices(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ success: false, message: "User ID is required" });
                return;
            }

            const result = await userServices.logoutUserFromAllDevices(userId);

            res.cookie("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(0) // Expire the cookie immediately
            });

            res.cookie("refreshToken", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                expires: new Date(0) // Expire the cookie immediately
            });

            res.status(200).json({
                success: true,
                message: "User logged out from all devices successfully",
                data: result
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async renewAccessTokenByProvidingRefreshToken(req: AuthenticatedRequest, res: Response) {
        try {
            // console.log("Token", req.cookies);

            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.status(400).json({ success: false, message: "Refresh token is required" });
                return;
            }

            // const userId = req.user?.id;
            // if (!userId) {
            //     res.status(400).json({ success: false, message: "User ID is required" });
            //     return;
            // }

            const result = await userServices.refreshToken(refreshToken);

            res.cookie("token", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 3600000 // 7 days
            });

            res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                data: {
                    token: result.token,
                    refreshToken: result.refreshToken
                }
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getUserById(req: AuthenticatedRequest, res: Response) {
        try {

            const id = req.user?.id;

            // console.log('User', req.user);

            if(!id) {
                res.status(400).json({ success: false, message: "User ID is required" });
                return;
            }

            const result = await userServices.getUserById(id as string);
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: {
                    name: result.user.name,
                    email: result.user.email,
                    id: result.user.id
                }
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getUserByEmail(req: AuthenticatedRequest, res: Response) {
        try {
            const { email } = req.params;

            if(!email) {
                res.status(400).json({ success: false, message: "User email is required" });
                return;
            }

            const result = await userServices.getUserByEmail(email as string);
            res.status(200).json({
                success: true,
                message: "User retrieved successfully",
                data: result
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateUserById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { email, password, name } = req.body;

            if(!id) {
                res.status(400).json({ success: false, message: "User ID is required" });
                return;
            }

            const result = await userServices.updateUserById(id as string, { email, password, name });
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteUserById(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            if(!id) {
                res.status(400).json({ success: false, message: "User ID is required" });
                return;
            }

            const result = await userServices.deleteUserById(id as string);
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result
            });
        } catch (error:any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export const userController = new UserController();