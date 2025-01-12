import { useState } from "react";

export default function Camera() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.2em"
        viewBox="0 0 512 512"
        className="camera-icon"
        style={{ cursor: "pointer" }} // Inline CSS for cursor
        onMouseEnter={() => setIsHovered(true)} // Event handler for mouse enter
        onMouseLeave={() => setIsHovered(false)} // Event handler for mouse leave
      >
        <path 
          xmlns="http://www.w3.org/2000/svg"
          d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z     M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9    v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z     M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z     M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"
          style={{ fill: isHovered ? "red" : "black", transition: "fill 0.3s" }} // Inline CSS for fill color and transition
        />
        <circle fill="#FFC107" cx="392" cy="128" r="24" />
      </svg> */}

      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z"
          fill="#444444"
        />
        <path
          d="M14.7449 29.4969C22.8883 29.4969 29.4898 22.8954 29.4898 14.752C29.4898 6.60861 22.8883 0.00708008 14.7449 0.00708008C6.60152 0.00708008 -7.62939e-06 6.60861 -7.62939e-06 14.752C-7.62939e-06 22.8954 6.60152 29.4969 14.7449 29.4969Z"
          fill="#444444"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.73584 9.65564H10.9669C11.2597 8.71677 12.1884 8 13.198 8H16.802C17.8116 8 18.7403 8.71677 19.0331 9.65564H21.1935C22.7785 9.65564 24 10.9478 24 12.4621V19.1554C24 20.6697 22.7785 21.8912 21.1935 21.8912H8.73584C7.22154 21.8912 6 20.6697 6 19.1554V12.4621C6 10.9478 7.22154 9.65564 8.73584 9.65564ZM21.2036 11.281C20.6483 11.281 20.2042 11.7353 20.2042 12.3006C20.2042 12.8559 20.6483 13.3202 21.2036 13.3202C21.7487 13.3202 22.1929 12.8559 22.1929 12.3006C22.1929 11.7353 21.7487 11.281 21.2036 11.281ZM14.995 13.3202C16.5093 13.3202 17.7308 14.5519 17.7308 16.0561C17.7308 17.5704 16.5093 18.7919 14.995 18.7919C13.4907 18.7919 12.2591 17.5704 12.2591 16.0561C12.2591 14.5519 13.4907 13.3202 14.995 13.3202ZM14.995 12.0987C17.1554 12.0987 18.9624 13.8957 18.9624 16.0561C18.9624 18.2872 17.1554 20.0236 14.995 20.0236C12.8345 20.0236 11.0376 18.2872 11.0376 16.0561C11.0376 13.8957 12.8345 12.0987 14.995 12.0987Z"
          fill="#FEFEFE"
        />
      </svg>
    </div>
  );
}
