import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  Activity, 
  Zap, 
  Plus, 
  ArrowUpRight,
  Users,
  Clock
} from 'lucide-react';

const DemoAccountDashboard: React.FC = () => {
  const demoAccount = {
    accountId: '0.0.1234567',
    balance: '5000000000', // 50 HBAR in tinybars
    tokens: [
      {
        tokenId: '0.0.1111111',
        name: 'Demo Token',
        symbol: 'DEMO',
        balance: '1000'
      },
      {
        tokenId: '0.0.2222222',
        name: 'Test Coin',
        symbol: 'TEST',
        balance: '500'
      }
    ]
  };

  const lastUpdate = new Date();

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-primary/20 shadow-card animate-fade-in hover:glow-primary transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="relative">
                <Wallet className="h-5 w-5 text-primary animate-float" />
                <Activity className="h-2 w-2 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="gradient-moving bg-clip-text text-transparent animate-gradient">
                Account Overview
              </span>
              <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                DEMO MODE
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="h-3 w-3 text-success animate-pulse" />
                {lastUpdate.toLocaleTimeString()}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="hover:glow-accent transition-all duration-300"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Account ID */}
            <div className="relative p-4 bg-gradient-hero border border-primary/20 rounded-lg hover:border-primary/40 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer"></div>
              </div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Account ID
                    <div className="animate-data-flow">
                      <div className="w-1 h-1 bg-primary rounded-full"></div>
                    </div>
                  </p>
                  <p className="text-lg font-mono font-semibold text-primary hover:text-accent transition-colors duration-300">
                    {demoAccount.accountId}
                  </p>
                </div>
                <Badge variant="outline" className="border-primary/20 animate-pulse glow-primary">
                  <Activity className="h-3 w-3 mr-1" />
                  Testnet
                </Badge>
              </div>
            </div>

            {/* Balance */}
            <div className="relative p-4 bg-gradient-hero border border-primary/20 rounded-lg hover:border-accent/40 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="h-full w-full bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 animate-gradient"></div>
              </div>
              <div className="relative flex items-center gap-3">
                <div className="relative p-2 bg-primary/10 rounded-lg animate-pulse-glow">
                  <Coins className="h-5 w-5 text-primary animate-rotate-slow" />
                  <TrendingUp className="h-2 w-2 text-success absolute -top-1 -right-1 animate-bounce" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    HBAR Balance
                    <div className="animate-data-flow">
                      <div className="w-1 h-1 bg-accent rounded-full"></div>
                    </div>
                  </p>
                  <p className="text-2xl font-bold gradient-moving bg-clip-text text-transparent animate-gradient">
                    {(parseInt(demoAccount.balance) / 100000000).toFixed(2)} ℏ
                  </p>
                </div>
              </div>
            </div>

            {/* Tokens */}
            <div className="relative p-4 bg-gradient-hero border border-primary/20 rounded-lg hover:border-success/40 transition-all duration-300 group overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="h-full w-full bg-gradient-to-r from-success/5 via-primary/5 to-success/5 animate-gradient"></div>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Associated Tokens
                    <div className="animate-data-flow">
                      <div className="w-1 h-1 bg-success rounded-full"></div>
                    </div>
                  </p>
                  <Badge variant="secondary" className="animate-pulse glow-accent">
                    {demoAccount.tokens.length}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {demoAccount.tokens.map((token, index) => (
                    <div 
                      key={token.tokenId} 
                      className="flex items-center justify-between p-2 bg-background/20 rounded hover:bg-background/30 transition-all duration-300 group/token border border-transparent hover:border-primary/20"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="animate-fade-in">
                        <p className="font-medium group-hover/token:text-primary transition-colors duration-300">
                          {token.name} ({token.symbol})
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">{token.tokenId}</p>
                      </div>
                      <p className="font-mono text-sm gradient-moving bg-clip-text text-transparent animate-gradient">
                        {token.balance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button variant="outline" size="sm" className="hover:glow-primary transition-all">
                <Plus className="h-3 w-3 mr-1" />
                Send
              </Button>
              <Button variant="outline" size="sm" className="hover:glow-accent transition-all">
                <Users className="h-3 w-3 mr-1" />
                Tokens
              </Button>
              <Button variant="outline" size="sm" className="hover:glow-success transition-all">
                <Clock className="h-3 w-3 mr-1" />
                History
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connection Helper */}
      <Card className="bg-gradient-card border-warning/20 shadow-card animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Wallet className="h-4 w-4 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Demo Dashboard</p>
              <p className="text-xs text-muted-foreground">
                This is sample data. Connect your wallet to see real account information.
              </p>
            </div>
            <Button variant="outline" size="sm" className="hover:glow-warning">
              Connect Real Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoAccountDashboard;