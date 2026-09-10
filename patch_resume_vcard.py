import re

with open("src/pages/ResumePage.tsx", "r") as f:
    content = f.read()

# Add import
import_stmt = 'import { useSortBy, SortOption } from "../useSortBy";\nimport { downloadVCard } from "../utils/vcard";'
content = content.replace('import { useSortBy, SortOption } from "../useSortBy";', import_stmt)

# Add vCard button to contact list
old_contact = r'''          <ul className="resume__contact">
            <li className="resume__contact-place">{resume.personal.location}</li>
            <li>
              <a className="resume__link" href={`mailto:${resume.personal.email}`}>
                {resume.personal.email}
              </a>
            </li>
          </ul>'''

new_contact = r'''          <ul className="resume__contact">
            <li className="resume__contact-place">{resume.personal.location}</li>
            <li>
              <a className="resume__link" href={`mailto:${resume.personal.email}`}>
                {resume.personal.email}
              </a>
            </li>
            <li>
              <button
                type="button"
                className="resume__link"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}
                onClick={downloadVCard}
              >
                save vCard
              </button>
            </li>
          </ul>'''

content = content.replace(old_contact, new_contact)

with open("src/pages/ResumePage.tsx", "w") as f:
    f.write(content)
