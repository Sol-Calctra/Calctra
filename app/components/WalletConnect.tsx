'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWallet } from '../hooks/useWallet';

// 样式组件
const WalletContainer = styled.div`
  margin-bottom: 1rem;
`;

const WalletButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const WalletMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 100;
  min-width: 250px;
`;

const WalletOption = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const WalletIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 12px;
`;

const WalletName = styled.span`
  font-weight: 500;
`;

const WalletDetails = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eaeaea;
`;

const WalletAddress = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  word-break: break-all;
`;

const WalletBalance = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const DisconnectButton = styled.button`
  background-color: #f8f9fa;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: #fee;
  }
`;

/**
 * Wallet Connection Component
 * Provides functionality to connect wallet, show balance and disconnect
 */
const WalletConnect: React.FC = () => {
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const {
    connected,
    connecting,
    walletAddress,
    calBalance,
    wallets,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance
  } = useWallet();

  // Shorten wallet address for display
  const shortenAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle connect wallet click
  const handleConnectClick = () => {
    if (connected) {
      refreshBalance();
    } else {
      setShowWalletMenu(!showWalletMenu);
    }
  };

  // Handle specific wallet selection
  const handleWalletSelect = (walletName: string) => {
    connectWallet(walletName);
    setShowWalletMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showWalletMenu && !target.closest('.wallet-menu')) {
        setShowWalletMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showWalletMenu]);

  return (
    <WalletContainer>
      <WalletButton onClick={handleConnectClick} disabled={connecting}>
        {connecting ? 'Connecting...' : connected ? 'Connected Wallet' : 'Connect Wallet'}
      </WalletButton>

      {showWalletMenu && !connected && (
        <WalletMenu className="wallet-menu">
          <h3>Select Wallet</h3>
          {wallets.map((wallet) => (
            <WalletOption 
              key={wallet.name} 
              onClick={() => handleWalletSelect(wallet.name)}
            >
              {wallet.icon && <WalletIcon src={wallet.icon} alt={wallet.name} />}
              <WalletName>{wallet.name}</WalletName>
            </WalletOption>
          ))}
        </WalletMenu>
      )}

      {connected && showWalletMenu && (
        <WalletMenu className="wallet-menu">
          <h3>Wallet Information</h3>
          <WalletDetails>
            <WalletAddress>Address: {shortenAddress(walletAddress)}</WalletAddress>
            <WalletBalance>
              {isLoading ? 'Loading...' : `Balance: ${calBalance ?? 0} CAL`}
            </WalletBalance>
            <DisconnectButton onClick={disconnectWallet}>
              Disconnect
            </DisconnectButton>
          </WalletDetails>
        </WalletMenu>
      )}

      {error && <div style={{ color: 'red', marginTop: '0.5rem' }}>{error}</div>}
    </WalletContainer>
  );
};

export default WalletConnect; 