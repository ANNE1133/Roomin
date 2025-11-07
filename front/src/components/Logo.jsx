import logoMark from "../assets/logo-mark.svg";

export default function Logo({ size = 32, showText = true, text = "ROOMIN" }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <img
        src={logoMark}
        alt="Roomin logo"
        className="rounded-md"
        draggable="false"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
      {showText && <div className="font-semibold text-lg">{text}</div>}
    </div>
  );
}
