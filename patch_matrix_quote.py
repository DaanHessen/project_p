import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace MATRIX_QUOTES and random selection with a single quote
old_block = r'''  const MATRIX_QUOTES = \[
    "Wake up, Neo\.\.\.",
    "The Matrix has you\.\.\.",
    "Follow the white rabbit\.",
    "There is no spoon\.",
    "Ignorance is bliss\."
  \];

  useEffect\(\(\) => \{
    const handleToggle = \(\) => \{
      setIsMatrix\(\(prev\) => \{
        if \(!prev\) \{
          setMatrixQuote\(MATRIX_QUOTES\[Math\.floor\(Math\.random\(\) \* MATRIX_QUOTES\.length\)\]\);
          setTimeout\(\(\) => setMatrixQuote\(""\), 4000\);
        \}
        return !prev;
      \}\);
    \};'''

new_block = r'''  useEffect(() => {
    const handleToggle = () => {
      setIsMatrix((prev) => {
        if (!prev) {
          setMatrixQuote("Wake up, Neo...");
          setTimeout(() => setMatrixQuote(""), 3000);
        }
        return !prev;
      });
    };'''

content = re.sub(old_block, new_block, content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(content)
