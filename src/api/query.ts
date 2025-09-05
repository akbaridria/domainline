import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "./query-key";
import { fetchDomains } from "./endpoints";
import type { DomainName } from "./types";

const useSearchDomains = (name: string) => {
  return useQuery<DomainName[]>({
    queryKey: [QUERY_KEY.SEARCH_DOMAINS, name],
    queryFn: () => fetchDomains(name),
  });
};

export { useSearchDomains };
