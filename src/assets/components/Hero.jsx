import React from 'react';
import { PhoneCall, Clock, CheckCircle, MapPin, Calendar } from 'lucide-react';
import heroone from '../images/heroone.jpg'
import herotwo from '../images/herotwo.jpeg'

const Hero = () => {
  return (
    <section className="bg-[#0A1F44] text-white px-4 py-10">
      <div className="w-full mx-auto flex justify-between gap-10 items-center">
        {/* Left Image */}
        <div className="hidden lg:block w-[25%] h-[400px]">
          <img
            src={heroone}
            alt="Technician at door"
            className="rounded-tl-2xl rounded-bl-2xl h-full object-fill"
          />
        </div>

        {/* Center Content */}
        <div className="w-full lg:w-[60%] text-center space-y-4 px-4 md:px-8">
          <p className="text-gray-400">Maintenances • Repairs • Improvements</p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Need improvement <br /> or repair your home? <br />
            <span className="text-blue-300">we can help!</span>
          </h1>

          {/* Features */}
          <div className="flex justify-center gap-6 text-sm text-blue-200">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Free Quotes</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>100% Commitment-Free</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="bg-[#00B9F1] hover:bg-[#00A1D1] px-6 py-3 rounded-full font-semibold text-white flex items-center justify-center gap-2 mx-auto">
            Call Us Now
            <PhoneCall className="w-5 h-5" />
          </button>
        </div>

        {/* Right Image */}
        <div className="hidden lg:block w-[25%] h-[400px]">
          <img
            src={herotwo}
            alt="Technician fixing toilet"
            className="rounded-tr-2xl rounded-br-2xl h-full object-fill"
          />
        </div>
      </div>

      {/* Bottom Icons */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm text-white">
        <div className="flex flex-col items-center gap-1">
          <CheckCircle className="text-blue-400" />
          <span>Satisfaction Guarantee</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Clock className="text-blue-400" />
          <span>24H Availability</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <MapPin className="text-blue-400" />
          <span>Local US Professional</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Calendar className="text-blue-400" />
          <span>Flexible Appointments</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
