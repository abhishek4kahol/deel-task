import { Router } from "express";
import { depositToClientBalance } from "./controllers.js";
import { getProfile } from "../middleware/getProfile.js";

const balanceRouter = Router();

balanceRouter.post("/deposit/:userId", getProfile, depositToClientBalance);

export { balanceRouter };
