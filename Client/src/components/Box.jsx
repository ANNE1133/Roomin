export default function Box({
  title,
  subtitle,
  right,
  children,
  footer,
  variant = "default",
  className = "",
  bodyClass = "",
  bg, // ✅ เพิ่ม prop สีพื้นหลังใหม่
}) {
  const baseStyles =
    "rounded-2xl overflow-hidden transition-all duration-300";

  const variantStyles = {
    default: "bg-white text-black",
    lavender: "bg-[#E7DDF1] text-black",
    peach: "bg-[#FFE6C8] text-black",
    outlined: "bg-transparent border border-[#E0E0E0]",
    soft: "bg-[#F9F9F9] text-black",
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant] || ""} ${className}`}
      style={bg ? { backgroundColor: bg } : {}} // ✅ ใช้สีที่ส่งมา override
    >
      {/* Header */}
      {(title || right) && (
        <div className="flex items-center justify-between p-4 pb-0">
          <div>
            {title && (
              <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-black/60 mt-1">{subtitle}</p>
            )}
          </div>
          {right && <div>{right}</div>}
        </div>
      )}

      {/* Body */}
      <div className={`p-4 ${bodyClass}`}>{children}</div>

      {/* Footer */}
      {footer && <div className="p-4 pt-0">{footer}</div>}
    </div>
  );
}
