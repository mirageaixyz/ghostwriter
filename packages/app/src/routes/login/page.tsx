import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-3">
      <h1 className="font-bold text-white ">Login</h1>

      <div className="flex flex-col">
        <label className="text-white/60">Email</label>
        <input />
      </div>

      <div className="flex flex-col">
        <label className="text-white/60">Password</label>
        <input />
      </div>

      <Link
        to="/app/presidents"
        className="relative group flex items-center justify-center px-4 py-1 mt-5 rounded-md 
        bg-gradient-to-r from-vista-500 to-blue-400 border-2 border-vista-400"
      >
        <span className="absolute w-full h-full group-hover:bg-black/20 transition-all rounded-md" />
        <span className="relative text-white text-sm">Login</span>
      </Link>
    </div>
  );
};

export default Login;
