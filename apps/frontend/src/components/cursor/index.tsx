import { motion } from "framer-motion";

export interface Coors {
  x: number;
  y: number;
}

interface CursorProps {
  coors: Coors;
  color?: string;
}

export default function Cursor({ coors, color = "#ffb8b9" }: CursorProps) {
  const { x, y } = coors;

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-50 h-6 w-6"
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
      <svg viewBox="0 0 94 99" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.40255 5.31234C1.90848 3.6645 3.58743 2.20312 5.15139 2.91972L90.0649 41.8264C91.7151 42.5825 91.5858 44.9688 89.8637 45.5422L54.7989 57.2186C53.3211 57.7107 52.0926 58.7582 51.3731 60.1397L33.0019 95.4124C32.1726 97.0047 29.8279 96.7826 29.3124 95.063L2.40255 5.31234Z"
          fill={color}
          stroke="black"
          stroke-width="4"
        />
      </svg>
    </motion.div>
  );
}
