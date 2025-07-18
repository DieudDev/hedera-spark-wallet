import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hederaService } from '@/lib/hedera';
import { Coins, Loader2 } from 'lucide-react';

const CreateToken = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !symbol || !initialSupply) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await hederaService.createToken(name, symbol, parseInt(initialSupply));
      
      if (result.success) {
        toast({
          title: "Token Created Successfully",
          description: `Token ID: ${result.details.tokenId}`,
        });
        setName('');
        setSymbol('');
        setInitialSupply('');
      } else {
        toast({
          title: "Token Creation Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create token",
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
          <Coins className="h-5 w-5 text-primary" />
          Create Fungible Token
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Input
              id="tokenName"
              type="text"
              placeholder="My Token"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input
              id="tokenSymbol"
              type="text"
              placeholder="MTK"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              disabled={isLoading}
              maxLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialSupply">Initial Supply</Label>
            <Input
              id="initialSupply"
              type="number"
              placeholder="1000"
              value={initialSupply}
              onChange={(e) => setInitialSupply(e.target.value)}
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
                Creating Token...
              </>
            ) : (
              'Create Token'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateToken;