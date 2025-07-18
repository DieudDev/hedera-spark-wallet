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
} from "@hashgraph/sdk";
import { HederaAccount, TransactionResult, HederaToken, HederaTopic } from "@/types/hedera";

// Use testnet for development
const client = Client.forTestnet();

export class HederaService {
  private client: Client;
  private operatorPrivateKey: PrivateKey | null = null;
  
  constructor() {
    this.client = Client.forTestnet();
  }

  setOperator(accountId: string, privateKey: string): void {
    try {
      const operatorId = AccountId.fromString(accountId);
      const operatorKey = PrivateKey.fromString(privateKey);
      this.client.setOperator(operatorId, operatorKey);
      this.operatorPrivateKey = operatorKey;
    } catch (error) {
      throw new Error(`Invalid credentials: ${error}`);
    }
  }

  async getAccountInfo(accountId: string): Promise<HederaAccount> {
    try {
      const accountInfo = await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(this.client);

      return {
        accountId,
        privateKey: '', // Don't store private key in account info
        balance: accountInfo.balance.toString(),
        tokens: [], // Will be populated separately
      };
    } catch (error) {
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
}

export const hederaService = new HederaService();