
import express from "express";
import { auth } from "../middleware/authMiddleware.js";
import { UserController } from "../controllers/User.controller.js";

const authRouter = express.Router();
const userController = new UserController();

authRouter.post("/register", (req, res, next) =>
  userController.register(req, res, next)
);

authRouter.post("/login", (req, res, next) =>
  userController.login(req, res, next)
);

authRouter.get("/dashboard", auth, (req, res, next) => {
  userController.dashboard(req, res, next)
});

authRouter.put("/update", auth, (req, res, next) => {
  userController.updateProfile(req, res, next)
});

authRouter.delete("/delete", auth, (req, res, next) => {
  userController.deleteProfile(req, res, next)
});

export default authRouter;
