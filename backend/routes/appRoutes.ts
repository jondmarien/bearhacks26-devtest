import express, { type Response } from "express";
import Application from "../models/Application";
import authMiddleware, { type AuthRequest } from "../middleware/authMiddleware";

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
    console.error("Get Application Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/application/me
router.post("/application/me", async (req: AuthRequest, res: Response) => {
  try {
    const { basicInfo, skillsAndLinks, accessibility } = req.body;

    // Basic validation (could be improved with Zod/Joi)
    if (!basicInfo || !basicInfo.fullName) {
      res.status(400).json({ message: "Full Name is required" });
      return;
    }

    let application = await Application.findOne({ userId: req.userId });

    if (application) {
      console.log(`Updating application for user ${req.userId}`);
      // Update
      application.basicInfo = basicInfo;
      application.skillsAndLinks = skillsAndLinks;
      application.accessibility = accessibility;
      await application.save();
    } else {
      console.log(`Creating new application for user ${req.userId}`);
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
    console.error("Save Application Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- RSVP ---

// GET /api/rsvp/me
router.get("/rsvp/me", async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({ userId: req.userId });

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
    console.error("Get RSVP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/rsvp
router.post("/rsvp", async (req: AuthRequest, res: Response) => {
  try {
    const application = await Application.findOne({ userId: req.userId });

    if (!application) {
      console.warn(`RSVP failed: No application for user ${req.userId}`);
      res.status(400).json({ message: "No application found" });
      return;
    }

    if (!application.accepted) {
      console.warn(
        `RSVP failed: Application not accepted for user ${req.userId}`,
      );
      res.status(403).json({ message: "Application not accepted yet" });
      return;
    }

    if (application.rsvpd) {
      console.log(`User ${req.userId} already RSVP'd`);
      res.json({ rsvpd: true }); // Idempotent
      return;
    }

    console.log(`User ${req.userId} confirmed RSVP`);
    application.rsvpd = true;
    await application.save();

    res.json({ rsvpd: true });
  } catch (error) {
    console.error("RSVP Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
