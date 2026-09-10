import { useEffect, useState } from "react";

export type SortOption = "stars" | "recent" | "name";

export function getInitialSort(): SortOption {
  if (typeof document === "undefined") return "stars";
  const match = document.cookie.match(/(?:^|; )sortBy=([^;]*)/);
  if (match) {
    const val = match[1];
    if (val === "stars" || val === "recent" || val === "name") {
      return val as SortOption;
    }
  }
  return "stars";
}

export function useSortBy() {
  const [sortBy, setSortBy] = useState<SortOption>(getInitialSort);

  useEffect(() => {
    document.cookie = `sortBy=${sortBy}; path=/; max-age=31536000`; // 1 year
  }, [sortBy]);

  return { sortBy, setSortBy };
}
