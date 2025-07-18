import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Loader2 } from 'lucide-react';
import { hederaService } from '@/lib/hedera';
import { useToast } from '@/hooks/use-toast';

const TransferHbar: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!recipient || !amount) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both recipient and amount"
      });
      return;
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await hederaService.sendHbar(recipient, amountNumber);
      
      if (result.success) {
        toast({
          title: "Transfer successful",
          description: `Sent ${amount} HBAR to ${recipient}`,
        });
        setRecipient('');
        setAmount('');
      } else {
        toast({
          variant: "destructive",
          title: "Transfer failed",
          description: result.error || "Unknown error occurred"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-primary/20 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Send HBAR
        </CardTitle>
        <CardDescription>
          Transfer HBAR to another Hedera account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Account ID</Label>
            <Input
              id="recipient"
              placeholder="0.0.123456"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary/40"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (HBAR)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-background/50 border-primary/20 focus:border-primary/40"
            />
          </div>

          <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-xs text-warning">
              ⚠️ This will send real HBAR on the testnet. Make sure the recipient address is correct.
            </p>
          </div>

          <Button
            onClick={handleTransfer}
            disabled={isLoading}
            className="w-full"
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send HBAR
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferHbar;