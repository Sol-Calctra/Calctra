import { NextRequest, NextResponse } from 'next/server';
import { 
  ResourceMatchingEngine, 
  ComputationDemand, 
  ComputationResource 
} from '../../lib/resourceMatching';
import { DemandManager } from '../../lib/demandManager';
import { ProviderManager } from '../../lib/providerManager';

// 创建资源匹配引擎实例
const matchingEngine = new ResourceMatchingEngine();

// 创建需求管理器和提供者管理器实例
const demandManager = new DemandManager();
const providerManager = new ProviderManager();

// 加载一些模拟数据
(() => {
  // 加载一些模拟资源数据
  const mockResources: ComputationResource[] = [
    {
      id: 'resource_1',
      providerId: 'provider_123',
      name: '高性能计算集群A',
      description: '适用于大规模科学计算和模拟的高性能集群',
      resourceType: 'CLUSTER',
      performance: {
        cores: 128,
        memory: 512,
        speed: 3.5,
        benchmarkScore: 18500
      },
      availability: {
        startTime: new Date('2023-10-01'),
        endTime: new Date('2023-12-31'),
        timeZone: 'UTC'
      },
      pricing: {
        pricePerHour: 25,
        minRentalTime: 1
      },
      location: {
        region: '北美',
        country: '美国'
      },
      reliability: 95,
      energyEfficiency: 85
    },
    {
      id: 'resource_2',
      providerId: 'provider_456',
      name: 'GPU渲染农场',
      description: '高性能GPU集群，适用于机器学习和渲染任务',
      resourceType: 'GPU',
      performance: {
        cores: 64,
        memory: 256,
        speed: 2.8,
        benchmarkScore: 16800
      },
      availability: {
        startTime: new Date('2023-10-15'),
        endTime: new Date('2024-02-15'),
        timeZone: 'UTC'
      },
      pricing: {
        pricePerHour: 35,
        minRentalTime: 1
      },
      location: {
        region: '亚太',
        country: '日本'
      },
      reliability: 92,
      energyEfficiency: 78
    },
    {
      id: 'resource_3',
      providerId: 'provider_789',
      name: '分布式计算网络',
      description: '大规模分布式计算网络，适用于数据处理和分析',
      resourceType: 'CLUSTER',
      performance: {
        cores: 256,
        memory: 1024,
        speed: 3.2,
        benchmarkScore: 21000
      },
      availability: {
        startTime: new Date('2023-11-01'),
        endTime: new Date('2024-04-30'),
        timeZone: 'UTC'
      },
      pricing: {
        pricePerHour: 45,
        minRentalTime: 2
      },
      location: {
        region: '欧洲',
        country: '德国'
      },
      reliability: 97,
      energyEfficiency: 90
    }
  ];
  
  // 将模拟资源添加到匹配引擎
  mockResources.forEach(resource => {
    matchingEngine.addResource(resource);
  });
})();

/**
 * 为特定需求查找匹配资源
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { demand, findCount = 3 } = data;
    
    if (!demand) {
      return NextResponse.json(
        { success: false, message: '缺少必要字段: demand' },
        { status: 400 }
      );
    }
    
    // 将需求添加到匹配引擎
    matchingEngine.addDemand(demand);
    
    // 执行匹配
    const matches = matchingEngine.matchResources();
    
    // 仅返回与当前需求相关的匹配结果，并限制返回数量
    const demandMatches = matches
      .filter(match => match.demand.id === demand.id)
      .slice(0, findCount);
    
    return NextResponse.json({
      success: true,
      data: {
        demand,
        matches: demandMatches
      }
    });
  } catch (error) {
    console.error('执行资源匹配失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `执行资源匹配失败: ${error instanceof Error ? error.message : String(error)}` 
      },
      { status: 500 }
    );
  }
}

/**
 * 获取所有匹配结果
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const demandId = url.searchParams.get('demandId');
    const resourceId = url.searchParams.get('resourceId');
    const providerId = url.searchParams.get('providerId');
    const consumerId = url.searchParams.get('consumerId');
    const status = url.searchParams.get('status');
    
    // In a real implementation, this would fetch from a database
    const mockMatches = [
      {
        id: 'match-1',
        demandId: 'demand-1',
        resourceId: 'resource-2',
        consumerId: 'consumer-123',
        providerId: 'provider-456',
        startDate: '2025-05-15T00:00:00Z',
        endDate: '2025-05-20T00:00:00Z',
        pricePerHour: 4.5,
        totalEstimatedCost: 450.0,
        status: 'confirmed',
        created: '2025-05-02T14:30:00Z',
        updated: '2025-05-03T09:15:00Z'
      },
      {
        id: 'match-2',
        demandId: 'demand-2',
        resourceId: 'resource-1',
        consumerId: 'consumer-456',
        providerId: 'provider-789',
        startDate: '2025-06-01T00:00:00Z',
        endDate: '2025-06-10T00:00:00Z',
        pricePerHour: 3.0,
        totalEstimatedCost: 650.0,
        status: 'created',
        created: '2025-05-11T10:20:00Z',
        updated: '2025-05-11T10:20:00Z'
      }
    ];
    
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

    return NextResponse.json({ matches: filteredMatches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// PATCH /api/matching/:matchId - Update match status
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
    
    const body = await request.json();
    
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required for updating a match' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses = ['created', 'consumerAccepted', 'confirmed', 'rejected', 'completed'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would update the match in the database
    // and interact with the blockchain
    const updatedMatch = {
      id: matchId,
      status: body.status,
      updated: new Date().toISOString()
    };
    
    return NextResponse.json(
      { message: 'Match status updated successfully', match: updatedMatch }
    );
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    );
  }
} 