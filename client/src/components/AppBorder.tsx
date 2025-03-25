import React from "react";

interface AppBorderProps {
  children: React.ReactNode;
}

export const AppBorder: React.FC<AppBorderProps> = ({ children }) => {
  return (
    <div className="w-full max-w-4xl mx-auto relative bg-gradient-to-r from-[#E34C26] via-[#F7DF1E] to-[#8CC84B] p-[3px] rounded-xl overflow-hidden">
      <div className="tech-icons absolute inset-0 pointer-events-none">
        {/* HTML5 Icons */}
        <i className="tech-icon fa-brands fa-html5 absolute text-2xl text-white opacity-50" style={{ top: '5%', left: '10%', animation: 'floatAround 30s linear infinite' }}></i>
        <i className="tech-icon fa-brands fa-html5 absolute text-2xl text-white opacity-50" style={{ top: '80%', left: '85%', animation: 'floatAround 30s linear infinite -5s' }}></i>
        
        {/* CSS3 Icons */}
        <i className="tech-icon fa-brands fa-css3-alt absolute text-2xl text-white opacity-50" style={{ top: '15%', left: '75%', animation: 'floatAround 30s linear infinite -3s' }}></i>
        <i className="tech-icon fa-brands fa-css3-alt absolute text-2xl text-white opacity-50" style={{ top: '65%', left: '5%', animation: 'floatAround 30s linear infinite -8s' }}></i>
        
        {/* JS Icons */}
        <i className="tech-icon fa-brands fa-js absolute text-2xl text-white opacity-50" style={{ top: '30%', left: '5%', animation: 'floatAround 30s linear infinite -12s' }}></i>
        <i className="tech-icon fa-brands fa-js absolute text-2xl text-white opacity-50" style={{ top: '90%', left: '30%', animation: 'floatAround 30s linear infinite -15s' }}></i>
        
        {/* Node.js Icons */}
        <i className="tech-icon fa-brands fa-node-js absolute text-2xl text-white opacity-50" style={{ top: '45%', left: '90%', animation: 'floatAround 30s linear infinite -7s' }}></i>
        <i className="tech-icon fa-brands fa-node-js absolute text-2xl text-white opacity-50" style={{ top: '10%', left: '40%', animation: 'floatAround 30s linear infinite -20s' }}></i>
      </div>
      {children}
      
      <style jsx>{`
        @keyframes floatAround {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(100px, 50px) rotate(90deg); }
          50% { transform: translate(0, 100px) rotate(180deg); }
          75% { transform: translate(-100px, 50px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
