import User from "@/models/User";
import bcrypt from "bcryptjs";
import Logger from "@/utils/Logger";

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
      Logger.info("Admin account already exists.");
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
    Logger.success(
      "Default admin account created: admin / bearhacks2026@admin",
    );
  } catch (error) {
    Logger.error("Error seeding admin:", error);
  }
};

export default seedAdmin;
