import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get('/me', authMiddleware, async (req, res) => userController.getUserById(req, res));

router.post("/signup", async (req, res) => userController.signUpUser(req, res));

router.post("/login", async (req, res) => userController.loginUser(req, res));

router.post("/refresh-token", async (req, res) => userController.renewAccessTokenByProvidingRefreshToken(req, res));

router.post("/logout", authMiddleware, async (req, res) => userController.logoutUserFromSingleDevice(req, res));

router.post("/logout-all-devices", authMiddleware, async (req, res) => userController.logoutUserFromAllDevices(req, res));

router.get("/user/:id", authMiddleware, async (req, res) => userController.getUserById(req, res));

router.get("/user/email/:email", authMiddleware, async (req, res) => userController.getUserByEmail(req, res));

router.put("/user/:id", authMiddleware, async (req, res) => userController.updateUserById(req, res));

router.delete("/user/:id", authMiddleware, async (req, res) => userController.deleteUserById(req, res));

export default router;