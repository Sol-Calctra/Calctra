import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock data for resource matches
const mockMatches = [
  {
    id: 'match-abc123',
    demandId: 'demand-123',
    resourceId: 'resource-456',
    providerId: 'provider-789', 
    consumerId: 'consumer-101',
    status: 'pending', // pending, accepted, rejected, completed, cancelled
    score: 89.5, // matching score based on requirements fit
    proposedStartTime: '2025-07-01T08:00:00Z',
    proposedEndTime: '2025-07-05T17:00:00Z',
    proposedPrice: 150.00, // price per hour
    createdAt: '2025-06-25T14:30:00Z',
    updatedAt: '2025-06-25T14:30:00Z',
    expiresAt: '2025-06-28T14:30:00Z', // when the match proposal expires
    resources: {
      cores: 16,
      memory: 64,
      storage: 500,
      gpu: 'NVIDIA RTX 4090',
      gpuCount: 2
    },
    compatibilityNotes: [
      'Resource exceeds all minimum requirements',
      'Provider has 99.9% uptime over the last 30 days',
      'Provider is in the preferred region'
    ]
  },
  {
    id: 'match-def456',
    demandId: 'demand-234',
    resourceId: 'resource-567',
    providerId: 'provider-890',
    consumerId: 'consumer-112',
    status: 'accepted',
    score: 76.2,
    proposedStartTime: '2025-08-01T10:00:00Z',
    proposedEndTime: '2025-08-10T18:00:00Z',
    proposedPrice: 120.00,
    createdAt: '2025-07-15T09:45:00Z',
    updatedAt: '2025-07-16T11:20:00Z',
    expiresAt: '2025-07-18T09:45:00Z',
    resources: {
      cores: 32,
      memory: 128,
      storage: 1000,
      gpu: 'NVIDIA RTX 3080',
      gpuCount: 4
    },
    compatibilityNotes: [
      'Resource exceeds most requirements',
      'GPU is slightly below requested performance',
      'Provider has 98.5% uptime over the last 30 days'
    ]
  },
  {
    id: 'match-ghi789',
    demandId: 'demand-234',
    resourceId: 'resource-678',
    providerId: 'provider-901',
    consumerId: 'consumer-112',
    status: 'rejected',
    score: 65.8,
    proposedStartTime: '2025-08-02T09:00:00Z',
    proposedEndTime: '2025-08-08T17:00:00Z',
    proposedPrice: 95.00,
    createdAt: '2025-07-15T10:15:00Z',
    updatedAt: '2025-07-15T14:30:00Z',
    expiresAt: '2025-07-18T10:15:00Z',
    resources: {
      cores: 24,
      memory: 96,
      storage: 750,
      gpu: 'NVIDIA RTX 3070',
      gpuCount: 2
    },
    compatibilityNotes: [
      'GPU performance below requirements',
      'Provider is outside preferred region',
      'Provider has 97.2% uptime over the last 30 days'
    ]
  }
];

