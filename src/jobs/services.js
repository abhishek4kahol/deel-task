import { Op } from "sequelize";
import { sequelize, Contract, Profile, Job } from "../db/model.js";
import { buildQuery } from "../utils/queryHelper.js";

/**
 * Retrieves all unpaid jobs for a user (either a client or contractor) for active contracts only.
 *
 * @param {Object} profile - The profile of the user requesting the unpaid jobs.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of unpaid jobs.
 */
const findAllUnpaidJobs = async (profile) => {
  const query = buildQuery(profile, {
    status: "in_progress",
  });
  return await Job.findAll({
    where: {
      paid: { [Op.not]: true },
    },
    include: [
      {
        model: Contract,
        where: query,
      },
    ],
  });
};

/**
 * Finds an unpaid job with its associated contract.
 * @param {number} jobId - The ID of the job to find.
 * @returns {Promise<Object>} - The job object.
 */
const findUnpaidJobWithContract = async (jobId) => {
  return await Job.findOne({
    where: {
      id: jobId,
      paid: { [Op.not]: true },
    },
    include: [
      {
        model: Contract,
        where: { status: "in_progress" },
        include: [
          { model: Profile, as: "Client" },
          { model: Profile, as: "Contractor" },
        ],
      },
    ],
  });
};

/**
 * Processes the payment for a job by transferring the amount from the client's balance to the contractor's balance.
 * @param {Object} job - The job to be paid for.
 * @param {Object} client - The client making the payment.
 * @param {Object} contractor - The contractor receiving the payment.
 * @returns {Promise<Object>} - An object indicating the success or failure of the transaction.
 * @throws {Error} - Throws an error if the transaction fails.
 */
const payForJob = async (job, client, contractor) => {
  const transaction = await sequelize.transaction();

  try {
    await client.decrement("balance", { by: job.price, transaction });
    await contractor.increment("balance", { by: job.price, transaction });

    await job.update({ paid: true, paymentDate: new Date() }, { transaction });

    await transaction.commit();

    return { success: true };
  } catch (error) {
    await transaction.rollback();
    throw new Error(
      "Error occurred while processing payment: " + error.message
    );
  }
};
export { findAllUnpaidJobs, findUnpaidJobWithContract, payForJob };
