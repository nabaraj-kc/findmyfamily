export const savePendingSubmission = (data: any) => {
  if (typeof window === 'undefined') return;
  const existing = getPendingSubmissions();
  existing.push({
    id: `PENDING-${Math.floor(1000 + Math.random() * 9000)}`,
    data,
    timestamp: Date.now(),
  });
  localStorage.setItem('fmf_pending_submissions', JSON.stringify(existing));
};

export const getPendingSubmissions = () => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('fmf_pending_submissions');
  return stored ? JSON.parse(stored) : [];
};

export const removePendingSubmission = (id: string) => {
  if (typeof window === 'undefined') return;
  const existing = getPendingSubmissions();
  const updated = existing.filter((item: any) => item.id !== id);
  localStorage.setItem('fmf_pending_submissions', JSON.stringify(updated));
};
