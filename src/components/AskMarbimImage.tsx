// Real MARBIM mark shipped in /public/assets.
const marbimAILogo = "/assets/marbim.svg";

interface AskMarbimImageProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  alt?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function AskMarbimImage({
  size = "lg",
  className = "",
  alt = "Ask MARBIM",
}: AskMarbimImageProps) {
  return (
    <img
      src={marbimAILogo}
      alt={alt}
      className={`${sizeClasses[size]} object-contain transition-transform duration-180 group-hover:scale-110 ${className}`}
    />
  );
}