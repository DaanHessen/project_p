import re

with open("src/data/github.test.ts", "r") as f:
    ts = f.read()

old_expect = r'''    expect(map\["myrepo"\]).toEqual\(\{ stars: 5, forks: 2 \}\);
    expect(map\["https://github.com/daanhessen/myrepo"\]).toEqual\(\{ stars: 5, forks: 2 \}\);'''

new_expect = r'''    expect(map["myrepo"]).toEqual({ stars: 5, forks: 2, updated: "2026-01-01T00:00:00Z" });
    expect(map["https://github.com/daanhessen/myrepo"]).toEqual({ stars: 5, forks: 2, updated: "2026-01-01T00:00:00Z" });'''

ts = re.sub(old_expect, new_expect, ts)

with open("src/data/github.test.ts", "w") as f:
    f.write(ts)
