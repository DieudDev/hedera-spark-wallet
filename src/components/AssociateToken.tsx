import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { hederaService } from '@/lib/hedera';
import { Link, Loader2 } from 'lucide-react';

const AssociateToken = () => {
  const [tokenId, setTokenId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenId) {
      toast({
        title: "Error",
        description: "Please enter a token ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await hederaService.associateToken(tokenId);
      
      if (result.success) {
        toast({
          title: "Token Associated Successfully",
          description: `Token ${tokenId} is now associated with your account`,
        });
        setTokenId('');
      } else {
        toast({
          title: "Token Association Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to associate token",
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
          <Link className="h-5 w-5 text-primary" />
          Associate Token
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Associating Token...
              </>
            ) : (
              'Associate Token'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssociateToken;