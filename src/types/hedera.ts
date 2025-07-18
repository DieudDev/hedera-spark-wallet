export interface HederaAccount {
  accountId: string;
  privateKey: string;
  balance: string;
  tokens: HederaToken[];
}

export interface HederaToken {
  tokenId: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
}

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  details?: any;
}

export interface TopicMessage {
  sequenceNumber: string;
  message: string;
  consensusTimestamp: string;
  runningHash: string;
}

export interface HederaTopic {
  topicId: string;
  memo: string;
  isPrivate: boolean;
  messages: TopicMessage[];
}