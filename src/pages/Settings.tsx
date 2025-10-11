import { Moon, Sun, Info } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences</p>
      </div>

      {/* Theme */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <div>
                <Label htmlFor="theme-toggle" className="text-base font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <Switch id="theme-toggle" checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About MoneyWise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Track Expenses & Lending</h3>
            <p className="text-sm text-muted-foreground">
              MoneyWise helps you manage your personal finances by tracking expenses and monitoring
              money lent to others with smart borrower analytics.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Track daily expenses by category</li>
              <li>Visualize spending patterns with charts</li>
              <li>Manage lending with borrower profiles</li>
              <li>Calculate trust scores automatically</li>
              <li>Set reminders for due payments</li>
              <li>All data stored locally on your device</li>
            </ul>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
