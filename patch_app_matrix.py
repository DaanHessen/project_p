import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add matrixToast state
state_block = r'''  const [isMatrix, setIsMatrix] = useState(false);'''
new_state_block = r'''  const [isMatrix, setIsMatrix] = useState(false);
  const [matrixQuote, setMatrixQuote] = useState("");
  
  const MATRIX_QUOTES = [
    "Wake up, Neo...",
    "The Matrix has you...",
    "Follow the white rabbit.",
    "There is no spoon.",
    "Ignorance is bliss."
  ];'''
content = content.replace(state_block, new_state_block)

# Update handleToggle to pick a quote
toggle_block = r'''    const handleToggle = () => setIsMatrix((prev) => !prev);'''
new_toggle_block = r'''    const handleToggle = () => {
      setIsMatrix((prev) => {
        if (!prev) {
          setMatrixQuote(MATRIX_QUOTES[Math.floor(Math.random() * MATRIX_QUOTES.length)]);
          setTimeout(() => setMatrixQuote(""), 4000);
        }
        return !prev;
      });
    };'''
content = content.replace(toggle_block, new_toggle_block)

# Add keydown logic for quote
keydown_block = r'''      if (buffer.toLowerCase() === "matrix") {
        setIsMatrix((prev) => !prev);
      }'''
new_keydown_block = r'''      if (buffer.toLowerCase() === "matrix") {
        handleToggle();
      }'''
content = content.replace(keydown_block, new_keydown_block)

# Add toast div
toast_div = r'''      <SiteNav route={route} setRoute={setRoute} />'''
new_toast_div = r'''      <SiteNav route={route} setRoute={setRoute} />
      
      {matrixQuote && (
        <div className="matrix-toast">
          {matrixQuote}
        </div>
      )}'''
content = content.replace(toast_div, new_toast_div)

with open("src/App.tsx", "w") as f:
    f.write(content)
