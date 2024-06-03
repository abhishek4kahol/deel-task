import {
  findAllUnpaidJobs,
  findUnpaidJobWithContract,
  payForJob,
} from "./services.js";
import { handleErrorResponse, sendResponse } from "../utils/responseHelper.js";
import { STATUS_CODES } from "../utils/statusCodes.js";

/**
 * Controller to get all Unpaid jobs by profile.
 *
 * @param {Object} req - The request object, containing  profile.
 * @param {Object} res - The response object, used to send the response.
 */
const getAllUnpaidJobs = async (req, res) => {
  try {
    const unpaidJobs = await findAllUnpaidJobs(req.profile);
    if (!unpaidJobs || unpaidJobs.length === 0) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, {
        message: "No unpaid jobs found",
      });
    }
    return sendResponse(res, STATUS_CODES.OK, { data: unpaidJobs });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Controller to handle paying for a job.
 * @param {Object} req - The request object, containing JobId and profile.
 * @param {Object} res - The response object, used to send the response.
 */
const postPayForJobId = async (req, res) => {
  const jobId = parseInt(req.params.job_id, 10);
  try {
    const { profile } = req;

    if (isNaN(jobId)) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        error: "Invalid Job ID.",
      });
    }

    const job = await findUnpaidJobWithContract(jobId);

    if (!job) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, {
        error: "Job not found or already paid",
      });
    }

    const { Client, Contractor } = job.Contract;

    if (Client.id !== profile.id) {
      return sendResponse(res, STATUS_CODES.FORBIDDEN, {
        error: "You are not authorized to pay for this job",
      });
    }

    if (Client.balance < job.price) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        error: "Insufficient balance to pay for this job",
      });
    }

    const paymentResult = await payForJob(job, Client, Contractor);

    if (!paymentResult.success) {
      return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, {
        error: "Failed to process payment",
      });
    }

    return sendResponse(res, STATUS_CODES.OK, {
      message: "Payment successful",
    });
  } catch (error) {
    console.log(`transaction error for ${jobId}:: ${error}`);
    return handleErrorResponse(res, error);
  }
};

export { getAllUnpaidJobs, postPayForJobId };
