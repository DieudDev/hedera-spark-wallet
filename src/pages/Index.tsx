import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnect from '@/components/WalletConnect';
import AccountDashboard from '@/components/AccountDashboard';
import TransferHbar from '@/components/TransferHbar';
import { Wallet, Send, Coins, MessageCircle, Settings } from 'lucide-react';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  useEffect(() => {
    // Check if credentials are stored in localStorage
    const storedAccountId = localStorage.getItem('hedera_account_id');
    const storedPrivateKey = localStorage.getItem('hedera_private_key');
    
    if (storedAccountId && storedPrivateKey) {
      setAccountId(storedAccountId);
      setPrivateKey(storedPrivateKey);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = (accountId: string, privateKey: string) => {
    setAccountId(accountId);
    setPrivateKey(privateKey);
    setIsConnected(!!accountId && !!privateKey);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-full shadow-glow">
                <Wallet className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Hedera Wallet
            </h1>
            <p className="text-muted-foreground">
              Connect your Hedera testnet account to get started
            </p>
          </div>
          <WalletConnect onConnect={handleConnect} isConnected={isConnected} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-full shadow-glow">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Hedera Wallet
          </h1>
          <p className="text-muted-foreground">
            Manage your Hedera account and perform transactions
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-secondary/20 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-2">
              <Coins className="h-4 w-4" />
              Tokens
            </TabsTrigger>
            <TabsTrigger value="topics" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Topics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AccountDashboard accountId={accountId} />
          </TabsContent>

          <TabsContent value="send" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransferHbar />
              <div className="bg-gradient-card border border-primary/20 rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Token Transfers</h3>
                <p className="text-muted-foreground text-sm">
                  Token transfer functionality coming soon...
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-card border border-primary/20 rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Create Token</h3>
                <p className="text-muted-foreground text-sm">
                  Create new fungible tokens on Hedera Token Service...
                </p>
              </div>
              <div className="bg-gradient-card border border-primary/20 rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Associate Token</h3>
                <p className="text-muted-foreground text-sm">
                  Associate your account with existing tokens...
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-card border border-primary/20 rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Create Topic</h3>
                <p className="text-muted-foreground text-sm">
                  Create new topics for message consensus...
                </p>
              </div>
              <div className="bg-gradient-card border border-primary/20 rounded-lg p-6 shadow-card">
                <h3 className="text-lg font-semibold mb-2">Send Messages</h3>
                <p className="text-muted-foreground text-sm">
                  Send messages to Hedera topics...
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <WalletConnect onConnect={handleConnect} isConnected={isConnected} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
