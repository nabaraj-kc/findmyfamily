import React from 'react';
import styles from './Section.module.css';

export interface SectionProps {
  children: React.ReactNode;
  background?: 'primary' | 'secondary' | 'accent' | 'transparent';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  background = 'transparent',
  padding = 'md',
  className = '',
  id,
}) => {
  return (
    <section 
      id={id}
      className={`${styles.section} ${styles[`bg-${background}`]} ${styles[`pad-${padding}`]} ${className}`}
    >
      {children}
    </section>
  );
};
