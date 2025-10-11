import { Borrower } from '@/store/useLendingStore';

export const calculateTotalBorrowed = (borrower: Borrower): number => {
  return borrower.transactions
    .filter((t) => t.type === 'lend')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalRepaid = (borrower: Borrower): number => {
  return borrower.transactions
    .filter((t) => t.type === 'repay')
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateOutstandingBalance = (borrower: Borrower): number => {
  return calculateTotalBorrowed(borrower) - calculateTotalRepaid(borrower);
};

export const calculateTrustScore = (borrower: Borrower): number => {
  const totalBorrowed = calculateTotalBorrowed(borrower);
  const totalRepaid = calculateTotalRepaid(borrower);
  
  if (totalBorrowed === 0) return 100;
  
  const repaymentRate = (totalRepaid / totalBorrowed) * 100;
  const latePayments = borrower.transactions.filter((t) => {
    if (t.type !== 'repay' || !t.dueDate) return false;
    return new Date(t.date) > new Date(t.dueDate);
  }).length;
  
  const score = Math.max(0, Math.min(100, repaymentRate - (latePayments * 5)));
  return Math.round(score);
};

export const getTrustLevel = (score: number): { label: string; color: string } => {
  if (score >= 80) return { label: 'Reliable', color: 'success' };
  if (score >= 50) return { label: 'Average', color: 'warning' };
  return { label: 'Risky', color: 'danger' };
};

export const getAverageRepaymentDays = (borrower: Borrower): number => {
  const repayments = borrower.transactions.filter((t) => t.type === 'repay');
  if (repayments.length === 0) return 0;
  
  const totalDays = repayments.reduce((sum, repayment) => {
    const lend = borrower.transactions
      .filter((t) => t.type === 'lend' && new Date(t.date) < new Date(repayment.date))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    
    if (!lend) return sum;
    
    const days = Math.floor(
      (new Date(repayment.date).getTime() - new Date(lend.date).getTime()) /
      (1000 * 60 * 60 * 24)
    );
    return sum + days;
  }, 0);
  
  return Math.round(totalDays / repayments.length);
};
