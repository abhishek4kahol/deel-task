import { depositToBalance } from "../profiles/services.js";
import { handleErrorResponse, sendResponse } from "../utils/responseHelper.js";
import { STATUS_CODES } from "../utils/statusCodes.js";

/**
 * Controller to handle depositing money into a client's balance.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const depositToClientBalance = async (req, res) => {
  const { userId } = req.params; // Client receiving the deposit
  const { amount } = req.body;
  const profileId = req.profile.id; // Profile making the request (can be same or different)

  if (!amount || amount <= 0) {
    return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
      error: "Invalid deposit amount",
    });
  }

  try {
    const depositResult = await depositToBalance(profileId, userId, amount);

    if (!depositResult.success) {
      return sendResponse(res, STATUS_CODES.BAD_REQUEST, {
        error: depositResult.message,
      });
    }

    return sendResponse(res, STATUS_CODES.OK, {
      message: "Deposit successful",
      balance: depositResult.balance,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { depositToClientBalance };
