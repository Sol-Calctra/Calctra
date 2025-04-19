import * as web3 from '@solana/web3.js';
import { transferCalTokens } from '../contracts/cal_token';

/**
 * 交易类型
 */
export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  REWARD = 'REWARD',
  FEE = 'FEE'
}

/**
 * 交易状态
 */
export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

/**
 * 交易记录接口
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  senderId: string;
  senderWallet: string;
  recipientId?: string;
  recipientWallet: string;
  amount: number;
  relatedDemandId?: string;
  relatedResourceId?: string;
  status: TransactionStatus;
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

/**
 * 交易管理器
 * 负责处理CAL代币的支付、退款和奖励
 */
export class TransactionManager {
  private transactions: Map<string, Transaction> = new Map();
  private connection: web3.Connection;
  private tokenMint: web3.PublicKey;
  
  constructor(rpcUrl: string, tokenMint: string) {
    this.connection = new web3.Connection(rpcUrl);
    this.tokenMint = new web3.PublicKey(tokenMint);
  }
  
  /**
   * 创建交易记录
   */
  public createTransaction(
    type: TransactionType,
    senderId: string,
    senderWallet: string,
    recipientWallet: string,
    amount: number,
    options?: {
      recipientId?: string;
      relatedDemandId?: string;
      relatedResourceId?: string;
      description?: string;
    }
  ): Transaction {
    const now = new Date();
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      type,
      senderId,
      senderWallet,
      recipientWallet,
      amount,
      status: TransactionStatus.PENDING,
      createdAt: now,
      updatedAt: now,
      ...options
    };
    
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }
  
  /**
   * 执行交易
   */
  public async executeTransaction(
    transactionId: string,
    senderKeypair: web3.Keypair
  ): Promise<Transaction> {
    const transaction = this.transactions.get(transactionId);
    
    if (!transaction) {
      throw new Error(`Transaction ${transactionId} not found`);
    }
    
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error(`Transaction ${transactionId} cannot be executed because it is ${transaction.status}`);
    }
    
    try {
      // 执行Solana上的代币转账
      const recipientPublicKey = new web3.PublicKey(transaction.recipientWallet);
      
      const signature = await transferCalTokens(
        this.connection,
        senderKeypair,
        recipientPublicKey,
        this.tokenMint,
        transaction.amount
      );
      
      // 更新交易状态为已确认
      transaction.status = TransactionStatus.CONFIRMED;
      transaction.signature = signature;
      transaction.updatedAt = new Date();
      
      return transaction;
    } catch (error) {
      // 更新交易状态为失败
      transaction.status = TransactionStatus.FAILED;
      transaction.updatedAt = new Date();
      transaction.description = `执行失败: ${error instanceof Error ? error.message : String(error)}`;
      
      return transaction;
    }
  }
  
  /**
   * 创建并执行支付交易
   */
  public async createAndExecutePayment(
    senderId: string,
    senderKeypair: web3.Keypair,
    recipientId: string,
    recipientWallet: string,
    amount: number,
    demandId: string,
    resourceId: string,
    description?: string
  ): Promise<Transaction> {
    // 创建支付交易
    const transaction = this.createTransaction(
      TransactionType.PAYMENT,
      senderId,
      senderKeypair.publicKey.toBase58(),
      recipientWallet,
      amount,
      {
        recipientId,
        relatedDemandId: demandId,
        relatedResourceId: resourceId,
        description
      }
    );
    
    // 执行交易
    return this.executeTransaction(transaction.id, senderKeypair);
  }
  
  /**
   * 创建并执行退款交易
   */
  public async createAndExecuteRefund(
    providerId: string,
    providerKeypair: web3.Keypair,
    userId: string,
    userWallet: string,
    amount: number,
    demandId: string,
    resourceId: string,
    reason?: string
  ): Promise<Transaction> {
    // 创建退款交易
    const transaction = this.createTransaction(
      TransactionType.REFUND,
      providerId,
      providerKeypair.publicKey.toBase58(),
      userWallet,
      amount,
      {
        recipientId: userId,
        relatedDemandId: demandId,
        relatedResourceId: resourceId,
        description: reason || '退款'
      }
    );
    
    // 执行交易
    return this.executeTransaction(transaction.id, providerKeypair);
  }
  
  /**
   * 获取交易详情
   */
  public getTransaction(transactionId: string): Transaction | undefined {
    return this.transactions.get(transactionId);
  }
  
  /**
   * 获取用户相关的所有交易
   */
  public getUserTransactions(userId: string): Transaction[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.senderId === userId || tx.recipientId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  /**
   * 获取与特定需求相关的所有交易
   */
  public getDemandTransactions(demandId: string): Transaction[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.relatedDemandId === demandId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
  
  /**
   * 生成唯一交易ID
   */
  private generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
} 