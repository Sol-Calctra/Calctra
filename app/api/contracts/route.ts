import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data for contracts
const mockContracts = [
  {
    id: 'contract-abc123',
    matchId: 'match-def456',
    demandId: 'demand-234',
    resourceId: 'resource-567',
    providerId: 'provider-890',
    consumerId: 'consumer-112',
    status: 'active', // draft, signed, active, completed, terminated, disputed
    startTime: '2025-08-01T10:00:00Z',
    endTime: '2025-08-10T18:00:00Z',
    actualStartTime: '2025-08-01T10:15:00Z',
    actualEndTime: null,
    pricePerHour: 120.00,
    estimatedTotalCost: 24 * 9 * 120, // 9 days * 24 hours * hourly rate
    actualCostToDate: 4800.00,
    paymentTerms: {
      billingCycle: 'daily',
      paymentWindow: 48, // hours
      penalties: {
        latePayment: 0.05, // 5% penalty for late payment
        earlyTermination: 0.10 // 10% of remaining contract value
      }
    },
    termsAndConditions: 'https://calctra.com/contract-terms/v1',
    performance: {
      uptime: 99.8,
      availabilityTarget: 99.5,
      responsiveness: 45 // ms
    },
    createdAt: '2025-07-16T11:20:00Z',
    updatedAt: '2025-08-01T10:15:00Z',
    blockchain: {
      contractAddress: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      transactionHash: '0xf9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0',
      network: 'Ethereum',
      deployedAt: '2025-07-17T08:30:15Z',
      verificationUrl: 'https://etherscan.io/tx/0xf9e8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0'
    }
  },
  {
    id: 'contract-def456',
    matchId: 'match-abc123',
    demandId: 'demand-123',
    resourceId: 'resource-456',
    providerId: 'provider-789',
    consumerId: 'consumer-101',
    status: 'completed',
    startTime: '2025-07-01T08:00:00Z',
    endTime: '2025-07-05T17:00:00Z',
    actualStartTime: '2025-07-01T08:10:00Z',
    actualEndTime: '2025-07-05T16:45:00Z',
    pricePerHour: 150.00,
    estimatedTotalCost: 24 * 4 * 150, // 4 days * 24 hours * hourly rate
    actualCostToDate: 14475.00, // actual cost based on actual usage
    paymentTerms: {
      billingCycle: 'weekly',
      paymentWindow: 72, // hours
      penalties: {
        latePayment: 0.03, // 3% penalty for late payment
        earlyTermination: 0.05 // 5% of remaining contract value
      }
    },
    termsAndConditions: 'https://calctra.com/contract-terms/v1',
    performance: {
      uptime: 99.95,
      availabilityTarget: 99.9,
      responsiveness: 32 // ms
    },
    createdAt: '2025-06-25T14:30:00Z',
    updatedAt: '2025-07-05T16:50:00Z',
    blockchain: {
      contractAddress: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
      transactionHash: '0xe8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9',
      network: 'Ethereum',
      deployedAt: '2025-06-26T09:15:30Z',
      verificationUrl: 'https://etherscan.io/tx/0xe8d7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9'
    }
  },
  {
    id: 'contract-ghi789',
    matchId: 'match-jkl012',
    demandId: 'demand-345',
    resourceId: 'resource-678',
    providerId: 'provider-901',
    consumerId: 'consumer-234',
    status: 'terminated',
    startTime: '2025-05-15T12:00:00Z',
    endTime: '2025-05-30T12:00:00Z',
    actualStartTime: '2025-05-15T12:05:00Z',
    actualEndTime: '2025-05-22T18:30:00Z',
    pricePerHour: 95.00,
    estimatedTotalCost: 24 * 15 * 95, // 15 days * 24 hours * hourly rate
    actualCostToDate: 17100.00, // actual cost based on actual usage
    paymentTerms: {
      billingCycle: 'weekly',
      paymentWindow: 48, // hours
      penalties: {
        latePayment: 0.04, // 4% penalty for late payment
        earlyTermination: 0.15 // 15% of remaining contract value
      }
    },
    termsAndConditions: 'https://calctra.com/contract-terms/v1',
    performance: {
      uptime: 98.7,
      availabilityTarget: 99.0,
      responsiveness: 78 // ms
    },
    createdAt: '2025-05-10T09:45:00Z',
    updatedAt: '2025-05-22T18:35:00Z',
    terminationReason: 'Resource performance below contractual requirements',
    blockchain: {
      contractAddress: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
      transactionHash: '0xd7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8',
      network: 'Ethereum',
      deployedAt: '2025-05-11T10:20:45Z',
      verificationUrl: 'https://etherscan.io/tx/0xd7c6b5a4d3c2b1a0f9e8d7c6b5a4d3c2b1a0f9e8'
    }
  }
];

