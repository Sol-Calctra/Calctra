import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

// CAL代币常量
export const CAL_TOKEN_DECIMALS = 9;
export const CAL_TOKEN_NAME = 'Calctra';
export const CAL_TOKEN_SYMBOL = 'CAL';

/**
 * 创建CAL代币
 * @param connection - Solana连接
 * @param payer - 支付者钱包
 * @param initialSupply - 初始供应量
 * @returns 代币信息
 */
export async function createCalToken(
  connection: web3.Connection,
  payer: web3.Keypair,
  initialSupply: number = 1000000000 // 10亿代币
): Promise<{
  mint: web3.PublicKey;
  tokenAccount: web3.PublicKey;
}> {
  try {
    // 创建代币铸造账户
    const mintKeypair = Keypair.generate();
    
    // 创建代币账户
    const mint = await token.createMint(
      connection,
      payer,
      payer.publicKey,
      payer.publicKey,
      CAL_TOKEN_DECIMALS
    );

    // 为支付者创建代币账户
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );

    // 铸造代币到账户
    await token.mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer,
      initialSupply * Math.pow(10, CAL_TOKEN_DECIMALS)
    );

    console.log(`创建CAL代币: ${mint.toBase58()}`);
    console.log(`代币账户: ${tokenAccount.address.toBase58()}`);

    return {
      mint,
      tokenAccount: tokenAccount.address,
    };
  } catch (error) {
    console.error('创建CAL代币失败:', error);
    throw error;
  }
}

/**
 * 转移CAL代币
 * @param connection - Solana连接
 * @param sender - 发送者钱包
 * @param recipient - 接收者公钥
 * @param mint - 代币铸造账户公钥  
 * @param amount - 转移金额
 */
export async function transferCalTokens(
  connection: web3.Connection,
  sender: web3.Keypair,
  recipient: web3.PublicKey,
  mint: web3.PublicKey,
  amount: number
): Promise<string> {
  try {
    // 获取发送者的代币账户
    const senderTokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      sender,
      mint,
      sender.publicKey
    );

    // 获取或创建接收者的代币账户
    const recipientTokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      sender,
      mint,
      recipient
    );

    // 转移代币
    const signature = await token.transfer(
      connection,
      sender,
      senderTokenAccount.address,
      recipientTokenAccount.address,
      sender,
      amount * Math.pow(10, CAL_TOKEN_DECIMALS)
    );

    return signature;
  } catch (error) {
    console.error('转移CAL代币失败:', error);
    throw error;
  }
}

/**
 * 获取代币余额
 * @param connection - Solana连接
 * @param ownerPublicKey - 所有者公钥
 * @param mint - 代币铸造账户公钥
 * @returns 余额
 */
export async function getCalTokenBalance(
  connection: web3.Connection,
  ownerPublicKey: web3.PublicKey,
  mint: web3.PublicKey
): Promise<number> {
  try {
    const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
      connection,
      Keypair.generate(), // 仅用于查询，生成临时密钥对
      mint,
      ownerPublicKey
    );

    const balance = await token.getAccount(connection, tokenAccount.address);
    
    return Number(balance.amount) / Math.pow(10, CAL_TOKEN_DECIMALS);
  } catch (error) {
    console.error('获取CAL代币余额失败:', error);
    throw error;
  }
} 