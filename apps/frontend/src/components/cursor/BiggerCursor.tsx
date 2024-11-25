import { motion } from "framer-motion";

export interface Coors {
  x: number;
  y: number;
}

interface CursorProps {
  coors: Coors;
  clientId: string;
  color?: string;
}

export default function BiggerCursor({
  coors,
  color = "#ffb8b9",
  clientId,
}: CursorProps) {
  const { x, y } = coors;

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-50"
      initial={{ x, y }}
      animate={{ x, y }}
      transition={{
        type: "spring",
        bounce: 0.6,
        damping: 30,
        mass: 0.8,
        stiffness: 350,
        restSpeed: 0.01,
      }}
    >
      <div className="relative">
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill={color}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.701 0.771174L24.8693 8.80848C26.1506 9.27302 26.1985 11.064 24.9439 11.5962L16.9292 14.9958C16.3473 15.2426 15.8806 15.7 15.6229 16.2762L11.704 25.0374C11.1542 26.2666 9.38566 26.2051 8.92279 24.9408L0.778147 2.69403C0.340278 1.498 1.50186 0.336418 2.701 0.771174Z"
            stroke="black"
          />
        </svg>
        <div
          className="absolute left-6 top-6 max-w-28 truncate rounded-md border-[1px] border-black px-2 py-1 text-center text-sm font-semibold shadow-sm"
          style={{ backgroundColor: color }}
        >
          {clientId}
        </div>
      </div>
    </motion.div>
  );
}
