import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { hederaService } from '@/lib/hedera';
import { MessageCircle, Loader2 } from 'lucide-react';

const CreateTopic = () => {
  const [memo, setMemo] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!memo) {
      toast({
        title: "Error",
        description: "Please enter a topic memo",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await hederaService.createTopic(memo, isPrivate);
      
      if (result.success) {
        toast({
          title: "Topic Created Successfully",
          description: `Topic ID: ${result.details.topicId}`,
        });
        setMemo('');
        setIsPrivate(false);
      } else {
        toast({
          title: "Topic Creation Failed",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create topic",
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
          <MessageCircle className="h-5 w-5 text-primary" />
          Create Topic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="memo">Topic Memo</Label>
            <Input
              id="memo"
              type="text"
              placeholder="Description of your topic"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="private"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
              disabled={isLoading}
            />
            <Label htmlFor="private">Private Topic</Label>
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
                Creating Topic...
              </>
            ) : (
              'Create Topic'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateTopic;