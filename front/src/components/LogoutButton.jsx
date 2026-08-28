import onLogoutIcon from "../assets/deconnexion.png";
function LogoutButton({ onLogout }) {
  return (
    <button className="logout-button" onClick={onLogout}>
      <img
        src={onLogoutIcon}
        alt="icone deconnexion"
        className="logout-button-icon"
      />
    </button>
  );
}

export default LogoutButton;
