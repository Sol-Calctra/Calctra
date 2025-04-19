# Calctra Smart Contracts

This directory contains the Solana smart contracts for the Calctra platform.

## Contract Overview

The Calctra platform uses several smart contracts to manage the decentralized marketplace for computing resources:

1. **TokenContract**: Implements the CAL token functionality
2. **ResourceContract**: Manages resource registration and availability
3. **DemandContract**: Handles demand creation and matching
4. **MatchingContract**: Implements the resource-demand matching algorithms
5. **TransactionContract**: Manages payment and settlement processes

## Development Setup

### Prerequisites

- Rust 1.65+
- Solana CLI tools
- Anchor framework

### Build Instructions

```bash
# Build all contracts
anchor build

# Deploy to local validator
anchor deploy

# Run tests
anchor test
```

## Contract Architecture

The contracts follow a modular architecture to ensure upgradability and security:

- Program-derived accounts for state management
- Cross-program invocations for composability
- Event emission for off-chain tracking

## Security Considerations

- All contracts undergo rigorous testing and auditing
- Time-locks for administrative operations
- Multi-signature requirements for critical functions 