import React from "react";

interface MasqueradeIconProps {
  className?: string;
}

export const MasqueradeIcon: React.FC<MasqueradeIconProps> = ({ className = "h-5 w-5" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Masquerade mask shape with M design */}
      <path
        d="M12 2C16.97 2 21 6.03 21 11C21 13.5 20.1 15.8 18.6 17.6L17.4 16.4C18.5 15.1 19.2 13.4 19.2 11.5C19.2 7.1 15.6 3.5 11.2 3.5H11V5.5H11.2C14.5 5.5 17.2 8.2 17.2 11.5C17.2 12.8 16.8 14 16.1 15L15 13.9V11C15 9.3 13.7 8 12 8C10.3 8 9 9.3 9 11V13.9L7.9 15C7.2 14 6.8 12.8 6.8 11.5C6.8 8.2 9.5 5.5 12.8 5.5H13V3.5H12.8C8.4 3.5 4.8 7.1 4.8 11.5C4.8 13.4 5.5 15.1 6.6 16.4L5.4 17.6C3.9 15.8 3 13.5 3 11C3 6.03 7.03 2 12 2Z"
        fill="currentColor"
      />
      {/* Inner M shape */}
      <path
        d="M12 6C14.2 6 16 7.8 16 10V14L14.5 12.5V10.5C14.5 9.1 13.4 8 12 8C10.6 8 9.5 9.1 9.5 10.5V12.5L8 14V10C8 7.8 9.8 6 12 6Z"
        fill="currentColor"
      />
      {/* M letter design inside mask */}
      <path
        d="M10 10V13L11 12L12 13L13 12L14 13V10H13V11.5L12 12.5L11 11.5V10H10Z"
        fill="white"
      />
      {/* Bottom curve for mask effect */}
      <path
        d="M8 16C8.5 18 10 19.5 12 19.5C14 19.5 15.5 18 16 16L15 15.5C14.7 17 13.5 18 12 18C10.5 18 9.3 17 9 15.5L8 16Z"
        fill="currentColor"
      />
    </svg>
  );
};