import { Router } from "express";
import { contractRouter } from "../contracts/routes.js";
import { jobRouter } from "../jobs/routes.js";
import { balanceRouter } from "../balances/routes.js";

const router = Router();

router.use("/contracts", contractRouter);
router.use("/jobs", jobRouter);
router.use("/balances", balanceRouter);

export { router };
