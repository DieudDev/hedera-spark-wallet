import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Coins, RefreshCw } from 'lucide-react';
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
  const { toast } = useToast();

  const fetchAccountInfo = async () => {
    setIsLoading(true);
    try {
      const accountInfo = await hederaService.getAccountInfo(accountId);
      setAccount(accountInfo);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch account info",
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) {
      fetchAccountInfo();
    }
  }, [accountId]);

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary animate-pulse" />
            Loading Account...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted/20 rounded-lg animate-pulse" />
            <div className="h-8 bg-muted/20 rounded-lg animate-pulse" />
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
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              Account Overview
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchAccountInfo}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Account ID */}
            <div className="p-4 bg-gradient-hero border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="text-lg font-mono font-semibold text-primary">{account.accountId}</p>
                </div>
                <Badge variant="outline" className="border-primary/20">
                  Testnet
                </Badge>
              </div>
            </div>

            {/* Balance */}
            <div className="p-4 bg-gradient-hero border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">HBAR Balance</p>
                  <p className="text-2xl font-bold text-primary">
                    {(parseInt(account.balance) / 100000000).toFixed(2)} ℏ
                  </p>
                </div>
              </div>
            </div>

            {/* Tokens */}
            <div className="p-4 bg-gradient-hero border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">Associated Tokens</p>
                <Badge variant="secondary">{account.tokens.length}</Badge>
              </div>
              
              {account.tokens.length > 0 ? (
                <div className="space-y-2">
                  {account.tokens.map((token) => (
                    <div key={token.tokenId} className="flex items-center justify-between p-2 bg-background/20 rounded">
                      <div>
                        <p className="font-medium">{token.name} ({token.symbol})</p>
                        <p className="text-xs text-muted-foreground">{token.tokenId}</p>
                      </div>
                      <p className="font-mono text-sm">{token.balance}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No tokens associated with this account
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDashboard;