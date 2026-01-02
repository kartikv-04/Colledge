import Contact from "../model/info.model.js";

const postContactController = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // check if all fields are filled
        if (!name || !email || !phone) {
            console.log("All fields are required!");
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("Invalid email format!");
            return res.status(400).json({ message: "Invalid email format" });
        }

        // check if phone number is valid
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            console.log("Invalid phone number!");
            return res.status(400).json({ message: "Invalid phone number" });
        }

        // create new Contact
        const contact = new Contact({
            name,
            email,
            phone
        })

        // save contact
        await contact.save();

        console.log("contact Saved Successfully!");

        return res.status(201).json({ message: "Contact created successfully" });
    } catch (error) {
        console.log("Error creating contact:", error);
        return res.status(500).json({ message: "Failed to create contact" });
    }
}

const getContactController = async (req, res) => {
    try {
        const contact = await Contact.find();

        // Check if contact is found
        if (!contact) {
            console.log("Contact not found!");
            return res.status(404).json({ message: "Contact not found" });
        }

        console.log("Contact fetched successfully!");
        return res.status(200).json({ message: "Contact fetched successfully", contact });

    } catch (error) {
        console.log("Error fetching contact:", error);
        return res.status(500).json({ message: "Failed to fetch contact" });
    }
}

export default { postContactController, getContactController };