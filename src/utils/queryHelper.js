/**
 * Builds a query object based on the profile and additional conditions.
 *
 * @param {Object} profile - The profile object.
 * @param {Object} additionalConditions - Additional conditions to include in the query.
 * @returns {Object} The constructed query object.
 */
const buildQuery = (profile, additionalConditions = {}) => {
  const baseQuery =
    profile.type === "client"
      ? { ClientId: profile.id }
      : { ContractorId: profile.id };
  return { ...baseQuery, ...additionalConditions };
};

export { buildQuery };
