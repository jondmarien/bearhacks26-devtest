import express, { type Response } from "express";
import Application from "@/models/Application";
import AdminApplication from "@/models/AdminApplication";
import authMiddleware, { type AuthRequest } from "@/middleware/authMiddleware";
import Logger from "@/utils/Logger";

const router = express.Router();

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
    const { basicInfo, skillsAndLinks, accessibility } = req.body;

    // Basic validation
    if (!basicInfo || !basicInfo.fullName) {
      res.status(400).json({ message: "Full Name is required" });
      return;
    }

    // CHECK IF ADMIN
    // We need to fetch the user's role. req.userId is just the ID.
    // However, authMiddleware might have attached user? No, just userId.
    // We can check the DB or maybe update authMiddleware to pass role.
    // For now, let's look up user since we need to know.
    // Actually, let's import User model to check role.
    const User = require("@/models/User").default;
    const user = await User.findById(req.userId);

    if (user && user.role === "admin") {
      Logger.info(`Admin ${user.username} creating NEW test application`);
      // Always create NEW application in AdminApplication collection
      const adminApp = await AdminApplication.create({
        userId: req.userId,
        basicInfo,
        skillsAndLinks,
        accessibility,
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
      application.basicInfo = basicInfo;
      application.skillsAndLinks = skillsAndLinks;
      application.accessibility = accessibility;
      await application.save();
    } else {
      Logger.info(`Creating new application for user ${req.userId}`);
      // Create
      application = await Application.create({
        userId: req.userId,
        basicInfo,
        skillsAndLinks,
        accessibility,
        accepted: false,
        rsvpd: false,
      });
    }

    res.json(application);
  } catch (error) {
    Logger.error("Save Application Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- RSVP ---

// GET /api/rsvp/me
router.get("/rsvp/me", async (req: AuthRequest, res: Response) => {
  try {
    // Normal user check
    const application = await Application.findOne({ userId: req.userId });

    // Note: Admins will see "No application" here unless we also check AdminApplication.
    // But for the main RSVP page, admins might want to see their specific test apps status.
    // Let's keep this simple for now: this route is for the standard single-user flow.
    // Admins will use the dashboard to see their test apps.

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

    const User = require("@/models/User").default;
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
