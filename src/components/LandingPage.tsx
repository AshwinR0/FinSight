export const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6E50E9] p-4">
      <h1 className="absolute top-4 text-[13rem] font-bold text-white">
        FinSight
      </h1>
      <div className=" absolute top-28 right-72 z-10">
        <img
          src="/finsight_dashboard.svg"
          alt="FinSight Dashboard Iphone"
          className="w-[40rem] h-[45rem]"
        />
      </div>
      <div className="absolute top-[4.5rem] left-52 z-7">
        <img
          src="/finsight_lending.svg"
          alt="FinSight Lending Iphone"
          className="w-[45rem] h-[52rem]"
        />
      </div>
    </div>
  );
};
