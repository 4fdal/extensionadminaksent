import React from 'react';

const BackgroundOrbit: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#eff6ff] to-[#dbeafe]">
      {/* Background Blobs (Static for Performance) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#93C5FD] rounded-full mix-blend-multiply filter blur-[120px] opacity-40" />
      <div className="absolute top-[20%] right-[-5%] w-[45%] h-[45%] bg-[#BFDBFE] rounded-full mix-blend-multiply filter blur-[100px] opacity-50" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-[110px] opacity-30" />
      
      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default BackgroundOrbit;
