import { useState } from 'react';
import { Plus, TrendingUp, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLendingStore } from '@/store/useLendingStore';
import { calculateTotalBorrowed, calculateTotalRepaid, calculateOutstandingBalance, calculateTrustScore, getTrustLevel } from '@/utils/borrowerUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const avatarEmojis = ['😀', '😎', '🤓', '😊', '🙂', '😇', '🤗', '🤔', '😌', '👨', '👩', '🧑'];

export default function Lending() {
  const { borrowers, addBorrower } = useLendingStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😀');

  const totalLent = borrowers.reduce((sum, b) => sum + calculateTotalBorrowed(b), 0);
  const totalRecovered = borrowers.reduce((sum, b) => sum + calculateTotalRepaid(b), 0);
  const totalOutstanding = borrowers.reduce((sum, b) => sum + calculateOutstandingBalance(b), 0);
  const recoveryRate = totalLent > 0 ? (totalRecovered / totalLent) * 100 : 0;

  const sortedBorrowers = [...borrowers].sort((a, b) => calculateTrustScore(b) - calculateTrustScore(a));

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    addBorrower({
      name: name.trim(),
      avatar: selectedAvatar,
    });

    toast.success(`${name} added successfully!`);
    setIsAddOpen(false);
    setName('');
    setSelectedAvatar('😀');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Lent</p>
                <h3 className="text-2xl font-bold mt-1">${totalLent.toFixed(2)}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Recovered</p>
                <h3 className="text-2xl font-bold mt-1">${totalRecovered.toFixed(2)}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Outstanding</p>
                <h3 className="text-2xl font-bold mt-1">${totalOutstanding.toFixed(2)}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Recovery Rate</p>
                <h3 className="text-2xl font-bold mt-1">{recoveryRate.toFixed(0)}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Borrower List */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Borrower Leaderboard</CardTitle>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gradient-primary shadow-glow">
                <Plus className="w-5 h-5 mr-2" />
                Add Borrower
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Borrower</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Choose Avatar</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {avatarEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedAvatar(emoji)}
                        className={cn(
                          'text-3xl p-2 rounded-lg transition-all hover:scale-110',
                          selectedAvatar === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-accent'
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAdd} className="w-full gradient-primary">
                  Add Borrower
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {borrowers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No borrowers yet. Add someone to start tracking!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedBorrowers.map((borrower, index) => {
                const trustScore = calculateTrustScore(borrower);
                const trustLevel = getTrustLevel(trustScore);
                const outstanding = calculateOutstandingBalance(borrower);
                const totalBorrowed = calculateTotalBorrowed(borrower);

                return (
                  <Link key={borrower.id} to={`/lending/${borrower.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl bg-accent/50 hover:bg-accent transition-all hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{borrower.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{borrower.name}</h3>
                            <span
                              className={cn(
                                'text-xs px-2 py-0.5 rounded-full font-medium',
                                trustLevel.color === 'success' && 'bg-success/20 text-success',
                                trustLevel.color === 'warning' && 'bg-warning/20 text-warning',
                                trustLevel.color === 'danger' && 'bg-danger/20 text-danger'
                              )}
                            >
                              {trustLevel.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>Borrowed: ${totalBorrowed.toFixed(2)}</span>
                            <span className={outstanding > 0 ? 'text-warning font-medium' : 'text-success'}>
                              Outstanding: ${outstanding.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={trustScore} className="flex-1 h-2" />
                            <span className="text-sm font-medium min-w-[3rem] text-right">
                              {trustScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
