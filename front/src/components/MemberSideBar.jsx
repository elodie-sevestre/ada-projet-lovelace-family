import "../css/MemberSidebar.css";
import pointsIcon from "../assets/icon_points.png";
import sproutAvatar from "../assets/sproot_avatar.png";

// memberInitial : lettre affichée dans le badge (ex: "B")
// memberName : nom complet affiché à côté du badge (ex: "Bernard")
// totalPoints : total de points cumulés par le membre
// progressPercent : avancement vers le prochain palier (0 à 100)

function MemberSidebar({
  memberInitial,
  memberName,
  totalPoints,
  progressPercent = 0,
}) {
  const clampedProgress = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className="member-sidebar-card">
      <img src={sproutAvatar} alt="" className="member-sidebar-avatar" />

      <div className="member-sidebar-badge">
        <span className="member-sidebar-initial">{memberInitial}</span>
        <span className="member-sidebar-name">{memberName}</span>
      </div>

      <p className="member-sidebar-points-label">Total des points</p>

      <div className="member-sidebar-points-value">
        <img src={pointsIcon} alt="" className="member-sidebar-star" />
        <span>{totalPoints}</span>
      </div>

      <div
        className="member-sidebar-progress-track"
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="member-sidebar-progress-fill"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

export default MemberSidebar;
