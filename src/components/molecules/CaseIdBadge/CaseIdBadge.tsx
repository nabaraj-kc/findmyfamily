import React from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { CASE_ID_PREFIX } from '@/constants';

export interface CaseIdBadgeProps {
  caseId: string;
  className?: string;
}

export const CaseIdBadge: React.FC<CaseIdBadgeProps> = ({ caseId, className }) => {
  // Extract parts if it follows the pattern Prefix-Year-Number
  let displayValue = caseId;
  
  if (caseId.startsWith(CASE_ID_PREFIX)) {
    // Optionally format or highlight the suffix
    displayValue = caseId;
  }

  return (
    <Badge variant="caseId" className={className}>
      {displayValue}
    </Badge>
  );
};
