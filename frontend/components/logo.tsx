import { Leaf } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'white';
}

const Logo = ({ size = 'md', variant = 'default' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
  };

  const colorClasses = {
    default: 'text-primary',
    white: 'text-white',
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]}`}>
      <div className={`relative ${variant === 'white' ? 'text-white' : 'text-primary'}`}>
        <Leaf className={`${sizeClasses[size]}`} />
        {/* Scan line animation */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute w-full h-[2px] bg-green-400 dark:bg-green-500 top-1/2 transform -translate-y-1/2 opacity-70 animate-[scan_1.5s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <span 
        className={`font-bold text-${size === 'sm' ? 'base' : size === 'md' ? 'xl' : '2xl'} ${colorClasses[variant]}`}
      >
        AyarCare
      </span>
    </div>
  );
};

export default Logo;