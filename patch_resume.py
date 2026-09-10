import re

with open("src/pages/ResumePage.tsx", "r") as f:
    content = f.read()

# Replace the projects section
start_marker = r'          {/* Projects */}\n          <section id="projects" className="resume__section">'
end_marker = r'          {/* Technologies */}'

pattern = re.compile(start_marker + r'.*?' + end_marker, re.DOTALL)

new_section = r'''          {/* Projects */}
          <section id="projects" className="resume__section">
            <div className="resume__section-header">
              <h2 className="resume__section-title">projects</h2>
              <div className="resume__sort">
                <label htmlFor="sort-projects">sort by:</label>
                <select
                  id="sort-projects"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="resume__sort-select"
                >
                  <option value="stars">stars</option>
                  <option value="recent">recent</option>
                  <option value="name">name</option>
                </select>
              </div>
            </div>
            {combinedProjects.map((project) => (
              <article className="resume__entry" key={project.id}>
                <div className="resume__meta resume__meta--strong">
                  <span>{project.name}</span>
                  {project.language && <span className="resume__meta-place">{project.language}</span>}
                  <RepoStats stats={project.statsObj} />
                </div>
                <div>
                  {project.description && <p className="resume__entry-desc">{project.description}</p>}
                  <div className="resume__links">
                    {project.links.map((link) =>
                      link.offline ? (
                        <span
                          className="resume__link resume__link--offline"
                          key={link.url}
                          role="link"
                          aria-disabled="true"
                          tabIndex={0}
                          title="website offline"
                        >
                          {link.text}
                          <span className="resume__link-tooltip" role="tooltip">website offline</span>
                        </span>
                      ) : (
                        <a className="resume__link" key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.text}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Technologies */}'''

new_content = pattern.sub(new_section, content)

with open("src/pages/ResumePage.tsx", "w") as f:
    f.write(new_content)
