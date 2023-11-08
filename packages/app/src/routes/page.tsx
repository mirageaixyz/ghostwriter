import { useState } from "react";
import Prompt from "./prompt";
import Video from "./video";

const LandingPage = () => {
  const [id, setId] = useState<string>();
  return (
    <div className="flex flex-col w-full min-h-[100dvh] bg-gradient-to-t from-vista-400/25 to-transparent">
      <nav className="sticky top-0 flex items-center py-4 px-8 w-full gap-12 bg-white/40 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-2">
          <img className="w-5 h-5" src="/ai.svg" />
          <span className="font-cal text-lg text-black">ghostwriter</span>
          <span className="flex items-center justify-center px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 text-xs">
            alpha
          </span>
        </div>

        <div className="ml-auto flex items-center justify-center">
          <img
            className="w-9 h-9 rounded-lg hover:border-2 border-vista-400 transition-all"
            src="https://api.dicebear.com/7.x/thumbs/svg?seed=Mittens"
          />
        </div>
      </nav>
      <section className="relative flex flex-col items-center justify-center flex-1 w-full h-full">
        {id && <Video key={id} id={id} reset={() => setId(undefined)} />}
        <Prompt id={id} setId={setId} />
      </section>
    </div>
  );
};

export default LandingPage;
