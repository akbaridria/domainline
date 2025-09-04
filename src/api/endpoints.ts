import { apiClient } from "./client";

const fetchDomains = async (name: string) => {
  return apiClient().post("", {
    query: `
            query {
                names(name: "${name}") {
                    items {
                        claimedBy
                        eoi
                        expiresAt
                        name
                        isFractionalized
                        tokenizedAt
                    }
                }
            }
        `,
  });
};

export { fetchDomains };
