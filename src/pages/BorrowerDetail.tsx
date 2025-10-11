import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, TrendingDown, TrendingUp, Calendar, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { useLendingStore } from '@/store/useLendingStore';
import {
  calculateTotalBorrowed,
  calculateTotalRepaid,
  calculateOutstandingBalance,
  calculateTrustScore,
  getTrustLevel,
  getAverageRepaymentDays,
} from '@/utils/borrowerUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function BorrowerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { borrowers, addTransaction, deleteBorrower } = useLendingStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'lend' | 'repay'>('lend');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const borrower = borrowers.find((b) => b.id === id);

  if (!borrower) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Borrower not found</p>
        <Button onClick={() => navigate('/lending')} className="mt-4">
          Back to Lending
        </Button>
      </div>
    );
  }

  const totalBorrowed = calculateTotalBorrowed(borrower);
  const totalRepaid = calculateTotalRepaid(borrower);
  const outstanding = calculateOutstandingBalance(borrower);
  const trustScore = calculateTrustScore(borrower);
  const trustLevel = getTrustLevel(trustScore);
  const avgDays = getAverageRepaymentDays(borrower);

  const sortedTransactions = [...borrower.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddTransaction = () => {
    if (!amount) {
      toast.error('Please enter an amount');
      return;
    }

    const transactionAmount = parseFloat(amount);
    const wasFullyPaid = outstanding === 0;

    addTransaction(borrower.id, {
      type: transactionType,
      amount: transactionAmount,
      date: new Date(date),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      note: note || undefined,
    });

    const newOutstanding = transactionType === 'lend' 
      ? outstanding + transactionAmount 
      : outstanding - transactionAmount;

    if (!wasFullyPaid && newOutstanding <= 0 && transactionType === 'repay') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      toast.success('🎉 Fully repaid! All cleared!');
    } else {
      toast.success(`${transactionType === 'lend' ? 'Loan' : 'Repayment'} recorded!`);
    }

    setIsAddOpen(false);
    setAmount('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setDueDate('');
    setNote('');
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${borrower.name}?`)) {
      deleteBorrower(borrower.id);
      toast.success('Borrower deleted');
      navigate('/lending');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/lending')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex items-center gap-4">
          <span className="text-6xl">{borrower.avatar}</span>
          <div>
            <h1 className="text-3xl font-bold">{borrower.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={cn(
                  'text-sm px-3 py-1 rounded-full font-medium',
                  trustLevel.color === 'success' && 'bg-success/20 text-success',
                  trustLevel.color === 'warning' && 'bg-warning/20 text-warning',
                  trustLevel.color === 'danger' && 'bg-danger/20 text-danger'
                )}
              >
                {trustLevel.label}
              </span>
              <span className="text-sm text-muted-foreground">Trust Score: {trustScore}%</span>
            </div>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Trust Score */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Trust Score</span>
              <span className="font-bold">{trustScore}%</span>
            </div>
            <Progress value={trustScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground font-medium">Total Borrowed</p>
            <h3 className="text-2xl font-bold mt-1">₹{totalBorrowed.toFixed(2)}</h3>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground font-medium">Total Repaid</p>
            <h3 className="text-2xl font-bold mt-1 text-success">₹{totalRepaid.toFixed(2)}</h3>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground font-medium">Outstanding</p>
            <h3 className={cn('text-2xl font-bold mt-1', outstanding > 0 ? 'text-warning' : 'text-success')}>
              ₹{outstanding.toFixed(2)}
            </h3>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground font-medium">Avg Repayment</p>
            <h3 className="text-2xl font-bold mt-1">{avgDays} days</h3>
          </CardContent>
        </Card>
      </div>

      {/* Due Soon Alert */}
      {borrower.transactions.some((t) => {
        if (!t.dueDate) return false;
        const daysUntilDue = Math.floor(
          (new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilDue >= 0 && daysUntilDue <= 7;
      }) && (
        <Card className="border-warning bg-warning/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-warning" />
              <p className="text-sm font-medium">Payment due soon!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gradient-primary shadow-glow">
                <Plus className="w-5 h-5 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={transactionType === 'lend' ? 'default' : 'outline'}
                    onClick={() => setTransactionType('lend')}
                    className={transactionType === 'lend' ? 'gradient-primary' : ''}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Lend
                  </Button>
                  <Button
                    type="button"
                    variant={transactionType === 'repay' ? 'default' : 'outline'}
                    onClick={() => setTransactionType('repay')}
                    className={transactionType === 'repay' ? 'gradient-secondary' : ''}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Repay
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                {transactionType === 'lend' && (
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date (optional)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="note">Note (optional)</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddTransaction} className="w-full gradient-primary">
                  Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {sortedTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No transactions yet. Add a loan or repayment to start tracking!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center',
                          transaction.type === 'lend' ? 'bg-warning/20' : 'bg-success/20'
                        )}
                      >
                        {transaction.type === 'lend' ? (
                          <TrendingDown className="w-6 h-6 text-warning" />
                        ) : (
                          <TrendingUp className="w-6 h-6 text-success" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(transaction.date), 'MMM d, yyyy')}
                        </p>
                        {transaction.dueDate && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            Due: {format(new Date(transaction.dueDate), 'MMM d, yyyy')}
                          </p>
                        )}
                        {transaction.note && (
                          <p className="text-sm text-muted-foreground mt-1">{transaction.note}</p>
                        )}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'text-xl font-bold',
                        transaction.type === 'lend' ? 'text-warning' : 'text-success'
                      )}
                    >
                      {transaction.type === 'lend' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
