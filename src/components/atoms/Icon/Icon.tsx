'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

export interface IconProps extends LucideProps {
  name: string;
}

// Icon alias map for any legacy or alternative names
const ICON_ALIASES: Record<string, string> = {
  PhoneAlert: 'PhoneCall',
  FileText: 'FileText',
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 20, 
  strokeWidth = 1.5, 
  'aria-label': ariaLabel, 
  ...props 
}) => {
  const resolvedName = ICON_ALIASES[name] || name;
  const IconComponent = (LucideIcons as any)[resolvedName] || LucideIcons.HelpCircle;

  if (!IconComponent) {
    return null;
  }

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      {...props}
    />
  );
};
