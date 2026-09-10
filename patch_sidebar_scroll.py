import re

with open("src/pages/ResumePage.css", "r") as f:
    css = f.read()

old_block = r'''  \.resume__identity \{
    position: sticky;
    top: 4\.5rem;
    grid-column: 1;
    max-height: calc\(100vh - 6rem\);
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  \}'''

new_block = r'''  .resume__identity {
    position: sticky;
    top: 4.5rem;
    grid-column: 1;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }'''

css = re.sub(old_block, new_block, css)

with open("src/pages/ResumePage.css", "w") as f:
    f.write(css)
