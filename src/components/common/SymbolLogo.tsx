import React, { useState } from 'react';

interface SymbolLogoProps {
  symbol: string;
  logoUrl?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SymbolLogo: React.FC<SymbolLogoProps> = ({
  symbol,
  logoUrl,
  name,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const getFallbackColor = (sym: string) => {
    const colors = [
      'bg-blue-600',
      'bg-emerald-600',
      'bg-indigo-600',
      'bg-amber-600',
      'bg-purple-600',
      'bg-teal-600',
      'bg-rose-600',
    ];
    let hash = 0;
    for (let i = 0; i < sym.length; i++) {
      hash = sym.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (!logoUrl || hasError) {
    const letters = symbol.replace(/[^A-Za-z0-9]/g, '').slice(0, 2).toUpperCase();
    return (
      <div
        className={`${sizeClasses[size]} ${getFallbackColor(
          symbol
        )} rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${className}`}
        title={name || symbol}
      >
        {letters || 'TV'}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-white/5 border border-white/10 ${className}`}
    >
      <img
        src={logoUrl}
        alt={name || symbol}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};
