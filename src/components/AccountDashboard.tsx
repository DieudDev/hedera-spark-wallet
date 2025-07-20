import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Coins, RefreshCw, TrendingUp, Activity, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hederaService } from '@/lib/hedera';
import { HederaAccount } from '@/types/hedera';
import { useToast } from '@/hooks/use-toast';

interface AccountDashboardProps {
  accountId: string;
}

const AccountDashboard: React.FC<AccountDashboardProps> = ({ accountId }) => {
  const [account, setAccount] = useState<HederaAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAccountInfo = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const accountInfo = await hederaService.getAccountInfo(accountId);
      setAccount(accountInfo);
      setLastUpdate(new Date());
      
      if (isRefresh) {
        toast({
          title: "Account refreshed",
          description: "Account information updated successfully",
        });
      }
    } catch (error) {
      console.warn('Account fetch error:', error);
      // Only show error toast for manual refreshes to avoid spam
      if (isRefresh) {
        toast({
          variant: "destructive",
          title: "Failed to refresh account",
          description: error instanceof Error ? error.message : "Network error - will retry automatically"
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountInfo();
      
      // Set up real-time updates every 30 seconds (instead of aggressive polling)
      intervalRef.current = setInterval(() => {
        fetchAccountInfo(false); // Silent updates
      }, 30000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [accountId]);

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-primary/20 shadow-card animate-pulse-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="relative">
              <Wallet className="h-5 w-5 text-primary animate-float" />
              <div className="absolute inset-0 animate-ping">
                <Wallet className="h-5 w-5 text-primary opacity-20" />
              </div>
            </div>
            Loading Account...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative h-16 bg-muted/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay animate-shimmer"></div>
            </div>
            <div className="relative h-8 bg-muted/20 rounded-lg overflow-hidden">
              <div className="absolute inset-0 shimmer-overlay animate-shimmer"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!account) {
    return (
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-destructive" />
            Account Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load account information. Please check your credentials.
          </p>
        </CardContent>
      </Card>
    );
  }

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
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastUpdate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3 text-success animate-pulse" />
                  {lastUpdate.toLocaleTimeString()}
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchAccountInfo(true)}
                disabled={isRefreshing}
                className="hover:glow-accent transition-all duration-300"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
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
                  <p className="text-lg font-mono font-semibold text-primary hover:text-accent transition-colors duration-300">{account.accountId}</p>
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
                    {(parseInt(account.balance) / 100000000).toFixed(2)} ℏ
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
                    {account.tokens.length}
                  </Badge>
                </div>
                
                {account.tokens.length > 0 ? (
                  <div className="space-y-2">
                    {account.tokens.map((token, index) => (
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
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-float">
                      <Coins className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No tokens associated with this account
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDashboard;