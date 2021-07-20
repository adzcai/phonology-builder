import React, { MouseEventHandler } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const buttonDirectionStyles = {
  top: 'left-1/2 top-0',
  left: 'left-0 top-1/2',
  bottom: 'left-1/2 top-full',
  right: 'left-full top-1/2',
};

const buttonSizeStyles = {
  sm: 'p-1',
  lg: 'p-3',
  tall: 'px-1 py-3',
};

export default function ModalButton({
  direction, onClick, size = 'sm', state = 'plus', children,
}: React.PropsWithChildren<{
  direction: string | 'top' | 'left' | 'bottom' | 'right';
  size?: 'sm' | 'lg' | 'tall';
  state?: 'plus' | 'minus';
  onClick: MouseEventHandler<HTMLButtonElement>;
}>) {
  return (
    <button
      type="button"
      className={`absolute z-10 focus:outline-none
                  transform -translate-x-1/2 -translate-y-1/2
                  ${direction in buttonDirectionStyles ? buttonDirectionStyles[direction] : direction}
                  ${buttonSizeStyles[size]} rounded-xl
                  ${state === 'plus' ? 'bg-green-300 hover:bg-green-500' : 'bg-red-300 hover:bg-red-500'} transition-colors`}
      onClick={onClick}
    >
      {children || (state === 'plus' ? <FaPlus /> : <FaMinus />)}
    </button>
  );
}
