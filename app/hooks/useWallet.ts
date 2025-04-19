import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { getCalTokenBalance } from '../contracts/cal_token';

const RPC_ENDPOINT = 'https://api.devnet.solana.com';
const CAL_TOKEN_MINT = 'CALUEG5RfgTnH1Z34K1E6bNy2q6k9UfHi6BkspwSZGWy'; // 假设的CAL代币铸造地址

export function useWallet() {
  const { publicKey, connected, connecting, select, disconnect, wallets } = useSolanaWallet();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [calBalance, setCalBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化Solana连接
  useEffect(() => {
    try {
      const conn = new Connection(RPC_ENDPOINT);
      setConnection(conn);
    } catch (err) {
      setError(`连接Solana网络失败: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, []);

  // 获取CAL代币余额
  const fetchCalBalance = useCallback(async () => {
    if (!connection || !publicKey) {
      setCalBalance(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tokenMint = new PublicKey(CAL_TOKEN_MINT);
      const balance = await getCalTokenBalance(connection, publicKey, tokenMint);
      setCalBalance(balance);
    } catch (err) {
      setError(`获取CAL余额失败: ${err instanceof Error ? err.message : String(err)}`);
      setCalBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [connection, publicKey]);

  // 当钱包连接状态改变时刷新余额
  useEffect(() => {
    if (connected && publicKey) {
      fetchCalBalance();
    } else {
      setCalBalance(null);
    }
  }, [connected, publicKey, fetchCalBalance]);

  // 连接钱包
  const connectWallet = useCallback((walletName: string) => {
    const selectedWallet = wallets.find(w => w.adapter.name === walletName);
    if (selectedWallet) {
      select(selectedWallet.adapter.name);
    } else {
      setError(`找不到钱包: ${walletName}`);
    }
  }, [wallets, select]);

  // 断开钱包连接
  const disconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  // 刷新余额
  const refreshBalance = useCallback(() => {
    fetchCalBalance();
  }, [fetchCalBalance]);

  return {
    // 钱包状态
    connected,
    connecting,
    walletAddress: publicKey ? publicKey.toString() : null,
    publicKey,
    wallets: wallets.map(w => ({
      name: w.adapter.name,
      icon: w.adapter.icon
    })),
    
    // CAL余额
    calBalance,
    
    // 加载和错误状态
    isLoading,
    error,
    
    // 操作方法
    connectWallet,
    disconnectWallet,
    refreshBalance
  };
} 