import SEOHead from "../components/SEOHead";
import "./NotFoundPage.css";

export function NotFoundPage({ onNavigateHome }: { onNavigateHome: () => void }) {
  return (
    <>
      <SEOHead title="404 - Not Found" description="The requested page could not be found." noindex />
      <main className="not-found">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">not found</p>
        <button className="not-found__btn" onClick={onNavigateHome}>
          return to home
        </button>
      </main>
    </>
  );
}
