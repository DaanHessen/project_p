import re

with open("src/App.tsx", "r") as f:
    content = f.read()

state_block = r'''  const asciiColors = {
    background: theme === "light" ? "#f5f5f7" : "#07080b",
    primary: theme === "light" ? "#1d1d1f" : "#c4cbd6",
    inkShadow: theme === "light" ? "#86868b" : "#5a6472",
  };'''

new_state_block = r'''  const [isMatrix, setIsMatrix] = useState(false);
  const [matrixQuote, setMatrixQuote] = useState("");
  
  const MATRIX_QUOTES = [
    "Wake up, Neo...",
    "The Matrix has you...",
    "Follow the white rabbit.",
    "There is no spoon.",
    "Ignorance is bliss."
  ];

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (isMatrix) {
      document.documentElement.setAttribute("data-matrix", "true");
    } else {
      document.documentElement.removeAttribute("data-matrix");
    }
  }, [isMatrix]);

  const asciiColors = {
    background: isMatrix ? "#000000" : theme === "light" ? "#f5f5f7" : "#07080b",
    primary: isMatrix ? "#00ff41" : theme === "light" ? "#1d1d1f" : "#c4cbd6",
    inkShadow: isMatrix ? "#003b00" : theme === "light" ? "#86868b" : "#5a6472",
  };'''

content = content.replace(state_block, new_state_block)

# Add toast div
toast_div = r'''      <ThemeToggle theme={theme} toggle={toggleTheme} />
    </div>'''
new_toast_div = r'''      <ThemeToggle theme={theme} toggle={toggleTheme} />

      {matrixQuote && (
        <div className="matrix-toast">
          {matrixQuote}
        </div>
      )}
    </div>'''

content = content.replace(toast_div, new_toast_div)

with open("src/App.tsx", "w") as f:
    f.write(content)
