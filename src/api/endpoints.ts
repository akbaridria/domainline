import { apiClient } from "./client";

const fetchDomains = async (name: string) => {
  return apiClient()
    .post("", {
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
    })
    .then((res) => res.data.data.names.items);
};

export { fetchDomains };
