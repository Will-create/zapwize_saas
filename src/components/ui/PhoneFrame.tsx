import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-black rounded-[40px] p-4 shadow-2xl">
        <div className="bg-white rounded-[30px] overflow-hidden">
          <div className="h-[700px] flex flex-col">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;