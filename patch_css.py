import re

with open("src/pages/ResumePage.css", "r") as f:
    content = f.read()

# Replace language CSS
old_css = r'''\.resume__language-list \{
  display: flex;
  flex-wrap: wrap;
  gap: var\(--space-2\) var\(--space-7\);
\}

\.resume__language \{
  display: inline-flex;
  align-items: baseline;
  gap: 0\.75ch;
  color: var\(--fg\);
\}'''

new_css = r'''.resume__tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
}

.resume__tag {
  display: inline-flex;
  align-items: baseline;
  gap: 0.75ch;
  color: var(--fg);
}'''

content = re.sub(old_css, new_css, content)
content = content.replace('.resume__language,', '.resume__tag,')
content = content.replace('.resume__language-list', '.resume__tag-list')
content = content.replace('.resume__language', '.resume__tag')

with open("src/pages/ResumePage.css", "w") as f:
    f.write(content)
