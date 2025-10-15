import React from 'react';
import { Button } from '@/components/ui/button';

export default function Investments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Investments</h1>
        <Button variant="default">+ Add Investment</Button>
      </div>

      <div className="rounded-lg bg-card p-6">
        <p className="text-muted-foreground">No investments yet. Start tracking your portfolio.</p>
      </div>
    </div>
  );
}
