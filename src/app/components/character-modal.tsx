import * as Dialog from '@radix-ui/react-dialog';
import murom from '../../assets/gifs/murom.gif';
import pin from '../../assets/gifs/pin.gif';
import spud from '../../assets/gifs/spud.gif';
import { CharacterCard } from './character-card';

interface CharacterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: number | null;
  onSelect: (id: number) => void;
  onConfirm: () => void;
}

const characters = [
  {
    id: 2,
    name: 'Муромец',
    image: murom,
  },
  {
    id: 1,
    name: 'Пин',
    image: pin,
  },
  {
    id: 3,
    name: 'Картошка',
    image: spud,
  },
];

export function CharacterModal({
  open,
  onOpenChange,
  selected,
  onSelect,
  onConfirm,
}: CharacterModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content className="fixed left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-medium">
            Выбор персонажа
          </Dialog.Title>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {characters.map(({ id, name, image }) => (
              <CharacterCard
                key={id}
                id={id}
                name={name}
                image={image}
                onSelect={onSelect}
                selected={selected}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-lg px-4 py-2 text-sm hover:bg-muted"
            >
              Закрыть
            </button>

            <button
              onClick={onConfirm}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Выбрать
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
