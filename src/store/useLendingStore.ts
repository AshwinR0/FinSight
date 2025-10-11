import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'lend' | 'repay';
  amount: number;
  date: Date;
  dueDate?: Date;
  note?: string;
}

export interface Borrower {
  id: string;
  name: string;
  avatar: string;
  transactions: Transaction[];
}

interface LendingStore {
  borrowers: Borrower[];
  addBorrower: (borrower: Omit<Borrower, 'id' | 'transactions'>) => void;
  updateBorrower: (id: string, borrower: Partial<Borrower>) => void;
  deleteBorrower: (id: string) => void;
  addTransaction: (borrowerId: string, transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (borrowerId: string, transactionId: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (borrowerId: string, transactionId: string) => void;
}

export const useLendingStore = create<LendingStore>()(
  persist(
    (set) => ({
      borrowers: [],
      addBorrower: (borrower) =>
        set((state) => ({
          borrowers: [
            ...state.borrowers,
            { ...borrower, id: crypto.randomUUID(), transactions: [] },
          ],
        })),
      updateBorrower: (id, updatedBorrower) =>
        set((state) => ({
          borrowers: state.borrowers.map((b) =>
            b.id === id ? { ...b, ...updatedBorrower } : b
          ),
        })),
      deleteBorrower: (id) =>
        set((state) => ({
          borrowers: state.borrowers.filter((b) => b.id !== id),
        })),
      addTransaction: (borrowerId, transaction) =>
        set((state) => ({
          borrowers: state.borrowers.map((b) =>
            b.id === borrowerId
              ? {
                  ...b,
                  transactions: [
                    ...b.transactions,
                    { ...transaction, id: crypto.randomUUID() },
                  ],
                }
              : b
          ),
        })),
      updateTransaction: (borrowerId, transactionId, updatedTransaction) =>
        set((state) => ({
          borrowers: state.borrowers.map((b) =>
            b.id === borrowerId
              ? {
                  ...b,
                  transactions: b.transactions.map((t) =>
                    t.id === transactionId ? { ...t, ...updatedTransaction } : t
                  ),
                }
              : b
          ),
        })),
      deleteTransaction: (borrowerId, transactionId) =>
        set((state) => ({
          borrowers: state.borrowers.map((b) =>
            b.id === borrowerId
              ? {
                  ...b,
                  transactions: b.transactions.filter((t) => t.id !== transactionId),
                }
              : b
          ),
        })),
    }),
    {
      name: 'lending-storage',
    }
  )
);
