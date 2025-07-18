import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hederaService } from '@/lib/hedera';
import { ArrowRight, Loader2 } from 'lucide-react';

const TransferToken = () => {
  const [recipientId, setRecipientId] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientId || !tokenId || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await hederaService.sendToken(recipientId, tokenId, parseInt(amount));
      
      if (result.success) {
        toast({
          title: "Token Transfer Successful",
          description: `Sent ${amount} tokens to ${recipientId}`,
        });
        setRecipientId('');
        setTokenId('');
        setAmount('');
      } else {
        toast({
          title: "Token Transfer Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to transfer tokens",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-primary/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-primary" />
          Send Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientId">Recipient Account ID</Label>
            <Input
              id="recipientId"
              type="text"
              placeholder="0.0.xxxxxx"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tokenId">Token ID</Label>
            <Input
              id="tokenId"
              type="text"
              placeholder="0.0.xxxxxx"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
              min="0"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Tokens...
              </>
            ) : (
              'Send Tokens'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransferToken;