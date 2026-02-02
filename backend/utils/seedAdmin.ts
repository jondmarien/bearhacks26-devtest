import User from "../models/User";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("bearhacks2026@admin", 10);

    const adminUser = new User({
      discordId: "admin_placeholder", // Placeholder unique ID for non-discord user
      username: "admin",
      email: "admin@bearhacks.com",
      password: hashedPassword,
      role: "admin",
      avatar: "https://ui-avatars.com/api/?name=Admin&background=random",
    });

    await adminUser.save();
    console.log("Default admin account created: admin / bearhacks2026@admin");
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

export default seedAdmin;
