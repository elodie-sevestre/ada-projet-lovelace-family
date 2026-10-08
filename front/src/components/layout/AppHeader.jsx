import LogoutButton from "../buttons/LogoutButton.jsx";
import logoWebSite from "../../assets/logo-sprout-quest.png";

function AppHeader({ memberTribe, memberInitial, memberName, onLogout }) {
  return (
    <header className="app-header">
      <div className="app-header-left">
        <img
          className="logo-web-site"
          src={logoWebSite}
          alt="logo du site web"
        />
        <div className="app-header-title">
          <h1 className="app-header-title-main">
            Tableau de bord - {memberTribe}
          </h1>
        </div>
      </div>
      <div className="app-header-right">
        <div className="app-header-user">
          <span className="app-header-initial">{memberInitial}</span>
          <span className="app-header-name">{memberName}</span>
        </div>
        <LogoutButton onLogout={onLogout} />
      </div>
    </header>
  );
}

export default AppHeader;
