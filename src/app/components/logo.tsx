import React from 'react';
import logo from '../../assets/logo/logo.gif';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="mb-6 flex h-32 w-64 items-center justify-center">
        <img src={logo} alt="" />
      </div>
    </div>
  );
};

export { Logo };
