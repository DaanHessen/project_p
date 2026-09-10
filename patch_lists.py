import re

with open("src/pages/ResumePage.tsx", "r") as f:
    content = f.read()

# Replace technologies dd
tech_old = r'<dd className="resume__def-value">{group.items.join\((["\']), (["\'])\)}</dd>'
tech_new = r'''<dd className="resume__def-value">
                  <ul className="resume__tag-list">
                    {group.items.map((item) => (
                      <li className="resume__tag" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>'''

content = re.sub(tech_old, tech_new, content)

# Replace languages ul class
content = content.replace('className="resume__language-list"', 'className="resume__tag-list"')
content = content.replace('className="resume__language"', 'className="resume__tag"')

with open("src/pages/ResumePage.tsx", "w") as f:
    f.write(content)
