import React from 'react';

interface CharacterCardProps {
  id: number;
  name: string;
  image: string;
  onSelect: (id: number) => void;
  selected: number | null;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  id,
  name,
  image,
  onSelect,
  selected,
}) => {
  const isSelected = selected === id;

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={() => onSelect(id)}
        className={`
          aspect-square rounded-xl border-2 overflow-hidden transition-all duration-200
          ${
            isSelected
              ? 'border-primary bg-primary/15 ring-2 ring-primary/40 shadow-[0_0_0_4px_rgba(59,130,246,0.18)]'
              : 'border-border hover:border-primary/30 hover:bg-muted/40'
          }
        `}
      >
        <img
          className={`
            h-full w-full bg-muted transition duration-200
            ${isSelected ? 'scale-[1.02]' : ''}
          `}
          src={image}
          alt="loading"
        />
      </button>
      <h4
        className={`w-full text-center transition-colors ${
          isSelected ? 'font-medium text-primary' : 'text-foreground'
        }`}
      >
        {name}
      </h4>
    </div>
  );
};

export { CharacterCard };
