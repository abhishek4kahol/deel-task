import { sequelize, Profile, Contract, Job } from "../db/model.js";
import { Op } from "sequelize";

/**
 * This function deposits a specified amount to the balance of a user within a given profile.
 * @param profileId - Profile ID is a unique identifier for a user's profile in the system. It helps to
 * distinguish one user's data from another.
 * @param userId - The `userId` parameter typically represents the unique identifier of the user for
 * whom the deposit is being made. It is used to identify the user within the system.
 * @param amount - The `amount` parameter in the `depositToBalance` function represents the sum of
 * money that is being deposited into a user's balance. This amount will be added to the existing
 * balance of the user identified by their `userId` within the `profileId`.
 */
const depositToBalance = async (profileId, userId, amount) => {
  // Added profileId for future requirement changes as we should track which profile did the deposit, not sure about requirement.
  const transaction = await sequelize.transaction();

  try {
    // Ensure the user is a client
    const client = await Profile.findOne({
      where: { id: userId, type: "client" },
      transaction,
    });
    if (!client) {
      throw new Error("User not found");
    }

    // Calculate the total amount of unpaid jobs
    const unpaidJobs = await Job.findAll({
      where: {
        paid: { [Op.not]: true },
      },
      include: [
        {
          model: Contract,
          where: {
            clientId: userId,
            status: "in_progress",
          },
        },
      ],
      transaction,
    });

    const totalUnpaidJobAmount = unpaidJobs.reduce(
      (sum, job) => sum + parseFloat(job.price),
      0
    );

    // Check the deposit constraint
    const maxDeposit = totalUnpaidJobAmount * 0.25;

    if (amount > maxDeposit) {
      throw new Error(
        `Deposit amount exceeds the limit of 25% of total unpaid jobs (${maxDeposit})`
      );
    }

    client.balance += amount;
    await client.save({ transaction });

    await transaction.commit();

    return { success: true, balance: client.balance };
  } catch (error) {
    await transaction.rollback();
    return { success: false, message: error.message };
  }
};

export { depositToBalance };
