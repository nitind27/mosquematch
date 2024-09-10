export default function Stop() {
  return (
    <div>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.2em"
        viewBox="0 0 512 512"
        style={{
          fill: 'black', // Default color
          transition: 'fill 0.3s ease', // Smooth transition for color change
          cursor: 'pointer', // Change cursor to pointer on hover
        }}
        onMouseOver={(e) => { e.target.style.fill = 'red'; }} // Change color to red on hover
        onMouseOut={(e) => { e.target.style.fill = 'black'; }} // Revert color on mouse out
      >
        <path d="M367.2 412.5L99.5 144.8C77.1 176.1 64 214.5 64 256c0 106 86 192 192 192c41.5 0 79.9-13.1 111.2-35.5zm45.3-45.3C434.9 335.9 448 297.5 448 256c0-106-86-192-192-192c-41.5 0-79.9 13.1-111.2 35.5L412.5 367.2zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
      </svg> */}

      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="15" cy="15" r="15" fill="#444444" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M19.6438 20.2381C18.3646 21.3754 16.7117 22.0025 15 22C11.1339 22 8 18.8661 8 15C8 13.2178 8.6657 11.5917 9.7619 10.3562L19.6438 20.2381ZM20.2381 19.6438L10.3562 9.76191C11.6354 8.62457 13.2883 7.99746 15 8.00001C18.8661 8.00001 22 11.1339 22 15C22.0025 16.7117 21.3754 18.3646 20.2381 19.6438Z"
          fill="white"
        />
      </svg>
    </div>
  );
}
