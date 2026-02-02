import express, { type Response } from "express";
import Application from "@/models/Application";
import AdminApplication from "@/models/AdminApplication";
import User from "@/models/User";
import authMiddleware, { type AuthRequest } from "@/middleware/authMiddleware";
import Logger from "@/utils/Logger";
import { ApplicationSchema } from "@shared/schemas/application";

const router = express.Router();

// Helper to map validated Zod data to DB structure
const mapApplicationData = (data: any) => ({
  basicInfo: data.basicInfo,
  skillsAndLinks: {
    ...data.skillsAndLinks,
    skills: data.skillsAndLinks.skills || [],
  },
  accessibility: data.accessibility,
});

// Middleware to ensure auth for all app routes
router.use(authMiddleware);

// --- Application ---

// GET /api/application/me
router.get("/application/me", async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({ userId: req.userId });
    if (!application) {
      res.json({ exists: false });
      return;
    }
    res.json(application);
  } catch (error) {
    Logger.error("Get Application Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/application/me
router.post("/application/me", async (req: AuthRequest, res: Response) => {
  try {
    // Validate with Zod
    const validationResult = ApplicationSchema.safeParse(req.body);

    if (!validationResult.success) {
      Logger.warn(
        "Validation failed for application submission",
        validationResult.error.format(),
      );
      res.status(400).json({
        message: "Validation Error",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const applicationData = mapApplicationData(validationResult.data);

    // CHECK IF ADMIN
    const user = await User.findById(req.userId);

    if (user && user.role === "admin") {
      Logger.info(`Admin ${user.username} creating NEW test application`);
      // Always create NEW application in AdminApplication collection
      const adminApp = await AdminApplication.create({
        userId: req.userId,
        ...applicationData,
        accepted: false,
        rsvpd: false,
      });
      res.json(adminApp);
      return;
    }

    // Normal User Logic (Single Application)
    let application = await Application.findOne({ userId: req.userId });

    if (application) {
      Logger.info(`Updating application for user ${req.userId}`);
      // Update
      Object.assign(application, applicationData);
      await application.save();
    } else {
      Logger.info(`Creating new application for user ${req.userId}`);
      // Create
      application = await Application.create({
        userId: req.userId,
        ...applicationData,
        accepted: false,
        rsvpd: false,
      });
    }

    res.json(application);
  } catch (error: any) {
    Logger.error("Save Application Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error?.message || String(error),
    });
  }
});

// --- RSVP ---

// GET /api/rsvp/me
router.get("/rsvp/me", async (req: AuthRequest, res: Response) => {
  try {
    // Normal user check
    const application = await Application.findOne({ userId: req.userId });

    // ! Note: Admins will see "No application" here unless we also check AdminApplication.
    if (!application) {
      res.json({
        hasApplication: false,
        accepted: false,
        rsvpd: false,
      });
      return;
    }

    res.json({
      hasApplication: true,
      accepted: application.accepted,
      rsvpd: application.rsvpd,
    });
  } catch (error) {
    Logger.error("Get RSVP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/rsvp
router.post("/rsvp", async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId } = req.body;

    const user = await User.findById(req.userId);
    const isAdmin = user?.role === "admin";

    let application;

    if (isAdmin) {
      if (applicationId) {
        // Admin targeting specific test app
        application = await AdminApplication.findOne({
          _id: applicationId,
          userId: req.userId,
        });
      } else {
        // Admin defaulting to latest test app
        application = await AdminApplication.findOne({
          userId: req.userId,
        }).sort({
          createdAt: -1,
        });
      }
    } else {
      // Normal user
      application = await Application.findOne({ userId: req.userId });
    }

    if (!application) {
      Logger.warn(`RSVP failed: No application found for user ${req.userId}`);
      res.status(400).json({ message: "No application found" });
      return;
    }

    if (!application.accepted) {
      Logger.warn(
        `RSVP failed: Application not accepted for user ${req.userId}`,
      );
      res.status(403).json({ message: "Application not accepted yet" });
      return;
    }

    if (application.rsvpd) {
      Logger.info(`User ${req.userId} already RSVP'd`);
      res.json({ rsvpd: true }); // Idempotent
      return;
    }

    Logger.success(`User ${req.userId} confirmed RSVP (Admin: ${isAdmin})`);
    application.rsvpd = true;
    await application.save();

    res.json({ rsvpd: true });
  } catch (error) {
    Logger.error("RSVP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
