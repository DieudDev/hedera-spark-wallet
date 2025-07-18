import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { hederaService } from '@/lib/hedera';
import { TopicMessage } from '@/types/hedera';
import { MessageSquare, Loader2, Play, Square } from 'lucide-react';

const TopicMessages = () => {
  const [topicId, setTopicId] = useState('');
  const [messages, setMessages] = useState<TopicMessage[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const handleSubscribe = () => {
    if (!topicId) {
      toast({
        title: "Error",
        description: "Please enter a topic ID",
        variant: "destructive",
      });
      return;
    }

    if (isSubscribed) {
      // Unsubscribe
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      setIsSubscribed(false);
      toast({
        title: "Unsubscribed",
        description: "Stopped listening for new messages",
      });
    } else {
      // Subscribe
      setIsLoading(true);
      const unsubscribe = hederaService.subscribeToTopic(
        topicId,
        (message) => {
          setMessages(prev => [...prev, message]);
        },
        (error) => {
          toast({
            title: "Subscription Error",
            description: error.message,
            variant: "destructive",
          });
          setIsSubscribed(false);
        }
      );
      
      unsubscribeRef.current = unsubscribe;
      setIsSubscribed(true);
      setIsLoading(false);
      toast({
        title: "Subscribed",
        description: "Now listening for new messages in real-time",
      });
    }
  };

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  return (
    <Card className="bg-gradient-card border-primary/20 shadow-card h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Topic Messages
          {isSubscribed && (
            <Badge variant="secondary" className="ml-auto">
              Live
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="topicId" className="sr-only">Topic ID</Label>
            <Input
              id="topicId"
              type="text"
              placeholder="0.0.xxxxxx"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSubscribe}
            disabled={isLoading}
            variant={isSubscribed ? "destructive" : "default"}
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSubscribed ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Listen
              </>
            )}
          </Button>
        </div>
        
        <ScrollArea className="h-48 w-full border rounded-md p-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {isSubscribed ? 'Waiting for messages...' : 'Enter a topic ID and click Listen to see messages'}
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div key={index} className="p-2 bg-background/50 rounded border">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="text-xs">
                      #{message.sequenceNumber}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(message.consensusTimestamp)}
                    </span>
                  </div>
                  <p className="text-sm break-words">{message.contents}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TopicMessages;