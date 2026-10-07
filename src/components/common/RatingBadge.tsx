import React from 'react';
import { TechnicalRating } from '../../types/market';

interface RatingBadgeProps {
  rating: TechnicalRating;
  size?: 'sm' | 'md';
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, size = 'md' }) => {
  const getRatingStyle = (r: TechnicalRating) => {
    switch (r) {
      case 'Strong Buy':
        return 'text-[#089981] bg-[#089981]/12 border-[#089981]/25';
      case 'Buy':
        return 'text-[#089981] bg-[#089981]/8 border-[#089981]/15';
      case 'Neutral':
        return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
      case 'Sell':
        return 'text-[#f23645] bg-[#f23645]/8 border-[#f23645]/15';
      case 'Strong Sell':
        return 'text-[#f23645] bg-[#f23645]/15 border-[#f23645]/30';
      default:
        return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded border whitespace-nowrap tabular-nums ${sizeClass} ${getRatingStyle(
        rating
      )}`}
    >
      {rating}
    </span>
  );
};
