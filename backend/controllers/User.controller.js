import { UserRepository } from "../models/User.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async register(req, res, next) {
        try {
            const { name, email, phone, password } = req.body;


            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await this.userRepository.register(name, email, phone, hashedPassword)

            if (existingUser) {
                return res.status(400).json({
                    msg: "Email or phone already registered"
                });
            }

            res.status(201).json({
                msg: "Registration successful, please login"
            });

        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await this.userRepository.login(email);
            if (!user) {
                return res.status(400).json({ msg: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.status(200).json({ token });

        } catch (error) {
            next(error);
        }
    }

    async dashboard(req, res, next) {
        try {
            const userdata = await this.userRepository.userDetails(req.user.id)
            res.status(200).json({ userdata })
        } catch (err) {
            next(err)
        }
    }

    async updateProfile(req, res, next) {
        try {
            const userdata = await this.userRepository.updateProfile(req.user.id,req.body.name,req.body.phone)
            res.status(200).json({userdata})
        } catch (err) {
            next(err)
        }
    }

    async deleteProfile(req,res,next){
        try {
            const userdata = await this.userRepository.deleteProfile(req.user.id)
            res.status(200).json({userdata})
        } catch (err) {
            next(err)
        }
    }
}