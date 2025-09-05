export const QUERY_KEY = {
    SEARCH_DOMAINS: "search-domains"
} as const;

export type QueryKey = typeof QUERY_KEY[keyof typeof QUERY_KEY];