// import FloatingRobot from "@/components/FloatingRobot";
// import { useNavigate } from "react-router-dom";


// export default function Hero() {
//   const navigate = useNavigate();
//   return (
//     <section className="flex min-h-screen items-center bg-gradient-to-br from-brand to-accent-violet px-8 py-20">
//       <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
//         <div>
//           <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
//             Supercharge Your Conversations with <span className="text-accent-yellow">AI Chat.</span>
//           </h1>
//           <p className="mt-5 max-w-md text-white/85">
//             Say goodbye to long wait times and repetitive questions. Get instant, tailored answers whenever you need them.
//           </p>
//           <button onClick={() => navigate("/signup")} className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand hover:bg-white/90">
//             Get Started Free
//           </button>
//         </div>
//         {/* <div className="flex justify-center">
//           <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/10">
//             <div className="h-40 w-40 rounded-3xl bg-white/20" />
//           </div>
//         </div> */}
//         <div className="flex justify-center">
//           <FloatingRobot size="w-72" topOffset="0px" shadowOpacity={[0.4, 0.2, 0.4]} />
//         </div>
//       </div>
//     </section>
//   );
// }

import { useNavigate } from "react-router-dom";
import FloatingRobot from "@/components/FloatingRobot";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-brand to-accent-violet px-4 py-16 sm:px-8">
  <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-12">
    <div className="text-center md:text-left">
      <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
        Supercharge Your Conversations with <span className="text-accent-yellow">AI Chat.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-md text-white/85 md:mx-0">
        Say goodbye to long wait times and repetitive questions. Get instant, tailored answers whenever you need them.
      </p>
      <button onClick={() => navigate("/signup")} className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand hover:bg-white/90">
        Get Started Free
      </button>
    </div>

    <div className="relative flex items-center justify-center">
      <div className="absolute h-[260px] w-[260px] rounded-full border border-white/20 sm:h-[420px] sm:w-[420px]" />
      <div className="absolute h-[190px] w-[190px] rounded-full border border-white/15 sm:h-[300px] sm:w-[300px]" />
      <FloatingRobot size="w-40 sm:w-64" topOffset="0px" shadowOpacity={[0.4, 0.2, 0.4]} />
    </div>
  </div>
</section>
  );
}