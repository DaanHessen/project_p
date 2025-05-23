import Typewriter from '../components/Typewriter'
import SocialMediaPanel from '../components/SocialMediaPanel'
import './HomePage.css'

interface HomePageProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  titleComplete: boolean
  setTitleComplete: (complete: boolean) => void
}

const HomePage = ({ currentPage, setCurrentPage, titleComplete, setTitleComplete }: HomePageProps) => {
  const title = `Daan Hessen`
  const subtitle = `// student HBO-ICT at Hogeschool Utrecht`
  const description = `2nd year student at HBO-ICT, specializing in software development. Passionate about building web applications and exploring new technologies. Feel free to contact me through email or social media!`

  const handleArrowClick = () => {
    if (currentPage === 1) {
      setCurrentPage(2)
    } else if (currentPage === 2) {
      setCurrentPage(3)
    } else {
      setCurrentPage(1)
    }
  }

  return (
    <>
      {titleComplete && (
        <SocialMediaPanel 
          currentPage={currentPage}
          onArrowClick={handleArrowClick}
        />
      )}

      <div className={`page page-one page-transition ${currentPage >= 2 ? 'page-slide-up' : ''}`}>
        <div className="content-container">
          <div className="main-content">
            <div className="cli-header">
              <pre className="cli-prompt">
{`$ whoami`}
              </pre>
            </div>

            <Typewriter 
              text={title}
              speed={20}
              onComplete={() => setTitleComplete(true)}
              className="title"
            />
            
            {titleComplete && (
              <>
                <div className="subtitle fade-in">
                  {subtitle}
                </div>
                
                <div className="description fade-in-delayed">
                  {description}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage 