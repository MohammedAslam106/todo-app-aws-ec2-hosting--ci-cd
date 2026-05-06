import { and, eq } from "drizzle-orm";
import { db } from "../db/connection.js";
import { userTable } from "../db/schemas/user.schema.js";
import bcrypt from "bcrypt";
import { email } from "zod/v4/mini";
import jwt from "jsonwebtoken";
import { refreshTokenTable } from "../db/schemas/refresh-token.schema.js";


export class UserServices {
    constructor() {};

    async signUpUser(email: string, password: string, name: string) {
        try {
            const existingUser = await this.getUserByEmail(email);
            if (existingUser) {
                throw new Error("User with this email already exists");
            }

            // Hash the password before storing (you can use bcrypt or any hashing library)
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await db.insert(userTable).values({
                email,
                password: hashedPassword,
                name
            }).returning();

            const accessToken = await this.generateToken({ id: newUser[0].id, email: newUser[0].email }, '15m');

            const refreshToken = await this.generateToken({ id: newUser[0].id, email: newUser[0].email }, '7d');

            await this.storeRefreshToken(newUser[0].id, refreshToken);

            return {
                success: true,
                message: "User registered successfully",
                user: {
                    id: newUser[0].id,
                    email: newUser[0].email,
                    name: newUser[0].name
                },
                token: accessToken,
                refreshToken
            }

        } catch (error:any) {
            throw new Error(error.message || "Error registering user");
        }
    }

    async loginUser(email: string, password: string) {
        try {
            const user = await this.getUserByEmail(email);
            if (!user) {
                throw new Error("Invalid email or password");
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new Error("Invalid email or password");
            }

            const accessToken = await this.generateToken({ id: user.id, email: user.email }, '15m');
            const refreshToken = await this.generateToken({ id: user.id, email: user.email }, '7d');

            await this.storeRefreshToken(user.id, refreshToken);

            return {
                success: true,
                message: "User logged in successfully",
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                },
                token: accessToken,
                refreshToken
            }
        } catch (error:any) {
            throw new Error(error.message || "Error logging in user");
        }
    }

    async logoutUserFromSingleDevice(userId: string, refreshToken: string) {
        try {
            // Delete the refresh token from the database
            // NOTE: We are logging out the user from a particular device/session by deleting the specific refresh token, if you want to log out the user from all devices/sessions, you can delete all refresh tokens associated with the userId
            await db.delete(refreshTokenTable).where(and(eq(refreshTokenTable.userId, userId), eq(refreshTokenTable.refreshToken, refreshToken))); 
            return {
                success: true,
                message: "User logged out successfully"
            }
        } catch (error:any) {
            throw new Error(error.message || "Error logging out user");
        }
    }

    async logoutUserFromAllDevices(userId: string) {
        try {
            // Delete all refresh tokens associated with the userId to log out from all devices/sessions
            await db.delete(refreshTokenTable).where(eq(refreshTokenTable.userId, userId));
            return {
                success: true,
                message: "User logged out from all devices successfully"
            }
        } catch (error:any) {
            throw new Error(error.message || "Error logging out user from all devices");
        }
    }

    async refreshToken(refreshToken: string) {
        try {

            let userData:any;

            jwt.verify(refreshToken, process.env.JWT_SECRETE!, (err:any, decoded:any) => {
                if(err){
                    throw Error('Invalid refresh token')
                }
                userData = decoded;
            });

            const userId = userData.id;

            const storedToken = await db.select().from(refreshTokenTable).where(and(eq(refreshTokenTable.userId, userId), eq(refreshTokenTable.refreshToken, refreshToken))).limit(1);
            if (!storedToken || storedToken.length === 0) {
                throw new Error("Invalid refresh token");
            }

            if(new Date(storedToken[0].expiresAt) < new Date()) {
                await db.delete(refreshTokenTable).where(eq(refreshTokenTable.userId, userId));
                throw new Error("Refresh token expired");
            }

            // const user = await this.getUserById(userId);
            // if (!user) {
            //     throw new Error("User not found");
            // }

            const newAccessToken = await this.generateToken({ id: userId, email: userData.email }, '15m');
            const newRefreshToken = await this.generateToken({ id: userId, email: userData.email }, '7d');

            await this.deleteRefreshToken(refreshToken, userId); // Delete the old refresh token

            await this.storeRefreshToken(userId, newRefreshToken);

            return {
                success: true,
                message: "Token refreshed successfully",
                token: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (error:any) {
            throw new Error(error.message || "Error refreshing token");
        }
    }

    async getUserById(id: string) {
        try {
            const user = await db.select().from(userTable).where(eq(userTable.id, id)).limit(1);
            return {
                success: true,
                message: 'User fetched successfully',
                user: user[0] || null
            }
        } catch (error:any) {
            throw new Error(error.message || "Error fetching user by ID");
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await db.select().from(userTable).where(eq(userTable.email, email)).limit(1);
            return user[0] || null;
        } catch (error:any) {
            throw Error(error.message || "Error fetching user by email");
        }
    }

    async updateUserById(id: string, updateData: { email?: string; password?: string; name?: string }) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error("User not found");
            }

            const updatedUser = await db.update(userTable).set(updateData).where(eq(userTable.id, id)).returning();

            const token = await this.generateToken({ id: updatedUser[0].id, email: updatedUser[0].email });

            return {
                success: true,
                message: "User updated successfully",
                user: updatedUser[0],
                token
            }
        } catch (error:any) {
            throw new Error(error.message || "Error updating user");
        }
    }

    async deleteUserById(id: string) {
        try {
            const user = await this.getUserById(id);
            if (!user) {
                throw new Error("User not found");
            }

            const deletedUser = await db.delete(userTable).where(eq(userTable.id, id)).returning();

            return {
                success: true,
                message: "User deleted successfully",
                user: deletedUser[0]
            }
        } catch (error:any) {
            throw new Error(error.message || "Error deleting user");
        }
    }

    private async generateToken(payload: { id: string; email: string }, expiresIn: any = '1h') {
        // Implement token generation logic (e.g., using JWT)
        // Example:
        return jwt.sign({ id: payload.id, email: payload.email }, process.env.JWT_SECRETE!, { expiresIn });
    }

    private async storeRefreshToken(userId: string, refreshToken: string) {
        try {
            const result = await db.insert(refreshTokenTable).values({
                userId,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days as ISO string
            });

            if (!result.command || result.command !== 'INSERT') {
                throw new Error("Failed to store refresh token");
            }
        } catch (error:any) {
            throw new Error(error.message || "Error storing refresh token");
        }
    }

    private async deleteRefreshToken(refreshToken: string, userId: string) {
        try {
            await db.delete(refreshTokenTable).where(and(eq(refreshTokenTable.refreshToken, refreshToken), eq(refreshTokenTable.userId, userId)));
        } catch (error:any) {
            throw new Error(error.message || "Error deleting refresh token");
        }
    }
}

export const userServices = new UserServices();