// GET /api/contracts - Get all contracts or filter by query parameters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const providerId = url.searchParams.get('providerId');
    const consumerId = url.searchParams.get('consumerId');
    const status = url.searchParams.get('status');
    const resourceId = url.searchParams.get('resourceId');
    const demandId = url.searchParams.get('demandId');
    const matchId = url.searchParams.get('matchId');
    
    // Filter contracts based on query parameters
    let filteredContracts = [...mockContracts];
    
    if (providerId) {
      filteredContracts = filteredContracts.filter(contract => contract.providerId === providerId);
    }
    
    if (consumerId) {
      filteredContracts = filteredContracts.filter(contract => contract.consumerId === consumerId);
    }
    
    if (status) {
      filteredContracts = filteredContracts.filter(contract => contract.status === status);
    }
    
    if (resourceId) {
      filteredContracts = filteredContracts.filter(contract => contract.resourceId === resourceId);
    }
    
    if (demandId) {
      filteredContracts = filteredContracts.filter(contract => contract.demandId === demandId);
    }
    
    if (matchId) {
      filteredContracts = filteredContracts.filter(contract => contract.matchId === matchId);
    }
    
    return NextResponse.json({ contracts: filteredContracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

// POST /api/contracts - Create a new contract
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'matchId', 'demandId', 'resourceId', 'providerId', 'consumerId',
      'startTime', 'endTime', 'pricePerHour', 'paymentTerms'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate dates
    const now = new Date();
    const startTime = new Date(body.startTime);
    const endTime = new Date(body.endTime);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for startTime or endTime' },
        { status: 400 }
      );
    }
    
    if (startTime < now) {
      return NextResponse.json(
        { error: 'Start time must be in the future' },
        { status: 400 }
      );
    }
    
    if (endTime <= startTime) {
      return NextResponse.json(
        { error: 'End time must be after the start time' },
        { status: 400 }
      );
    }
    
    // Validate price
    if (isNaN(body.pricePerHour) || body.pricePerHour <= 0) {
      return NextResponse.json(
        { error: 'Price per hour must be a positive number' },
        { status: 400 }
      );
    }
    
    // Calculate estimated total cost
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const estimatedTotalCost = body.pricePerHour * durationHours;
    
    // In a real implementation, this would:
    // 1. Verify that the match, demand, and resource exist
    // 2. Check if a contract already exists for this match
    // 3. Generate blockchain contract (smart contract deployment)
    // 4. Store the contract details in the database
    
    const mockBlockchainTransaction = {
      contractAddress: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      transactionHash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`,
      network: 'Ethereum',
      deployedAt: now.toISOString(),
      verificationUrl: `https://etherscan.io/tx/0x${Math.random().toString(16).slice(2)}`
    };
    
    const newContract = {
      id: `contract-${Date.now()}`,
      ...body,
      status: 'draft',
      estimatedTotalCost,
      actualCostToDate: 0,
      actualStartTime: null,
      actualEndTime: null,
      termsAndConditions: 'https://calctra.com/contract-terms/v1',
      performance: {
        uptime: null,
        availabilityTarget: body.availabilityTarget || 99.5,
        responsiveness: null
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      blockchain: mockBlockchainTransaction
    };
    
    return NextResponse.json(
      { message: 'Contract created successfully', contract: newContract },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}

// PATCH /api/contracts/:contractId - Update a contract
export async function PATCH(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const contractId = params.contractId || request.url.split('/').pop();
    
    if (!contractId) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }
    
    // Find the contract in mock data
    const contract = mockContracts.find(c => c.id === contractId);
    
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate status changes
    if (body.status) {
      const validStatusValues = ['draft', 'signed', 'active', 'completed', 'terminated', 'disputed'];
      if (!validStatusValues.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status value. Must be one of: ${validStatusValues.join(', ')}` },
          { status: 400 }
        );
      }
      
      // Validate status transitions
      const invalidTransitions: Record<string, string[]> = {
        'draft': ['completed', 'terminated'],
        'signed': ['draft', 'completed', 'terminated'],
        'active': ['draft', 'signed'],
        'completed': ['draft', 'signed', 'terminated', 'disputed'],
        'terminated': ['draft', 'completed']
      };
      
      if (
        invalidTransitions[body.status] && 
        invalidTransitions[body.status].includes(contract.status)
      ) {
        return NextResponse.json(
          { error: `Cannot transition from ${contract.status} to ${body.status}` },
          { status: 400 }
        );
      }
      
      // Handle specific transitions
      if (body.status === 'active' && contract.status === 'signed') {
        // Set actualStartTime when transitioning to active
        body.actualStartTime = new Date().toISOString();
      }
      
      if (body.status === 'completed' && contract.status === 'active') {
        // Set actualEndTime when transitioning to completed
        body.actualEndTime = new Date().toISOString();
      }
    }
    
    // In a real implementation, this would:
    // 1. Update the contract in the database
    // 2. If status is changing, trigger blockchain transactions to update the smart contract
    // 3. If pricing or terms are changing, require both parties to sign again
    
    const updatedContract = {
      ...contract,
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: 'Contract updated successfully',
      contract: updatedContract
    });
  } catch (error) {
    console.error('Error updating contract:', error);
    return NextResponse.json(
      { error: 'Failed to update contract' },
      { status: 500 }
    );
  }
}

// GET /api/contracts/:contractId - Get a specific contract by ID
export async function getById(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const contractId = params.contractId;
    
    if (!contractId) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }
    
    // Find the contract in mock data
    const contract = mockContracts.find(c => c.id === contractId);
    
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ contract });
  } catch (error) {
    console.error('Error fetching contract:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contract' },
      { status: 500 }
    );
  }
}

// POST /api/contracts/:contractId/sign - Sign a contract
export async function sign(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const contractId = params.contractId;
    
    if (!contractId) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }
    
    // Find the contract in mock data
    const contract = mockContracts.find(c => c.id === contractId);
    
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.signatureId) {
      return NextResponse.json(
        { error: 'Signature ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.party) {
      return NextResponse.json(
        { error: 'Party (provider or consumer) is required' },
        { status: 400 }
      );
    }
    
    if (body.party !== 'provider' && body.party !== 'consumer') {
      return NextResponse.json(
        { error: 'Party must be either "provider" or "consumer"' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Verify the signature using blockchain/cryptographic methods
    // 2. Update the contract status to 'signed' if both parties have signed
    // 3. Record the signature details in the database
    
    // Mock response assuming both parties have signed
    const updatedContract = {
      ...contract,
      status: 'signed',
      updatedAt: new Date().toISOString(),
      signatures: {
        provider: {
          signatureId: body.party === 'provider' ? body.signatureId : 'existing-provider-signature',
          timestamp: body.party === 'provider' ? new Date().toISOString() : '2025-07-16T10:15:00Z',
          verified: true
        },
        consumer: {
          signatureId: body.party === 'consumer' ? body.signatureId : 'existing-consumer-signature',
          timestamp: body.party === 'consumer' ? new Date().toISOString() : '2025-07-16T11:05:00Z',
          verified: true
        }
      }
    };
    
    return NextResponse.json({
      message: 'Contract signed successfully',
      contract: updatedContract
    });
  } catch (error) {
    console.error('Error signing contract:', error);
    return NextResponse.json(
      { error: 'Failed to sign contract' },
      { status: 500 }
    );
  }
}

// POST /api/contracts/:contractId/dispute - File a dispute for a contract
export async function dispute(
  request: NextRequest,
  { params }: { params: { contractId: string } }
) {
  try {
    const contractId = params.contractId;
    
    if (!contractId) {
      return NextResponse.json(
        { error: 'Contract ID is required' },
        { status: 400 }
      );
    }
    
    // Find the contract in mock data
    const contract = mockContracts.find(c => c.id === contractId);
    
    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.reason) {
      return NextResponse.json(
        { error: 'Dispute reason is required' },
        { status: 400 }
      );
    }
    
    if (!body.filedBy) {
      return NextResponse.json(
        { error: 'Filed by (provider or consumer) is required' },
        { status: 400 }
      );
    }
    
    if (body.filedBy !== 'provider' && body.filedBy !== 'consumer') {
      return NextResponse.json(
        { error: 'Filed by must be either "provider" or "consumer"' },
        { status: 400 }
      );
    }
    
    if (!body.evidence) {
      return NextResponse.json(
        { error: 'Evidence for dispute is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Create a dispute record in the database
    // 2. Update the contract status to 'disputed'
    // 3. Notify both parties of the dispute
    // 4. Trigger dispute resolution process
    
    const now = new Date();
    
    const dispute = {
      id: `dispute-${Date.now()}`,
      contractId,
      filedBy: body.filedBy,
      reason: body.reason,
      evidence: body.evidence,
      filedAt: now.toISOString(),
      status: 'pending', // pending, under_review, resolved, dismissed
      resolution: null,
      resolutionDetails: null,
      updatedAt: now.toISOString()
    };
    
    const updatedContract = {
      ...contract,
      status: 'disputed',
      updatedAt: now.toISOString(),
      disputes: [dispute]
    };
    
    return NextResponse.json({
      message: 'Dispute filed successfully',
      contract: updatedContract,
      dispute
    });
  } catch (error) {
    console.error('Error filing dispute:', error);
    return NextResponse.json(
      { error: 'Failed to file dispute' },
      { status: 500 }
    );
  }
} 