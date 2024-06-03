import { Profile } from "../db/model.js";
import { STATUS_CODES } from "../utils/statusCodes.js";
import { handleErrorResponse, sendResponse } from "../utils/responseHelper.js";

export const getProfile = async (req, res, next) => {
  const profileId = req.headers.profile_id;

  if (!profileId) {
    return sendResponse(res, STATUS_CODES.UNAUTHORIZED, {
      error: "User not authenticated.",
    });
  }

  try {
    const profile = await Profile.findOne({
      where: { id: profileId },
    });

    if (!profile) {
      return sendResponse(res, STATUS_CODES.UNAUTHORIZED, {
        error: "Profile not found.",
      });
    }

    req.profile = profile;
    next();
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
