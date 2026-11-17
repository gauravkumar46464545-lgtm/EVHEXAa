export default function CarRig({ className = "" }) {
  return (
    <div className={`rig ${className}`} aria-hidden="true">
      <div className="rig-shadow" /><div className="rig-trail" /><div className="rig-refl" /><div className="rig-body" />
      <div className="rig-pool" /><div className="rig-beam" /><div className="rig-hl" /><div className="rig-tl" />
      <div className="whl whl-f" /><div className="whl whl-r" />
    </div>);
}
