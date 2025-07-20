import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnect from '@/components/WalletConnect';
import AccountDashboard from '@/components/AccountDashboard';
import DemoAccountDashboard from '@/components/DemoAccountDashboard';
import TransferHbar from '@/components/TransferHbar';
import CreateToken from '@/components/CreateToken';
import AssociateToken from '@/components/AssociateToken';
import TransferToken from '@/components/TransferToken';
import CreateTopic from '@/components/CreateTopic';
import SendMessage from '@/components/SendMessage';
import TopicMessages from '@/components/TopicMessages';
import ThemeToggle from '@/components/ThemeToggle';
import { Wallet, Send, Coins, MessageCircle, Settings } from 'lucide-react';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [privateKey, setPrivateKey] = useState('');

  useEffect(() => {
    // Check if credentials are stored in localStorage
    const storedAccountId = localStorage.getItem('hedera_account_id');
    const storedPrivateKey = localStorage.getItem('hedera_private_key');
    
    console.log('🔄 Checking stored credentials:', { 
      hasAccountId: !!storedAccountId, 
      hasPrivateKey: !!storedPrivateKey 
    });
    
    if (storedAccountId && storedPrivateKey) {
      console.log('✅ Found stored credentials, connecting...');
      handleConnect(storedAccountId, storedPrivateKey);
    } else {
      console.log('ℹ️ No stored credentials found');
    }
  }, []);

  const handleConnect = (accountId: string, privateKey: string) => {
    console.log('🔌 Connecting wallet:', accountId);
    setAccountId(accountId);
    setPrivateKey(privateKey);
    const connected = !!accountId && !!privateKey;
    setIsConnected(connected);
    
    if (connected) {
      // Set operator in Hedera service
      try {
        const { hederaService } = require('@/lib/hedera');
        hederaService.setOperator(accountId, privateKey);
        console.log('✅ Wallet connected and operator set');
      } catch (error) {
        console.error('❌ Failed to set operator:', error);
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-primary rounded-full shadow-glow animate-pulse-glow">
                <Wallet className="h-8 w-8 text-primary-foreground animate-float" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent animate-gradient">
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
    <div className="min-h-screen bg-background p-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-primary rounded-full shadow-glow animate-pulse-glow">
                  <Wallet className="h-8 w-8 text-primary-foreground animate-float" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent animate-gradient">
                Hedera Wallet
              </h1>
              <p className="text-muted-foreground">
                Manage your Hedera account and perform transactions
              </p>
            </div>
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
          </div>
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
            {isConnected && accountId ? (
              <AccountDashboard accountId={accountId} />
            ) : (
              <DemoAccountDashboard />
            )}
          </TabsContent>

          <TabsContent value="send" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransferHbar />
              <TransferToken />
            </div>
          </TabsContent>

          <TabsContent value="tokens" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CreateToken />
              <AssociateToken />
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <CreateTopic />
                <SendMessage />
              </div>
              <TopicMessages />
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
