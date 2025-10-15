import React from 'react';
import { Button } from '@/components/ui/button';

export default function Insights() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Insights</h1>
        <Button variant="default">Run Insights</Button>
      </div>

      <div className="rounded-lg bg-card p-6">
        <p className="text-muted-foreground">No insights available yet. Add some data to get started.</p>
      </div>
    </div>
  );
}
