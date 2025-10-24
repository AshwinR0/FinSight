export const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6E50E9] relative overflow-hidden">
      <h1 className="absolute top-[10%] lg:top-[2%] md:top-[2%] transform text-[5.5rem] md:text-[12rem] lg:text-[15rem] font-bold text-white">
        FinSight
      </h1>

      {/* <div className="absolute top-[35%] left-[8%] md:top-[15%] md:left-[35%] lg:top-[20%] lg:left-[38%] transform z-10 p-0">
        <img
          src="/finsight_dashboard.svg"
          alt="FinSight Dashboard Iphone"
          className="w-[24rem] md:w-[40rem] lg:w-[50rem]"
        />
      </div>
      <div className="absolute top-[35%] left-[20%] md:top-[20%] md:left-[25%] lg:top-[30%] lg:left-[10%] transform p-0">
        <img
          src="/finsight_lending.svg"
          alt="FinSight Lending Iphone"
          className="w-[24rem] md:w-[36rem] lg:w-[52rem]"
        />
      </div> */}
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
    </div>
  );
};
