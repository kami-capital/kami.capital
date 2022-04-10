import KamiLogo from "../../assets/logo.png";
 
export default function NotFound() {
  return (
    <div id="not-found">
      <div className="not-found-header">
        <a href="https://kami.finance" target="_blank">
          <img className="branding-header-icon" src={KamiLogo} alt="Kami" />
        </a>

        <h4>Page not found</h4>
      </div>
    </div>
  );
}
