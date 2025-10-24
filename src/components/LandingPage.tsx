import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();
  const handleSignin = () => {
    navigate("/signin");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6E50E9] relative overflow-hidden">
      <h1 className="absolute top-[10%] lg:top-[2%] md:top-[2%] transform text-[5.5rem] md:text-[12rem] lg:text-[15rem] font-bold text-white">
        FinSight
      </h1>
      <div className="relative flex items-center justify-center mt-[0rem] md:mt-40 lg:mt-40 overflow-hidden">
        <img
          src="/finsight_lending.svg"
          alt="FinSight Lending Iphone"
          className="w-[80vw] md:min-w-[550px] max-w-[900px]
            relative
            z-0
            translate-x-[25%]
            md:translate-x-[20%]
            md:translate-y-[10%]
            lg:translate-x-[25%]
            lg:translate-y-[15%]
            transition-all"
        />
        <img
          src="/finsight_dashboard.svg"
          alt="FinSight Dashboard Iphone"
          className="w-[75vw] md:min-w-[550px] max-w-[800px]
            relative
            z-10
            -translate-x-[33%]
            -translate-y-[1%]
            md:-translate-x-[15%]
            md:-translate-y-[5%]
            lg:-translate-x-[20%]
            lg:-translate-y-[5%]
            transition-all"
        />
      </div>
      <div className="absolute bottom-14 p-2 rounded-full bg-white flex gap-4 z-20">
        <button
          className="bg-[#6E50E9] text-white font-extrabold p-2 px-3 rounded-full"
          onClick={handleSignin}
        >
          Get Started
        </button>
        <button className="bg-[#F5C542] text-white font-extrabold p-2 px-3 rounded-full">
          Install App
        </button>
      </div>
    </div>
  );
};
