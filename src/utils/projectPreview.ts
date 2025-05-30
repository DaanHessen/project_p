// Project Preview Utility
// Handles iframe loading, caching, and optimization for project previews

export interface PreviewConfig {
  url: string;
  timeout?: number;
  sandbox?: string;
  allowFullscreen?: boolean;
}

export interface PreviewState {
  loading: boolean;
  loaded: boolean;
  error: boolean;
  errorMessage?: string;
}

// Default configuration for project previews
export const DEFAULT_PREVIEW_CONFIG: Partial<PreviewConfig> = {
  timeout: 10000, // 10 seconds
  sandbox: "allow-same-origin allow-scripts allow-forms",
  allowFullscreen: false,
};

// Cache for preloaded iframes
const preloadCache = new Map<string, boolean>();

/**
 * Preload a project URL by creating a hidden iframe
 * This helps with faster loading when the user navigates to the project
 */
export function preloadProject(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already cached
    if (preloadCache.has(url)) {
      resolve(preloadCache.get(url) || false);
      return;
    }

    // Create hidden iframe for preloading
    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.display = "none";
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.top = "-9999px";
    iframe.style.width = "1px";
    iframe.style.height = "1px";

    const cleanup = () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    const timeout = setTimeout(() => {
      preloadCache.set(url, false);
      cleanup();
      resolve(false);
    }, DEFAULT_PREVIEW_CONFIG.timeout);

    iframe.onload = () => {
      clearTimeout(timeout);
      preloadCache.set(url, true);
      cleanup();
      resolve(true);
    };

    iframe.onerror = () => {
      clearTimeout(timeout);
      preloadCache.set(url, false);
      cleanup();
      resolve(false);
    };

    document.body.appendChild(iframe);
  });
}

/**
 * Batch preload multiple project URLs
 */
export async function preloadProjects(
  urls: string[],
): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();

  // Preload in batches to avoid overwhelming the browser
  const batchSize = 3;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchPromises = batch.map(async (url) => {
      const success = await preloadProject(url);
      results.set(url, success);
      return { url, success };
    });

    await Promise.all(batchPromises);

    // Small delay between batches to prevent overwhelming
    if (i + batchSize < urls.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  return results;
}

/**
 * Check if a URL is likely to work in an iframe
 */
export function isIframeCompatible(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Check for common iframe-blocking domains
    const blockedDomains = [
      "google.com",
      "facebook.com",
      "twitter.com",
      "instagram.com",
      "linkedin.com",
      "youtube.com",
      "github.com", // GitHub pages might work, but main site doesn't
    ];

    const hostname = urlObj.hostname.toLowerCase();
    const isBlocked = blockedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
    );

    return (
      !isBlocked &&
      (urlObj.protocol === "https:" || urlObj.protocol === "http:")
    );
  } catch {
    return false;
  }
}

/**
 * Get the preview cache status for a URL
 */
export function getPreviewCacheStatus(url: string): boolean | undefined {
  return preloadCache.get(url);
}

/**
 * Clear the preview cache
 */
export function clearPreviewCache(): void {
  preloadCache.clear();
}

/**
 * Get optimized iframe attributes for a project preview
 */
export function getIframeAttributes(
  config: PreviewConfig,
): Record<string, string> {
  return {
    src: config.url,
    sandbox: config.sandbox || DEFAULT_PREVIEW_CONFIG.sandbox || "",
    loading: "lazy",
    referrerpolicy: "strict-origin-when-cross-origin",
    ...(config.allowFullscreen ? { allowfullscreen: "true" } : {}),
  };
}

/**
 * Create a preview state manager
 */
export function createPreviewStateManager() {
  const states = new Map<string, PreviewState>();

  return {
    getState: (url: string): PreviewState => {
      return (
        states.get(url) || {
          loading: false,
          loaded: false,
          error: false,
        }
      );
    },

    setState: (url: string, state: Partial<PreviewState>) => {
      const currentState = states.get(url) || {
        loading: false,
        loaded: false,
        error: false,
      };
      states.set(url, { ...currentState, ...state });
    },

    setLoading: (url: string, loading: boolean) => {
      const currentState = states.get(url) || {
        loading: false,
        loaded: false,
        error: false,
      };
      states.set(url, { ...currentState, loading, error: false });
    },

    setLoaded: (url: string, loaded: boolean) => {
      const currentState = states.get(url) || {
        loading: false,
        loaded: false,
        error: false,
      };
      states.set(url, {
        ...currentState,
        loaded,
        loading: false,
        error: false,
      });
    },

    setError: (url: string, error: boolean, errorMessage?: string) => {
      const currentState = states.get(url) || {
        loading: false,
        loaded: false,
        error: false,
      };
      states.set(url, { ...currentState, error, errorMessage, loading: false });
    },

    clear: () => {
      states.clear();
    },
  };
}
