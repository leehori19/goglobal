import React from 'react';
import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';

const DropZone = ({ onDrop, acceptTypes }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: acceptTypes,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <motion.div
      ref={drop}
      className={`p-6 border-2 border-dashed rounded ${isOver ? 'bg-green-100' : 'bg-gray-100'}`}
      initial={{ scale: 1 }}
      animate={{ scale: isOver ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {isOver ? 'Release to drop' : 'Drag items here'}
    </motion.div>
  );
};

export default DropZone;
