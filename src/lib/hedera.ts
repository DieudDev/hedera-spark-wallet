import {
  Client,
  AccountId,
  PrivateKey,
  AccountInfoQuery,
  TransferTransaction,
  Hbar,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenAssociateTransaction,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  TopicMessageQuery,
  TokenId,
  TopicId,
} from "@hashgraph/sdk";
import { HederaAccount, TransactionResult, HederaToken, HederaTopic, TopicMessage } from "@/types/hedera";

// Use testnet for development
const client = Client.forTestnet();

export class HederaService {
  private client: Client;
  private operatorPrivateKey: PrivateKey | null = null;
  private operatorAccountId: AccountId | null = null;
  private isOperatorSet: boolean = false;
  
  constructor() {
    this.client = Client.forTestnet();
  }

  setOperator(accountId: string, privateKey: string): void {
    try {
      const operatorId = AccountId.fromString(accountId);
      const operatorKey = PrivateKey.fromString(privateKey);
      this.client.setOperator(operatorId, operatorKey);
      this.operatorPrivateKey = operatorKey;
      this.operatorAccountId = operatorId;
      this.isOperatorSet = true;
      console.log('✅ Hedera operator set successfully:', accountId);
    } catch (error) {
      this.isOperatorSet = false;
      throw new Error(`Invalid credentials: ${error}`);
    }
  }

  isConnected(): boolean {
    return this.isOperatorSet && this.client.operatorAccountId !== null;
  }

  async getAccountInfo(accountId: string): Promise<HederaAccount> {
    if (!this.isConnected()) {
      throw new Error('Hedera client not connected. Please set operator credentials first.');
    }

    try {
      console.log('🔍 Fetching account info for:', accountId);
      const accountInfo = await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(this.client);

      console.log('✅ Account info retrieved:', {
        accountId,
        balance: accountInfo.balance.toString(),
        tokenCount: accountInfo.tokenRelationships?.size || 0
      });

      // Convert token relationships to our format
      const tokens = [];
      if (accountInfo.tokenRelationships) {
        // TokenRelationshipMap doesn't have entries method, iterate differently
        const tokenMap = accountInfo.tokenRelationships as any;
        for (const tokenId in tokenMap) {
          if (tokenMap.hasOwnProperty(tokenId)) {
            const relationship = tokenMap[tokenId];
            tokens.push({
              tokenId: tokenId,
              name: `Token ${tokenId}`, // In real implementation, fetch token details
              symbol: 'TKN',
              balance: relationship.balance?.toString() || '0'
            });
          }
        }
      }

      return {
        accountId,
        privateKey: '', // Don't store private key in account info
        balance: accountInfo.balance.toString(),
        tokens,
      };
    } catch (error) {
      console.error('❌ Failed to get account info:', error);
      throw new Error(`Failed to get account info: ${error}`);
    }
  }

  async sendHbar(toAccountId: string, amount: number): Promise<TransactionResult> {
    try {
      const transferTransaction = await new TransferTransaction()
        .addHbarTransfer(this.client.operatorAccountId!, Hbar.fromTinybars(-amount * 100000000))
        .addHbarTransfer(toAccountId, Hbar.fromTinybars(amount * 100000000))
        .execute(this.client);

      const receipt = await transferTransaction.getReceipt(this.client);
      
      return {
        success: true,
        transactionId: transferTransaction.transactionId?.toString(),
        details: receipt.status.toString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Transfer failed: ${error}`,
      };
    }
  }

  async createToken(
    name: string,
    symbol: string,
    initialSupply: number
  ): Promise<TransactionResult> {
    try {
      const tokenCreateTransaction = await new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.FungibleCommon)
        .setInitialSupply(initialSupply)
        .setTreasuryAccountId(this.client.operatorAccountId!)
        .setAdminKey(this.client.operatorPublicKey!)
        .setSupplyKey(this.client.operatorPublicKey!)
        .freezeWith(this.client);

      const signedTransaction = await tokenCreateTransaction.sign(this.operatorPrivateKey!);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId?.toString(),
        details: {
          tokenId: receipt.tokenId?.toString(),
          status: receipt.status.toString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Token creation failed: ${error}`,
      };
    }
  }

