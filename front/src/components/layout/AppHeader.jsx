import LogoutButton from "../buttons/LogoutButton.jsx";
import logoWebSite from "../../assets/logo-sprout-quest.png";

function AppHeader({ memberTribe, memberInitial, memberName, onLogout }) {
  return (
    <header className="app-header">
      <img className="logo-web-site" src={logoWebSite} alt="logo du site web" />
      <div className="app-header-title">
        <span className="app-header-kicker">Tableau de bord</span>
        <h1 className="app-header-title-main">{memberTribe}</h1>
      </div>

      <div className="app-header-user">
        <span className="app-header-initial">{memberInitial}</span>
        <span className="app-header-name">{memberName}</span>
      </div>
      <LogoutButton onLogout={onLogout} />
    </header>
  );
}

export default AppHeader;
