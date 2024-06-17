import React from "react";
import bannerImg from "/images/home/bannerimg.png";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
      <div className="py-24 flex flex-col md:flex-row-reverse items-center justify-between gap-8">
        {/* img */}
        <div className="md:w-1/2">
          <img src={bannerImg} alt="" />
          <div className="flex flex-col md:flex-row items-center justify-around -mt-14 gap-4"></div>
        </div>

        {/* texts */}
        <div className="md:w-1/2 px-4 space-y-7">
          <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
            Elevate Your Production with{" "}
            <span className="text-deepblue">GEARSTREAM</span>
          </h2>
          <p className="text-[#4A4A4A] text-xl">
            Welcome to GearStream your ultimate destination for premium video
            and photo production equipment rental
          </p>
          <button
            onClick={() => navigate("/gears")}
            className="bg-deepblue font-semibold btn text-white px-8 py-3 rounded-full"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
