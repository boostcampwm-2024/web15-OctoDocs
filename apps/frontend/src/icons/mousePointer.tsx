interface MousePointerProps {
  fill?: string;
  className?: string;
}
export default function MousePointer({ fill, className }: MousePointerProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_570_13)">
        <path
          d="M5.65655 3.8599L18.6378 8.63731C19.9139 9.10697 19.9565 10.9034 18.704 11.4334L14.652 13.1481C14.0711 13.3939 13.6044 13.8514 13.3458 14.4285L11.2629 19.0757C10.7112 20.3068 8.94797 20.24 8.49015 18.9707L3.73369 5.78276C3.3006 4.58195 4.4622 3.42035 5.65655 3.8599Z"
          stroke="black"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_570_13">
          <rect
            width="18"
            height="18"
            fill="white"
            transform="translate(3 3)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
