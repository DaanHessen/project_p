import { describe, expect, it } from "vitest";
import { toRepos } from "./github";

const repo = (over: Partial<Parameters<typeof toRepos>[0][number]> = {}) => ({
  name: "thing",
  description: "does a thing",
  html_url: "https://github.com/DaanHessen/thing",
  language: "Rust",
  stargazers_count: 0,
  pushed_at: "2026-01-01T00:00:00Z",
  fork: false,
  archived: false,
  topics: ["portfolio"],
  ...over,
});

describe("toRepos", () => {
  it("only includes repos opted in with the portfolio topic", () => {
    const out = toRepos(
      [
        repo({ name: "featured" }),
        repo({ name: "dotfiles", topics: ["neovim"] }),
        repo({ name: "untagged", topics: [] }),
        repo({ name: "no-topics-field", topics: undefined }),
      ],
      [],
    );
    expect(out.map((r) => r.name)).toEqual(["featured"]);
  });

  it("drops forks and archived repos", () => {
    const out = toRepos(
      [
        repo({ name: "keep" }),
        repo({ name: "forked", fork: true }),
        repo({ name: "old", archived: true }),
      ],
      [],
    );
    expect(out.map((r) => r.name)).toEqual(["keep"]);
  });

  it("drops repos with no description", () => {
    const out = toRepos([repo({ description: null })], []);
    expect(out).toEqual([]);
  });

  it("excludes URLs already covered by hand-written projects", () => {
    const out = toRepos(
      [repo({ html_url: "https://github.com/DaanHessen/ASCII-blobs" })],
      ["https://github.com/DaanHessen/ascii-blobs"],
    );
    expect(out).toEqual([]);
  });

  it("ranks by stars, then by most recently pushed", () => {
    const out = toRepos(
      [
        repo({ name: "a", stargazers_count: 1, pushed_at: "2026-01-01T00:00:00Z" }),
        repo({ name: "b", stargazers_count: 9, pushed_at: "2020-01-01T00:00:00Z" }),
        repo({ name: "c", stargazers_count: 1, pushed_at: "2026-06-01T00:00:00Z" }),
      ],
      [],
    );
    expect(out.map((r) => r.name)).toEqual(["b", "c", "a"]);
  });

  it("caps the list at six", () => {
    const many = Array.from({ length: 12 }, (_, i) =>
      repo({ name: `r${i}`, html_url: `https://github.com/DaanHessen/r${i}` }),
    );
    expect(toRepos(many, [])).toHaveLength(6);
  });
});
