import re

with open("src/pages/ResumePage.css", "r") as f:
    css = f.read()

old_block = r'''  \.resume__identity \{
    position: sticky;
    top: 4\.5rem;
    grid-column: 1;'''

new_block = r'''  .resume__identity {
    position: sticky;
    top: calc(var(--space-8) + 3.1rem);
    grid-column: 1;'''

css = re.sub(old_block, new_block, css)

with open("src/pages/ResumePage.css", "w") as f:
    f.write(css)
