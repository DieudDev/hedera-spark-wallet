import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Eye, EyeOff, Key } from 'lucide-react';
import { hederaService } from '@/lib/hedera';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  onConnect: (accountId: string, privateKey: string) => void;
  isConnected: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect, isConnected }) => {
  const [accountId, setAccountId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!accountId || !privateKey) {
      toast({
        variant: "destructive",
        title: "Missing credentials",
        description: "Please enter both Account ID and Private Key"
      });
      return;
    }

    setIsLoading(true);
    try {
      hederaService.setOperator(accountId, privateKey);
      
      // Store credentials in localStorage
      localStorage.setItem('hedera_account_id', accountId);
      localStorage.setItem('hedera_private_key', privateKey);
      
      onConnect(accountId, privateKey);
      
      toast({
        title: "Connected successfully",
        description: "Your Hedera wallet is now connected"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Invalid credentials"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('hedera_account_id');
    localStorage.removeItem('hedera_private_key');
    setAccountId('');
    setPrivateKey('');
    onConnect('', '');
  };

  if (isConnected) {
    return (
      <Card className="bg-gradient-card border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet Connected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm text-success">Connected to: {accountId}</p>
            </div>
            <Button variant="outline" onClick={handleDisconnect} className="w-full">
              Disconnect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-primary/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Connect Hedera Wallet
        </CardTitle>
        <CardDescription>
          Enter your Hedera testnet credentials to connect your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountId">Account ID</Label>
            <Input
              id="accountId"
              placeholder="0.0.123456"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary/40"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key</Label>
            <div className="relative">
              <Input
                id="privateKey"
                type={showPrivateKey ? "text" : "password"}
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="bg-background/50 border-primary/20 focus:border-primary/40 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Key className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-xs text-warning">
                Your credentials are stored locally and never transmitted to our servers.
                For testnet only - never use mainnet keys in development.
              </p>
            </div>
          </div>

          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full"
            variant="default"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;