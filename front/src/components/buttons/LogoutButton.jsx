import onLogoutIcon from "../../assets/deconnexion.png";

function LogoutButton({ onLogout }) {
  return (
    <button
      type="button"
      className="logout-button"
      onClick={onLogout}
      aria-label="Se déconnecter"
    >
      <img src={onLogoutIcon} alt="" className="logout-button-icon" />
      <span className="logout-button-label">Se déconnecter</span>
    </button>
  );
}

export default LogoutButton;
