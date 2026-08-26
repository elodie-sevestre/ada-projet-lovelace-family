import onLogoutIcon from "../assets/deconnexion.png";
function LogoutButton({ onLogout }) {
  return (
    <button onClick={onLogout}>
      <img
        src={onLogoutIcon}
        alt="icone deconnexion"
        className="logout-button-icon"
      />
    </button>
  );
}

export default LogoutButton;
