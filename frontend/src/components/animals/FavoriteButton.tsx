import React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '../common/Button';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  isFavorite,
  onClick,
  disabled = false,
}) => {
  return (
    <Button
      variant={isFavorite ? 'primary' : 'outline'}
      onClick={onClick}
      disabled={disabled}
      className="group"
    >
      <Heart
        size={20}
        className={`mr-2 transition-all ${isFavorite ? 'fill-white' : 'group-hover:fill-primary'}`}
      />
      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
    </Button>
  );
};






