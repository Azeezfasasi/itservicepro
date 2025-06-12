import React from 'react';
import {
  Wrench,
  Hammer,
  ShieldCheck,
  Trees,
  Fan,
  Bath,
  KeyRound,
  Home,
} from 'lucide-react';

const services = [
  {
    icon: <Hammer className="w-6 h-6 text-white" />,
    title: 'Plumbing services',
    desc: 'Drain pipe leaking, pipe clogged, replace the pipe line',
  },
  {
    icon: <Home className="w-6 h-6 text-white" />,
    title: 'Roofing repair',
    desc: 'Roof leaks, tile replacement, roof cleaning and maintenance',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    title: 'Mold Removal',
    desc: 'Removing and cleaning mildew, Restoration and Prevention',
  },
  {
    icon: <Trees className="w-6 h-6 text-white" />,
    title: 'Tree Trimming',
    desc: 'Trimming and cleaning, Deadwood removal, Tree shaping',
  },
  {
    icon: <Fan className="w-6 h-6 text-white" />,
    title: 'Appliance Repair',
    desc: 'repair of washing machines, refrigerators, Air conditioner, etc',
  },
  {
    icon: <Bath className="w-6 h-6 text-white" />,
    title: 'Bathroom Remodeling',
    desc: 'Design and Consulting, installation, Repairing, tile repair',
  },
  {
    icon: <KeyRound className="w-6 h-6 text-white" />,
    title: 'Locksmith',
    desc: 'Lock Installation and Repair, Duplication, Lock Rekeying',
  },
];

const ServicesSection = () => {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Services</h2>
          <p className="mt-2 text-gray-500 max-w-2xl mx-auto">
            You have problems with leaking pipes, broken tiles, lost keys or want to tidy up the trees around you, of course you need our help!
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col gap-4 items-center md:items-start justify-center mx-auto h-[200px] px-2 border border-solid border-gray-300 shadow-lg rounded-md">
              <div className="bg-[#0A1F44] p-3 rounded-lg">
                {service.icon}
              </div>
              <div className='flex flex-col items-center md:items-start'>
                <h3 className="font-semibold text-gray-800">{service.title}</h3>
                <p className="text-sm text-gray-500">{service.desc}</p>
              </div>
            </div>
          ))}

          {/* Call to Action Box */}
          <div className="bg-[#00B9F1] text-white p-6 rounded-xl flex flex-col items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold mb-2">More service?</h4>
              <p className="text-sm">You can tell us what you need and we can help!</p>
            </div>
            <button className="mt-6 bg-white text-[#00B9F1] font-semibold px-6 py-2 rounded-full">
              Call Us Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
