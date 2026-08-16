import FloatingRobot from "@/components/FloatingRobot";
import { useNavigate } from "react-router-dom";


export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-br from-brand to-accent-violet px-8 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            Supercharge Your Conversations with <span className="text-accent-yellow">AI Chat.</span>
          </h1>
          <p className="mt-5 max-w-md text-white/85">
            Say goodbye to long wait times and repetitive questions. Get instant, tailored answers whenever you need them.
          </p>
          <button onClick={() => navigate("/signup")} className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand hover:bg-white/90">
            Get Started Free
          </button>
        </div>
        {/* <div className="flex justify-center">
          <div className="flex h-64 w-64 items-center justify-center rounded-full bg-white/10">
            <div className="h-40 w-40 rounded-3xl bg-white/20" />
          </div>
        </div> */}
        <div className="flex justify-center">
          <FloatingRobot size="w-72" topOffset="0px" shadowOpacity={[0.4, 0.2, 0.4]} />
        </div>
      </div>
    </section>
  );
}

