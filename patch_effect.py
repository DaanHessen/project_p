import re

with open("src/App.tsx", "r") as f:
    content = f.read()

effect_regex = re.compile(r'useEffect\(\(\) => \{.*?\n  \}, \[\]\);', re.DOTALL)
matches = effect_regex.findall(content)

# We want the FIRST useEffect
new_effect = r'''useEffect(() => {
    const handleToggle = () => {
      setIsMatrix((prev) => {
        if (!prev) {
          setMatrixQuote(MATRIX_QUOTES[Math.floor(Math.random() * MATRIX_QUOTES.length)]);
          setTimeout(() => setMatrixQuote(""), 4000);
        }
        return !prev;
      });
    };

    let buffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      buffer = (buffer + e.key).slice(-6);
      if (buffer.toLowerCase() === "matrix") {
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggleMatrix", handleToggle);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggleMatrix", handleToggle);
    };
  }, []);'''

content = content.replace(matches[0], new_effect)

with open("src/App.tsx", "w") as f:
    f.write(content)
