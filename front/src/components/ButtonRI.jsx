// src/components/ButtonRI.jsx
export default function ButtonRI({
  children,
  size = "md",            // "sm" | "md" | "lg"
  variant = "solid",      // "solid" | "outline"
  className = "",
  style = {},
  bg = "#FEB863",         // สีพื้น (solid) / สีเส้นขอบดีฟอลต์ (outline)
  text = "#FFFDFB",       // สีตัวอักษรตอน solid (outline จะใช้ text || bg)
  type = "button",
  disabled = false,
  onClick,
  /** ใหม่ */
  border,                 // สีกรอบ (option) — ไม่ใส่ = ไม่มีกรอบ (ยกเว้น outline)
  borderWidth = 1,        // ความหนากรอบ (option)
}) {
  const sizeMap = {
    sm: "px-3 py-1 text-sm",
    md: "px-5 py-2 text-base",
    lg: "px-12 py-3.5 text-2xl",
  };

  const isOutline = variant === "outline";

  // สี/พื้นฐานของปุ่ม
  const baseStyle = isOutline
    ? { backgroundColor: "transparent", color: text || bg }
    : { backgroundColor: bg, color: text };

  // จัดการกรอบ: ถ้าเป็น outline ให้มีกรอบเสมอ ใช้สี bg (หรือ border ถ้ากำหนด)
  // ถ้าเป็น solid จะมีกรอบเฉพาะเมื่อส่ง border เข้ามา
  const borderStyle =
    (isOutline || border)
      ? { borderColor: border || bg, borderWidth, borderStyle: "solid" }
      : {};

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-block rounded-3xl font-medium select-none",
        "transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10",
        disabled ? "opacity-60 pointer-events-none" : "hover:opacity-90",
        sizeMap[size],
        className,
      ].join(" ")}
      style={{ ...baseStyle, ...borderStyle, ...style }}
    >
      {children}
    </button>
  );
}
