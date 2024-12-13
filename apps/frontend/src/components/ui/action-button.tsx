'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends ButtonProps {
  text: string;
  icon: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, variant, icon, className }) => {
  return (
    <motion.div className='group transition-colors' whileHover='hover'>
      <Button variant={variant} className={cn('relative text-primary hover:text-primary', className)}>
        {text}
        <motion.div
          variants={{
            hover: { x: 4 },
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default ActionButton;
