import { User } from "./User.js";

export class UserRepository {

    async register(name, email, phone, hashedPassword) {
        try {
            const existingUser = await User.findOne({
                $or: [{ email }, { phone }]
            });
            if (existingUser) {
                return true
            }
            const user = new User({
                name,
                email,
                phone,
                password: hashedPassword
            });
            await user.save();
            return false
        } catch (err) {
            if (err instanceof mongoose.Error.ValidationError) {
                throw err;
            }
        }
    }

    async login(email) {
        try {
            return await User.findOne({ email });
        } catch (err) {
            console.log(err);
        }
    }

    async userDetails(userId) {
        try {
            return await User.findById(userId).select("name email phone createdAt -_id");
        } catch (err) {
            throw err
        }
    }

    async updateProfile(userId, name, phone) {
        return await User.findByIdAndUpdate(
            userId,
            { name, phone },
            {
                new: true,
                runValidators: true
            }
        ).select("-password -_id");
    }

    async deleteProfile(userId) {
        return await User.findByIdAndDelete(
            userId
        ).select("-password -_id");
    }

}