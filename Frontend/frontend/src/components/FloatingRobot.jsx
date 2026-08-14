// import { motion } from "framer-motion";
// import robotImg from "@/assets/robot.png";

// export default function FloatingRobot({ size = "w-56", topOffset = "20px", className = "" }) {
//   return (
//     <motion.img
//       src={robotImg}
//       alt=""
//       className={`${size} drop-shadow-2xl ${className}`}
//       style={{ position: "relative", top: topOffset }}
//       animate={{ y: [0, -14, 0] }}
//       transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
//     />
//   );
// }

import { motion } from "framer-motion";
import robotImg from "@/assets/robot.png";

export default function FloatingRobot({
  size = "w-56",
  topOffset = "20px",
  className = "",
  showShadow = true,
  shadowOpacity = [0.18, 0.08, 0.18],
}) {
  return (
    <div className="relative flex flex-col items-center">
      <motion.img
        src={robotImg}
        alt=""
        className={`${size} drop-shadow-2xl ${className}`}
        style={{ position: "relative", top: topOffset }}
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {showShadow && (
        <motion.div
          className="mt-[-6px] h-3 w-24 rounded-full bg-black/40 blur-lg"
          animate={{ scaleX: [1, 0.85, 1], opacity: shadowOpacity }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}