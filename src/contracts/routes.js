import { Router } from "express";
import { getAllContracts, getContractById } from "./controllers.js";
import { getProfile } from "../middleware/getProfile.js";

const contractRouter = Router();

/**
 * GET /contracts
 * The endpoint finds the contracts with status different from 'terminated' for a profile (as a client or the contractor).
 */
contractRouter.get("/", getProfile, getAllContracts);

/**
 * GET /contracts/:id
 * The endpoint finds the contract by id, only if the profile is part of the contract (as a client or the contractor).
 */
contractRouter.get("/:id", getProfile, getContractById);

export { contractRouter };
