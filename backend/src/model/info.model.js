import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
            index: true,
            unique: true,
        },

        phone: {
            type: String,
            required: true,
            match: [/^[0-9]{10,15}$/, "Invalid phone number"],
        },

        message: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
