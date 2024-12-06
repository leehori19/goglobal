import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ id, type, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-4 m-2 bg-blue-500 text-white rounded ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
