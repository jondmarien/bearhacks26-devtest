import mongoose from "mongoose";
import Application from "../models/Application";
import AdminApplication from "../models/AdminApplication";
import connectDB from "../db";
import Logger from "../utils/Logger";

const migrateLegacyData = async () => {
  try {
    await connectDB();
    Logger.info("Connected to DB for migration...");

    // 1. Migrate User Applications
    const apps = await Application.find({}).lean();
    Logger.info(`Found ${apps.length} user applications to check/migrate.`);

    for (const app of apps) {
      await transformAndSave(app, "Application");
    }

    // 2. Migrate Admin Applications
    const adminApps = await AdminApplication.find({}).lean();
    Logger.info(
      `Found ${adminApps.length} admin applications to check/migrate.`,
    );

    for (const app of adminApps) {
      await transformAndSave(app, "AdminApplication");
    }

    Logger.success("Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    Logger.error("Migration failed:", error);
    process.exit(1);
  }
};

async function transformAndSave(doc: any, modelName: string) {
  const update: any = {};
  let needsUpdate = false;

  // Helper to safely set nested fields in the update object
  const setIfMissing = (path: string, value: any) => {
    const keys = path.split(".");
    let current: any = doc;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!key) continue;
      if (current === undefined || current === null) break;
      current = current[key];
    }
    let isMissing = false;
    let ptr: any = doc;
    for (const k of keys) {
      if (ptr === undefined || ptr === null || typeof ptr !== "object") {
        isMissing = true;
        break;
      }
      ptr = ptr[k];
    }
    if (ptr === undefined || ptr === null) isMissing = true;

    if (isMissing) {
      update[path] = value;
      needsUpdate = true;
    }
  };

  // --- Basic Info Migration ---
  if (doc.basicInfo) {
    // Split fullName if firstName is missing
    if (!doc.basicInfo.firstName && doc.basicInfo.fullName) {
      const parts = doc.basicInfo.fullName.trim().split(" ");
      const lastName = parts.length > 1 ? parts.pop() : "Doe";
      const firstName = parts.join(" ") || doc.basicInfo.fullName;

      update["basicInfo.firstName"] = firstName;
      update["basicInfo.lastName"] = lastName;
      needsUpdate = true;
    } else if (!doc.basicInfo.firstName) {
      update["basicInfo.firstName"] = "Unknown";
      update["basicInfo.lastName"] = "User";
      needsUpdate = true;
    }

    // Handle Location -> City/Country
    if (!doc.basicInfo.city && doc.basicInfo.location) {
      const parts = doc.basicInfo.location.split(",");
      update["basicInfo.city"] = parts[0]?.trim() || "Unknown";
      update["basicInfo.country"] = parts[1]?.trim() || "Unknown";
      needsUpdate = true;
    } else if (!doc.basicInfo.city) {
      update["basicInfo.city"] = "Unknown";
      update["basicInfo.country"] = "Unknown";
      needsUpdate = true;
    }

    if (!doc.basicInfo.major) {
      update["basicInfo.major"] = "Undeclared";
      needsUpdate = true;
    }
    if (!doc.basicInfo.educationLevel) {
      update["basicInfo.educationLevel"] = "Undergraduate";
      needsUpdate = true;
    }
    if (!doc.basicInfo.age) {
      update["basicInfo.age"] = "18+";
      needsUpdate = true;
    }
    if (!doc.basicInfo.phone) {
      update["basicInfo.phone"] = "000-000-0000";
      needsUpdate = true;
    }

    // Ensure email exists (critical for usage)
    if (!doc.basicInfo.email) {
      update["basicInfo.email"] = doc.email || "migrated_user@example.com";
      needsUpdate = true;
    }
  } else {
    // Create default basicInfo if it doesn't exist
    update["basicInfo"] = {
      firstName: "Unknown",
      lastName: "User",
      email: doc.email || "migrated_user@example.com",
      phone: "000-000-0000",
      city: "Unknown",
      country: "Unknown",
      school: "Unknown",
      year: "2026",
      major: "Undeclared",
      educationLevel: "Undergraduate",
      age: "18+",
    };
    needsUpdate = true;
  }

  // --- Work / Skills Migration ---
  if (doc.skillsAndLinks) {
    if (!doc.work?.githubUrl && doc.skillsAndLinks.githubUrl) {
      update["work.githubUrl"] = doc.skillsAndLinks.githubUrl;
      needsUpdate = true;
    }
    if (!doc.work?.portfolioUrl && doc.skillsAndLinks.portfolioUrl) {
      update["work.portfolioUrl"] = doc.skillsAndLinks.portfolioUrl;
      needsUpdate = true;
    }
  }

  // --- Accessibility / Needs Migration ---
  if (doc.accessibility) {
    if (
      !doc.additionalNeeds?.accessibility &&
      doc.accessibility.accommodations
    ) {
      update["additionalNeeds.accessibility"] =
        doc.accessibility.accommodations;
      needsUpdate = true;
    }
    if (
      (!doc.additionalNeeds?.dietary ||
        doc.additionalNeeds?.dietary.length === 0) &&
      doc.accessibility.dietaryRestrictions
    ) {
      update["additionalNeeds.dietary"] = [
        doc.accessibility.dietaryRestrictions,
      ];
      needsUpdate = true;
    }
  }

  // --- Defaults for New Fields ---
  setIfMissing("hackerExperience.hackathonCount", "First time here");
  setIfMissing("hackerExperience.hackerType", "Developer");

  setIfMissing("diversity.gender", "Prefer not to say");
  setIfMissing("diversity.ethnicity", "Prefer not to say");

  setIfMissing("consent.shareWithSponsors", true);
  setIfMissing("consent.mlhCodeOfConduct", true);
  setIfMissing("consent.mlhPrivacyPolicy", true);
  setIfMissing("consent.commute", true);
  setIfMissing("consent.accurateInfo", true);

  if (needsUpdate) {
    const Model = modelName === "Application" ? Application : AdminApplication;
    // Use updateOne to perform a DB-level update, avoiding Mongoose application-level validation
    // This is crucial for fixing partial/broken documents
    await Model.updateOne({ _id: doc._id }, { $set: update });
    Logger.info(`[${modelName}] Migrated ${doc._id}`);
  } else {
    Logger.info(`[${modelName}] ${doc._id} up to date.`);
  }
}

migrateLegacyData();