  async associateToken(tokenId: string): Promise<TransactionResult> {
    try {
      const transaction = await new TokenAssociateTransaction()
        .setAccountId(this.client.operatorAccountId!)
        .setTokenIds([tokenId])
        .freezeWith(this.client);

      const signedTransaction = await transaction.sign(this.operatorPrivateKey!);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId?.toString(),
        details: receipt.status.toString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Token association failed: ${error}`,
      };
    }
  }

  async createTopic(memo: string, isPrivate: boolean): Promise<TransactionResult> {
    try {
      const transaction = await new TopicCreateTransaction()
        .setTopicMemo(memo)
        .setAdminKey(this.client.operatorPublicKey!)
        .setSubmitKey(this.client.operatorPublicKey!)
        .freezeWith(this.client);

      const signedTransaction = await transaction.sign(this.operatorPrivateKey!);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId?.toString(),
        details: {
          topicId: receipt.topicId?.toString(),
          status: receipt.status.toString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Topic creation failed: ${error}`,
      };
    }
  }

  async sendTopicMessage(topicId: string, message: string): Promise<TransactionResult> {
    try {
      const transaction = await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(message)
        .execute(this.client);

      const receipt = await transaction.getReceipt(this.client);

      return {
        success: true,
        transactionId: transaction.transactionId?.toString(),
        details: {
          sequenceNumber: receipt.topicSequenceNumber?.toString(),
          status: receipt.status.toString(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Message submission failed: ${error}`,
      };
    }
  }

  async sendToken(
    toAccountId: string,
    tokenId: string,
    amount: number
  ): Promise<TransactionResult> {
    try {
      const transaction = await new TransferTransaction()
        .addTokenTransfer(tokenId, this.client.operatorAccountId!, -amount)
        .addTokenTransfer(tokenId, toAccountId, amount)
        .freezeWith(this.client);

      const signedTransaction = await transaction.sign(this.operatorPrivateKey!);
      const response = await signedTransaction.execute(this.client);
      const receipt = await response.getReceipt(this.client);

      return {
        success: true,
        transactionId: response.transactionId?.toString(),
        details: receipt.status.toString(),
      };
    } catch (error) {
      return {
        success: false,
        error: `Token transfer failed: ${error}`,
      };
    }
  }

  async getTopicMessages(topicId: string): Promise<TopicMessage[]> {
    try {
      const messages: TopicMessage[] = [];
      
      await new TopicMessageQuery()
        .setTopicId(topicId)
        .setStartTime(0)
        .subscribe(this.client, null, (message) => {
          messages.push({
            sequenceNumber: message.sequenceNumber.toString(),
            contents: new TextDecoder().decode(message.contents),
            consensusTimestamp: message.consensusTimestamp.toDate(),
            runningHash: message.runningHash.toString(),
          });
        });

      return messages;
    } catch (error) {
      throw new Error(`Failed to retrieve topic messages: ${error}`);
    }
  }

  subscribeToTopic(
    topicId: string,
    onMessage: (message: TopicMessage) => void,
    onError?: (error: Error) => void
  ): () => void {
    try {
      const subscription = new TopicMessageQuery()
        .setTopicId(topicId)
        .setStartTime(Date.now())
        .subscribe(
          this.client,
          null,
          (message) => {
            const topicMessage: TopicMessage = {
              sequenceNumber: message.sequenceNumber.toString(),
              contents: new TextDecoder().decode(message.contents),
              consensusTimestamp: message.consensusTimestamp.toDate(),
              runningHash: message.runningHash.toString(),
            };
            onMessage(topicMessage);
          }
        );

      return () => subscription.unsubscribe();
    } catch (error) {
      onError?.(new Error(`Failed to subscribe to topic: ${error}`));
      return () => {};
    }
  }
}

export const hederaService = new HederaService();