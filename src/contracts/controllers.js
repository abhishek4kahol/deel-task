import { findContractById, findAllContracts } from "./services.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import { handleErrorResponse, sendResponse } from "../utils/responseHelper.js";

/**
 * Controller to get a contract by its ID.
 *
 * @param {Object} req - The request object, containing parameters and profile.
 * @param {Object} res - The response object, used to send the response.
 */
const getContractById = async (req, res) => {
  try {
    const contractId = parseInt(req.params.id, 10);

    if (isNaN(contractId)) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        error: "Invalid Contract ID.",
      });
    }

    const contract = await findContractById(
      parseInt(contractId, 10),
      req.profile
    );
    if (!contract) {
      return sendResponse(res, STATUS_CODES.NOT_FOUND, {
        error: "Contract not found",
      });
    }
    return sendResponse(res, STATUS_CODES.OK, {
      data: contract,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Controller to get all contracts based on the profile.
 *
 * @param {Object} req - The request object, containing the profile.
 * @param {Object} res - The response object, used to send the response.
 */
const getAllContracts = async (req, res) => {
  try {
    const contracts = await findAllContracts(req.profile);
    if (!contracts || contracts.length === 0) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "Not Found" })
        .end();
    } else {
      return res.status(STATUS_CODES.OK).json(contracts);
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { getContractById, getAllContracts };