// GET /api/matches - Get all matches or filter by query parameters
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const demandId = url.searchParams.get('demandId');
    const resourceId = url.searchParams.get('resourceId');
    const providerId = url.searchParams.get('providerId');
    const consumerId = url.searchParams.get('consumerId');
    const status = url.searchParams.get('status');
    const minScore = url.searchParams.get('minScore');
    
    // Filter matches based on query parameters
    let filteredMatches = [...mockMatches];
    
    if (demandId) {
      filteredMatches = filteredMatches.filter(match => match.demandId === demandId);
    }
    
    if (resourceId) {
      filteredMatches = filteredMatches.filter(match => match.resourceId === resourceId);
    }
    
    if (providerId) {
      filteredMatches = filteredMatches.filter(match => match.providerId === providerId);
    }
    
    if (consumerId) {
      filteredMatches = filteredMatches.filter(match => match.consumerId === consumerId);
    }
    
    if (status) {
      filteredMatches = filteredMatches.filter(match => match.status === status);
    }
    
    if (minScore) {
      const minScoreValue = parseFloat(minScore);
      if (!isNaN(minScoreValue)) {
        filteredMatches = filteredMatches.filter(match => match.score >= minScoreValue);
      }
    }
    
    return NextResponse.json({ matches: filteredMatches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// POST /api/matches - Create a new match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'demandId', 'resourceId', 'providerId', 'consumerId', 
      'proposedStartTime', 'proposedEndTime', 'proposedPrice', 'resources'
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
    const proposedStart = new Date(body.proposedStartTime);
    const proposedEnd = new Date(body.proposedEndTime);
    
    if (isNaN(proposedStart.getTime()) || isNaN(proposedEnd.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for proposedStartTime or proposedEndTime' },
        { status: 400 }
      );
    }
    
    if (proposedStart <= now) {
      return NextResponse.json(
        { error: 'Proposed start time must be in the future' },
        { status: 400 }
      );
    }
    
    if (proposedEnd <= proposedStart) {
      return NextResponse.json(
        { error: 'Proposed end time must be after the start time' },
        { status: 400 }
      );
    }
    
    // Validate price
    if (isNaN(body.proposedPrice) || body.proposedPrice <= 0) {
      return NextResponse.json(
        { error: 'Proposed price must be a positive number' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Verify that the demand and resource exist
    // 2. Calculate a matching score based on requirements fit
    // 3. Store the match details in the database
    
    const expirationDate = new Date(now);
    expirationDate.setDate(expirationDate.getDate() + 3); // Match expires in 3 days
    
    // Generate a mock matching score between 50 and 100
    const score = 50 + Math.random() * 50;
    
    const newMatch = {
      id: `match-${Date.now()}`,
      ...body,
      status: 'pending',
      score: parseFloat(score.toFixed(1)),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: expirationDate.toISOString(),
      compatibilityNotes: [
        'Automatically generated match',
        'Score based on initial compatibility assessment'
      ]
    };
    
    return NextResponse.json(
      { message: 'Match created successfully', match: newMatch },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}

// PATCH /api/matches/:matchId - Update a match status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = params.matchId || request.url.split('/').pop();
    
    if (!matchId) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }
    
    // Find the match in mock data
    const match = mockMatches.find(m => m.id === matchId);
    
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
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
    
    const validStatusValues = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
    if (!validStatusValues.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status value. Must be one of: ${validStatusValues.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate status transitions
    const invalidTransitions: Record<string, string[]> = {
      'completed': ['pending', 'rejected', 'cancelled'],
      'cancelled': ['completed', 'rejected'],
      'rejected': ['completed', 'accepted', 'cancelled']
    };
    
    if (
      invalidTransitions[body.status] && 
      invalidTransitions[body.status].includes(match.status)
    ) {
      return NextResponse.json(
        { error: `Cannot transition from ${match.status} to ${body.status}` },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Update the match status in the database
    // 2. If status is 'accepted', create a contract
    // 3. If status is 'rejected' or 'cancelled', update demand availability
    
    const updatedMatch = {
      ...match,
      status: body.status,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: 'Match updated successfully',
      match: updatedMatch
    });
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    );
  }
}

// GET /api/matches/:matchId - Get a specific match by ID
export async function getById(
  request: NextRequest,
  { params }: { params: { matchId: string } }
) {
  try {
    const matchId = params.matchId;
    
    if (!matchId) {
      return NextResponse.json(
        { error: 'Match ID is required' },
        { status: 400 }
      );
    }
    
    // Find the match in mock data
    const match = mockMatches.find(m => m.id === matchId);
    
    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ match });
  } catch (error) {
    console.error('Error fetching match:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    );
  }
}

// POST /api/matches/find - Find potential matches for a demand
export async function find(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.demandId) {
      return NextResponse.json(
        { error: 'Demand ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would:
    // 1. Fetch the demand details
    // 2. Search for available resources that match the demand requirements
    // 3. Calculate matching scores for each potential resource
    // 4. Return sorted matches
    
    // Mock response with potential matches
    const potentialMatches = [
      {
        resourceId: 'resource-456',
        providerId: 'provider-789',
        score: 89.5,
        availableFrom: '2025-07-01T08:00:00Z',
        availableUntil: '2025-07-15T17:00:00Z',
        estimatedPrice: 150.00,
        resources: {
          cores: 16,
          memory: 64,
          storage: 500,
          gpu: 'NVIDIA RTX 4090',
          gpuCount: 2
        },
        providerRating: 4.8,
        providerUptime: '99.9%',
        region: 'EU-West'
      },
      {
        resourceId: 'resource-567',
        providerId: 'provider-890',
        score: 76.2,
        availableFrom: '2025-06-28T10:00:00Z',
        availableUntil: '2025-08-15T18:00:00Z',
        estimatedPrice: 120.00,
        resources: {
          cores: 32,
          memory: 128,
          storage: 1000,
          gpu: 'NVIDIA RTX 3080',
          gpuCount: 4
        },
        providerRating: 4.6,
        providerUptime: '98.5%',
        region: 'US-East'
      },
      {
        resourceId: 'resource-678',
        providerId: 'provider-901',
        score: 65.8,
        availableFrom: '2025-07-05T09:00:00Z',
        availableUntil: '2025-07-25T17:00:00Z',
        estimatedPrice: 95.00,
        resources: {
          cores: 24,
          memory: 96,
          storage: 750,
          gpu: 'NVIDIA RTX 3070',
          gpuCount: 2
        },
        providerRating: 4.3,
        providerUptime: '97.2%',
        region: 'Asia-East'
      }
    ];
    
    return NextResponse.json({
      demandId: body.demandId,
      potentialMatches
    });
  } catch (error) {
    console.error('Error finding matches:', error);
    return NextResponse.json(
      { error: 'Failed to find matches' },
      { status: 500 }
    );
  }
}

// Additional API endpoint for match metrics
// GET /api/matches/metrics - Get aggregated metrics about matches
export async function metrics(request: NextRequest) {
  try {
    // In a real implementation, this would calculate metrics from the database
    const mockMetrics = {
      totalMatches: 125,
      matchesByStatus: {
        pending: 45,
        accepted: 30,
        rejected: 20,
        cancelled: 10,
        in_progress: 12,
        completed: 5,
        failed: 3
      },
      averageMatchTime: 48.5, // hours
      averageAcceptanceRate: 0.68, // 68%
      totalResourcesMatched: 87,
      totalDemandsMatched: 103,
      totalValueLocked: 25350.75 // in currency units
    };
    
    return NextResponse.json({ metrics: mockMetrics });
  } catch (error) {
    console.error('Error fetching match metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match metrics' },
      { status: 500 }
    );
  }
} 