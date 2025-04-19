import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/transactions - Get all transactions or filter by query parameters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const providerId = url.searchParams.get('providerId');
    const consumerId = url.searchParams.get('consumerId');
    const contractId = url.searchParams.get('contractId');
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    
    // In a real implementation, this would fetch from a database
    const mockTransactions = [
      {
        id: 'tx-abc123',
        contractId: 'contract-abc123',
        providerId: 'provider-456',
        consumerId: 'consumer-456',
        type: 'deposit',
        amount: 696.00,
        status: 'completed',
        transactionHash: '0xabc123def456ghi789jkl012mno345pqr678',
        paymentMethod: 'crypto',
        timestamp: '2025-06-10T08:30:00Z',
        description: 'Initial deposit for computation services'
      },
      {
        id: 'tx-def456',
        contractId: 'contract-def456',
        providerId: 'provider-321',
        consumerId: 'consumer-789',
        type: 'refund',
        amount: 18.50,
        status: 'completed',
        transactionHash: '0xstu901vwx234yz5678abc90def123ghi45',
        paymentMethod: 'crypto',
        timestamp: '2025-05-20T07:15:00Z',
        description: 'Refund for unused computation time (2 hours)'
      },
      {
        id: 'tx-ghi789',
        contractId: 'contract-def456',
        providerId: 'provider-321',
        consumerId: 'consumer-789',
        type: 'payment',
        amount: 1091.50,
        status: 'completed',
        transactionHash: '0x345jkl678mno901pqr234stu567vwx890',
        paymentMethod: 'crypto',
        timestamp: '2025-05-20T06:45:00Z',
        description: 'Final payment for computation services'
      },
      {
        id: 'tx-jkl012',
        contractId: 'contract-ghi789',
        providerId: 'provider-789',
        consumerId: 'consumer-123',
        type: 'deposit',
        amount: 810.00,
        status: 'pending',
        paymentMethod: 'crypto',
        timestamp: '2025-06-20T16:00:00Z',
        description: 'Initial deposit for computation services'
      }
    ];
    
    // Filter transactions based on query parameters
    let filteredTransactions = [...mockTransactions];
    
    if (providerId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.providerId === providerId);
    }
    
    if (consumerId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.consumerId === consumerId);
    }
    
    if (contractId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.contractId === contractId);
    }
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(tx => tx.type === type);
    }
    
    if (status) {
      filteredTransactions = filteredTransactions.filter(tx => tx.status === status);
    }
    
    return NextResponse.json({ transactions: filteredTransactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'contractId', 'providerId', 'consumerId', 'type', 'amount', 'paymentMethod'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate transaction type
    const validTypes = ['deposit', 'payment', 'refund', 'penalty'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid transaction type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate amount
    if (isNaN(body.amount) || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Verify that the contract exists
    // 2. Process the payment through a payment gateway or blockchain
    // 3. Store the transaction details in the database
    
    // Simulate blockchain transaction
    const transactionHash = body.type !== 'deposit' ? 
      `0x${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}` : 
      undefined;
    
    const newTransaction = {
      id: `tx-${Date.now()}`,
      ...body,
      status: body.type === 'deposit' ? 'pending' : 'completed',
      transactionHash,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(
      { message: 'Transaction created successfully', transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// PATCH /api/transactions/:transactionId - Update a transaction status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const transactionId = params.transactionId || request.url.split('/').pop();
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Validate status
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    const validStatusValues = ['pending', 'completed', 'failed', 'refunded', 'disputed'];
    if (!validStatusValues.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status value. Must be one of: ${validStatusValues.join(', ')}` },
        { status: 400 }
      );
    }
    
    // If completing a deposit transaction, require transactionHash
    if (body.status === 'completed' && !body.transactionHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required when completing a transaction' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Verify that the transaction exists
    // 2. Update the transaction status in the database
    // 3. If the status is 'completed', update the contract balance
    
    const updatedTransaction = {
      id: transactionId,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// GET /api/transactions/:transactionId - Get a specific transaction by ID
export async function getById(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const transactionId = params.transactionId;
    
    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would fetch the transaction from a database
    const mockTransaction = {
      id: transactionId,
      contractId: 'contract-abc123',
      providerId: 'provider-456',
      consumerId: 'consumer-456',
      type: 'deposit',
      amount: 696.00,
      status: 'completed',
      transactionHash: '0xabc123def456ghi789jkl012mno345pqr678',
      paymentMethod: 'crypto',
      timestamp: '2025-06-10T08:30:00Z',
      description: 'Initial deposit for computation services'
    };
    
    return NextResponse.json({ transaction: mockTransaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// GET /api/transactions/summary - Get transaction summaries for providers and consumers
export async function summary(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const providerId = url.searchParams.get('providerId');
    const consumerId = url.searchParams.get('consumerId');
    
    if (!providerId && !consumerId) {
      return NextResponse.json(
        { error: 'Either providerId or consumerId is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would calculate summaries from the database
    
    let summary = {};
    
    if (providerId) {
      summary = {
        ...summary,
        provider: {
          totalEarnings: 2583.50,
          pendingPayments: 0,
          completedTransactions: 3,
          totalTransactions: 3,
          lastPaymentDate: '2025-05-20T06:45:00Z',
          transactionsByType: {
            payment: 2,
            refund: 1
          }
        }
      };
    }
    
    if (consumerId) {
      summary = {
        ...summary,
        consumer: {
          totalSpent: 2597.50,
          pendingDeposits: 810.00,
          completedTransactions: 3,
          totalTransactions: 4,
          lastTransactionDate: '2025-06-20T16:00:00Z',
          transactionsByType: {
            deposit: 2,
            payment: 1,
            refund: 1
          }
        }
      };
    }
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction summary' },
      { status: 500 }
    );
  }
} 