import React from 'react';
import { Icon } from '../../atoms/Icon/Icon';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
}

export const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = 'neutral'
}) => {
  return (
    <div style={{
      backgroundColor: '#111113',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-6)',
      border: '1px solid #27272a',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '130px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </h3>
        <div style={{ 
          backgroundColor: '#1c1c20', 
          border: '1px solid #27272a',
          padding: 'var(--space-2)', 
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon name={icon} size={18} style={{ color: '#ffffff' }} />
        </div>
      </div>
      
      <div style={{ marginTop: 'var(--space-3)' }}>
        <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', color: '#ffffff' }}>
          {value}
        </span>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-1)' }}>
            <Icon 
              name={trendDirection === 'up' ? 'TrendingUp' : trendDirection === 'down' ? 'TrendingDown' : 'Minus'} 
              size={12} 
              style={{ color: '#a1a1aa' }} 
            />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: '#a1a1aa' }}>
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
