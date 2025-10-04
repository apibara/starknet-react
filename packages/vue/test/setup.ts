import { beforeEach } from "vitest";
import { QueryClient } from "@tanstack/vue-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

beforeEach(() => {
  localStorage.clear();
});
