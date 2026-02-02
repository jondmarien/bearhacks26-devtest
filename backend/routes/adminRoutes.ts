import express, { type Request, type Response } from "express";
import Application from "@/models/Application";
import User from "@/models/User";
import authMiddleware, { type AuthRequest } from "@/middleware/authMiddleware";
import adminMiddleware from "@/middleware/adminMiddleware";
import Logger from "@/utils/Logger";

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Get all applications
router.get("/applications", async (req: Request, res: Response) => {
  try {
    const applications = await Application.find().populate(
      "userId",
      "username email discordId avatar",
    );
    Logger.info(`Admin fetched ${applications.length} applications`);
    res.json(applications);
  } catch (error) {
    Logger.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update application status
router.post("/application/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // "accepted", "rejected", "waitlisted"

  if (!["accepted", "rejected", "pending"].includes(status)) {
    res.status(400).json({ message: "Invalid status" });
    return;
  }

  const accepted = status === "accepted";
  Logger.info(
    `Admin updating application ${id} to status: ${status} (accepted: ${accepted})`,
  );

  try {
    const application = await Application.findByIdAndUpdate(
      id,
      { accepted },
      { new: true },
    );

    if (!application) {
      Logger.warn(`Admin update failed: Application ${id} not found`);
      res.status(404).json({ message: "Application not found" });
      return;
    }

    Logger.success(`Application ${id} updated successfully`);
    res.json(application);
  } catch (error) {
    Logger.error("Error updating application:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
