import re

with open("src/globals.css", "r") as f:
    content = f.read()

# Remove the previously appended transitions and properties
content = re.sub(r'/\* Smooth theme transitions \*/.*', '', content, flags=re.DOTALL)

with open("src/globals.css", "w") as f:
    f.write(content)

with open("src/globals.css", "a") as f:
    f.write("""
/* Smooth theme transitions */
*, *::before, *::after {
  transition-property: background-color, border-color, color, fill, stroke, text-shadow, box-shadow;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}
""")
