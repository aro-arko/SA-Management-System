const RocketSVG = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M41.5 2C28 3 17.5 13.5 15 27.5L7 35.5L14.5 43L22.5 36C36.5 33.5 47 23 48 9.5L41.5 2Z"
      fill="#EF4444"
      stroke="#7F1D1D"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="36"
      cy="17"
      r="3"
      fill="#FDE68A"
      stroke="#B45309"
      strokeWidth="1.5"
    />
    <path
      d="M20 44L19 51L26 48"
      stroke="#FBBF24"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M26 51L25 57L31 55"
      stroke="#FBBF24"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M32 52L32 58L38 56"
      stroke="#FBBF24"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default RocketSVG;
