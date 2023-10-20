import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="flex flex-col w-full min-h-[100dvh]">
      <nav className="sticky top-0 flex items-center pb-4 pt-6 px-8 md:px-16 w-full gap-12 bg-black/40 backdrop-blur-xl">
        <span className="font-cal text-xl text-white">ghostwriter</span>

        <div className="hidden md:flex items-center gap-10 mt-1">
          <Link to="/pricing" className="text-white">
            Pricing
          </Link>
          <Link to="/pricing" className="text-white">
            Docs
          </Link>
          <Link to="/pricing" className="text-white">
            Blog
          </Link>
        </div>
        <Link
          to="/login"
          className="ml-auto relative group flex items-center justify-center px-3 py-1.5 rounded-md 
          bg-gradient-to-r from-vista-500 to-blue-400 border-2 border-vista-400"
        >
          <span className="absolute w-full h-full group-hover:bg-black/20 transition-all rounded-md" />
          <span className="relative text-sm md:text-base text-white">
            Get Started
          </span>
        </Link>
      </nav>
      <section className="flex flex-col items-center justify-start pt-[40%] md:pt-[10%] flex-1 w-full h-full">
        <h1 className="font-medium text-white text-3xl sm:text-4xl md:text-7xl max-w-[900px] text-center [text-wrap:balance] font-cal">
          One Click Away from Becoming a Viral Sensation
        </h1>

        <span className="text-white/90 sm:text-lg md:text-xl my-12 max-w-[900px] text-center [text-wrap:balance]">
          Empowering the new wave of creators, this app harnesses the latest in
          AI technology for seamless and efficient content production
        </span>
        <Link
          to="/login"
          className="relative group flex items-center justify-center px-4 md:px-6 py-2 md:py-3 rounded-md 
        bg-gradient-to-r from-vista-500 to-blue-400 border-2 border-vista-400"
        >
          <span className="absolute w-full h-full group-hover:bg-black/20 transition-all rounded-md" />
          <span className="relative text-lg md:text-xl text-white">
            Get Started
          </span>
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
