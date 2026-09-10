import re

def update_transitions(file_path):
    with open(file_path, "r") as f:
        css = f.read()

    # Replace `.home__scrim::before, .home__scrim::after` generic transitions
    css = re.sub(r'transition: opacity 0\.5s ease;', '', css)
    
    # Add specific transitions for before
    css = css.replace(
        '''opacity: 1;
}

.home__scrim::after {''', 
        '''opacity: 1;
  transition: opacity 0.5s ease 0.4s;
}

.home__scrim::after {'''
    )
    
    css = css.replace(
        '''opacity: 0;
}

html[data-theme="light"] .home__scrim::before { opacity: 0; }''', 
        '''opacity: 0;
  transition: opacity 0.2s ease 0s;
}

html[data-theme="light"] .home__scrim::before { 
  opacity: 0; 
  transition: opacity 0.2s ease 0s;
}'''
    )
    
    css = css.replace(
        '''html[data-theme="light"] .home__scrim::after { opacity: 1; }''',
        '''html[data-theme="light"] .home__scrim::after { 
  opacity: 1; 
  transition: opacity 0.5s ease 0.4s;
}'''
    )

    # Do the same for vignette
    css = css.replace(
        '''opacity: 1;
}

.home__vignette::after {''', 
        '''opacity: 1;
  transition: opacity 0.5s ease 0.4s;
}

.home__vignette::after {'''
    )
    
    css = css.replace(
        '''opacity: 0;
}

html[data-theme="light"] .home__vignette::before { opacity: 0; }''', 
        '''opacity: 0;
  transition: opacity 0.2s ease 0s;
}

html[data-theme="light"] .home__vignette::before { 
  opacity: 0; 
  transition: opacity 0.2s ease 0s;
}'''
    )
    
    css = css.replace(
        '''html[data-theme="light"] .home__vignette::after { opacity: 1; }''',
        '''html[data-theme="light"] .home__vignette::after { 
  opacity: 1; 
  transition: opacity 0.5s ease 0.4s;
}'''
    )

    with open(file_path, "w") as f:
        f.write(css)

def update_globals(file_path):
    with open(file_path, "r") as f:
        css = f.read()

    css = re.sub(r'transition: opacity 0\.5s ease;', '', css)
    
    css = css.replace(
        '''opacity: 1;
}

.app--flow::after {''', 
        '''opacity: 1;
  transition: opacity 0.5s ease 0.4s;
}

.app--flow::after {'''
    )
    
    css = css.replace(
        '''opacity: 0;
}

html[data-theme="light"] .app--flow::before { opacity: 0; }''', 
        '''opacity: 0;
  transition: opacity 0.2s ease 0s;
}

html[data-theme="light"] .app--flow::before { 
  opacity: 0; 
  transition: opacity 0.2s ease 0s;
}'''
    )
    
    css = css.replace(
        '''html[data-theme="light"] .app--flow::after { opacity: 1; }''',
        '''html[data-theme="light"] .app--flow::after { 
  opacity: 1; 
  transition: opacity 0.5s ease 0.4s;
}'''
    )

    with open(file_path, "w") as f:
        f.write(css)


update_transitions("src/pages/HomePage.css")
update_globals("src/globals.css")
