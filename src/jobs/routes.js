import { Router } from "express";
import { getAllUnpaidJobs, postPayForJobId } from "./controllers.js";
import { getProfile } from "../middleware/getProfile.js";

const jobRouter = Router();

jobRouter.get("/unpaid", getProfile, getAllUnpaidJobs);

jobRouter.post("/:job_id/pay", getProfile, postPayForJobId);

export { jobRouter };
