import React from 'react';
import styles from './Container.module.css';

export interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  as?: React.ElementType;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component className={`${styles.container} ${styles[`size-${size}`]} ${className}`}>
      {children}
    </Component>
  );
};
