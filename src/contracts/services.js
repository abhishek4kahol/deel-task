import { Op } from "sequelize";
import { Contract } from "../db/model.js";
import { buildQuery } from "../utils/queryHelper.js";

/**
 * Finds a contract by its ID, ensuring it belongs to the specified profile.
 *
 * @param {number} contractId - The ID of the contract to find.
 * @param {Object} profile - The profile object.
 * @returns {Promise<Object|null>} The found contract, or null if no contract matches the criteria.
 */
const findContractById = async (contractId, profile) => {
  const query = buildQuery(profile, { id: contractId });
  return await Contract.findOne({ where: query });
};

/**
 * Finds all contracts that are either in progress or new, and belong to the specified profile.
 *
 * @param {Object} profile - The profile object.
 * @returns {Promise<Array<Object>>} An array of matching contracts.
 */ const findAllContracts = async (profile) => {
  const statusConditions = {
    [Op.or]: [{ status: "in_progress" }, { status: "new" }],
  };
  const query = buildQuery(profile, statusConditions);
  return await Contract.findAll({ where: query });
};

export { findContractById, findAllContracts };
