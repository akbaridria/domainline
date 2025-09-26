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
                        tokens {
                            networkId
                            tokenAddress
                            tokenId
                            listings {
                                price
                                id
                                externalId
                                expiresAt
                                currency {
                                    decimals
                                    name
                                    symbol
                                    usdExchangeRate
                                }
                            }
                        }
                    }
                }
            }
        `,
    })
    .then((res) => res.data.data.names.items);
};

const fetchAllDomainsFromAddress = async (address: string) => {
  return apiClient()
    .post("", {
      query: `
            query {
                names(ownedBy: "${address}") {
                    items {
                        claimedBy
                        eoi
                        expiresAt
                        name
                        isFractionalized
                        tokenizedAt
                        tokens {
                            networkId
                            tokenAddress
                            tokenId
                            listings {
                                price
                                id
                                externalId
                                expiresAt
                                currency {
                                    decimals
                                    name
                                    symbol
                                    usdExchangeRate
                                }
                            }
                        }
                    }
                }
            }
        `,
    })
    .then((res) => res.data.data.names.items);
};

export { fetchDomains, fetchAllDomainsFromAddress };
