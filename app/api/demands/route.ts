import { NextRequest, NextResponse } from 'next/server';
import { DemandManager, ManagedDemand } from '../../lib/demandManager';
import { ResourceMatchingEngine } from '../../lib/resourceMatching';

// 创建需求管理器实例
const demandManager = new DemandManager();

// 创建资源匹配引擎实例
const matchingEngine = new ResourceMatchingEngine();

// 模拟数据 - 在真实应用中，这些数据会来自数据库
(() => {
  // 注册模拟用户
  const user1 = demandManager.registerUser({
    name: '张教授',
    walletAddress: 'CALuserXyz789Abc456',
    email: 'zhang@university.example',
    organization: '中国科学院计算所',
    researchField: '流体动力学模拟'
  });
  
  const user2 = demandManager.registerUser({
    name: 'Dr. Johnson',
    walletAddress: 'CALuserDef321Ghi654',
    email: 'johnson@institute.example',
    organization: '国际量子计算研究所',
    researchField: '量子算法优化'
  });
  
  // 创建一些模拟需求
  const demand1 = demandManager.createDemand(user1.id, {
    title: '大规模流体动力学模拟',
    description: '需要高性能计算资源进行复杂流体动力学模型的数值模拟，涉及亿级网格单元计算。',
    resourceRequirements: {
      minCores: 64,
      minMemory: 256,
      minSpeed: 3.0,
      preferredResourceType: 'CLUSTER'
    },
    timeRequirements: {
      deadline: new Date('2023-12-15'),
      maxDuration: 120, // 小时
      preferredStartTime: new Date('2023-11-01')
    },
    budgetConstraints: {
      maxTotalBudget: 3000,
      maxHourlyRate: 30
    },
    priority: 'HIGH',
    location: {
      preferredRegion: '亚太',
      maxLatency: 100
    }
  });
  
  const demand2 = demandManager.createDemand(user2.id, {
    title: '量子电路模拟',
    description: '需要模拟50-100量子比特的量子电路行为，用于验证新开发的量子算法。',
    resourceRequirements: {
      minCores: 32,
      minMemory: 128,
      minSpeed: 2.5,
      preferredResourceType: 'GPU'
    },
    timeRequirements: {
      deadline: new Date('2023-11-30'),
      maxDuration: 72
    },
    budgetConstraints: {
      maxTotalBudget: 2000,
      maxHourlyRate: 35
    },
    priority: 'MEDIUM',
    location: {
      preferredRegion: '欧洲'
    }
  });
  
  // 发布需求
  demandManager.publishDemand(demand1!.id);
  demandManager.publishDemand(demand2!.id);
})();

/**
 * 获取计算需求列表
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const resourceType = url.searchParams.get('resourceType');
    const minCores = url.searchParams.get('minCores');
    const minMemory = url.searchParams.get('minMemory');
    const maxBudget = url.searchParams.get('maxBudget');
    const region = url.searchParams.get('region');
    const status = url.searchParams.get('status');
    const consumerId = url.searchParams.get('consumerId');
    
    // In a real implementation, this would fetch from a database
    const mockDemands = [
      {
        id: 'demand-1',
        title: 'Genomic Data Analysis Project',
        description: 'Need computational resources for analyzing large genomic datasets',
        consumerId: 'consumer-123',
        resourceRequirements: {
          resourceType: 'CPU',
          minCores: 16,
          minMemory: 64,
          minStorage: 1000,
          gpuRequired: false
        },
        timeRequirements: {
          expectedDuration: 72, // hours
          deadline: '2025-07-30T23:59:59Z',
          startAfter: '2025-06-15T00:00:00Z'
        },
        budgetConstraints: {
          maxBudget: 500,
          maxPricePerHour: 7.5
        },
        preferences: {
          preferredRegions: ['us-east', 'us-west'],
          preferredCountries: ['USA', 'Canada']
        },
        status: 'open',
        created: '2025-06-01T10:15:00Z',
        updated: '2025-06-02T14:30:00Z'
      },
      {
        id: 'demand-2',
        title: 'Machine Learning Model Training',
        description: 'GPU resources needed for training a complex neural network',
        consumerId: 'consumer-456',
        resourceRequirements: {
          resourceType: 'GPU',
          minCores: 8,
          minMemory: 32,
          minStorage: 500,
          gpuRequired: true,
          minGpuCount: 2
        },
        timeRequirements: {
          expectedDuration: 48, // hours
          deadline: '2025-06-25T23:59:59Z',
          startAfter: '2025-06-10T00:00:00Z'
        },
        budgetConstraints: {
          maxBudget: 800,
          maxPricePerHour: 15
        },
        preferences: {
          preferredRegions: ['eu-west', 'eu-central'],
          preferredCountries: ['Germany', 'France', 'Netherlands']
        },
        status: 'open',
        created: '2025-06-03T08:45:00Z',
        updated: '2025-06-03T08:45:00Z'
      },
      {
        id: 'demand-3',
        title: 'Climate Model Simulation',
        description: 'Computational resources for running complex climate simulations',
        consumerId: 'consumer-789',
        resourceRequirements: {
          resourceType: 'CPU',
          minCores: 32,
          minMemory: 128,
          minStorage: 2000,
          gpuRequired: false
        },
        timeRequirements: {
          expectedDuration: 120, // hours
          deadline: '2025-08-15T23:59:59Z',
          startAfter: '2025-07-01T00:00:00Z'
        },
        budgetConstraints: {
          maxBudget: 1200,
          maxPricePerHour: 10
        },
        preferences: {
          preferredRegions: ['ap-southeast', 'ap-northeast'],
          preferredCountries: ['Japan', 'Singapore', 'Australia']
        },
        status: 'matched',
        created: '2025-06-05T16:20:00Z',
        updated: '2025-06-07T09:30:00Z'
      }
    ];
    
    // Filter demands based on query parameters
    let filteredDemands = [...mockDemands];
    
    if (resourceType) {
      filteredDemands = filteredDemands.filter(demand => 
        demand.resourceRequirements.resourceType.toLowerCase() === resourceType.toLowerCase()
      );
    }
    
    if (minCores) {
      const cores = parseInt(minCores);
      if (!isNaN(cores)) {
        filteredDemands = filteredDemands.filter(demand => 
          demand.resourceRequirements.minCores >= cores
        );
      }
    }
    
    if (minMemory) {
      const memory = parseInt(minMemory);
      if (!isNaN(memory)) {
        filteredDemands = filteredDemands.filter(demand => 
          demand.resourceRequirements.minMemory >= memory
        );
      }
    }
    
    if (maxBudget) {
      const budget = parseFloat(maxBudget);
      if (!isNaN(budget)) {
        filteredDemands = filteredDemands.filter(demand => 
          demand.budgetConstraints.maxBudget <= budget
        );
      }
    }
    
    if (region) {
      filteredDemands = filteredDemands.filter(demand => 
        demand.preferences.preferredRegions.some(r => 
          r.toLowerCase().includes(region.toLowerCase())
        )
      );
    }
    
    if (status) {
      filteredDemands = filteredDemands.filter(demand => demand.status === status);
    }
    
    if (consumerId) {
      filteredDemands = filteredDemands.filter(demand => demand.consumerId === consumerId);
    }
    
    return NextResponse.json({ demands: filteredDemands });
  } catch (error) {
    console.error('Error fetching demands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch demands' },
      { status: 500 }
    );
  }
}

/**
 * 创建新的计算需求
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'consumerId',
      'resourceRequirements', 'timeRequirements', 
      'budgetConstraints', 'preferences'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate nested required fields
    const { resourceRequirements, timeRequirements, budgetConstraints, preferences } = body;
    
    // Resource requirements validation
    const requiredResourceFields = ['resourceType', 'minCores', 'minMemory', 'minStorage'];
    for (const field of requiredResourceFields) {
      if (!resourceRequirements[field]) {
        return NextResponse.json(
          { error: `Missing required resource field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Time requirements validation
    const requiredTimeFields = ['expectedDuration', 'deadline'];
    for (const field of requiredTimeFields) {
      if (!timeRequirements[field]) {
        return NextResponse.json(
          { error: `Missing required time field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Budget constraints validation
    const requiredBudgetFields = ['maxBudget', 'maxPricePerHour'];
    for (const field of requiredBudgetFields) {
      if (!budgetConstraints[field]) {
        return NextResponse.json(
          { error: `Missing required budget field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Preferences validation
    if (!preferences.preferredRegions || !Array.isArray(preferences.preferredRegions)) {
      return NextResponse.json(
        { error: 'preferredRegions must be an array' },
        { status: 400 }
      );
    }
    
    // Validate date formats
    if (timeRequirements.deadline) {
      const deadline = new Date(timeRequirements.deadline);
      if (isNaN(deadline.getTime())) {
        return NextResponse.json(
          { error: 'Invalid deadline date format' },
          { status: 400 }
        );
      }
    }
    
    if (timeRequirements.startAfter) {
      const startAfter = new Date(timeRequirements.startAfter);
      if (isNaN(startAfter.getTime())) {
        return NextResponse.json(
          { error: 'Invalid startAfter date format' },
          { status: 400 }
        );
      }
    }
    
    // In a real implementation, this would create a demand in the database
    // and potentially trigger matching algorithms
    const newDemand = {
      id: `demand-${Date.now()}`,
      ...body,
      status: 'open',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    return NextResponse.json(
      { message: 'Demand created successfully', demand: newDemand },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating demand:', error);
    return NextResponse.json(
      { error: 'Failed to create demand' },
      { status: 500 }
    );
  }
}

/**
 * 更新需求状态
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { demandId: string } }
) {
  try {
    const demandId = params.demandId || request.url.split('/').pop();
    
    if (!demandId) {
      return NextResponse.json(
        { error: 'Demand ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // In a real implementation, this would first check if the demand exists
    // and then update it in the database
    const updatedDemand = {
      id: demandId,
      ...body,
      updated: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: 'Demand updated successfully',
      demand: updatedDemand
    });
  } catch (error) {
    console.error('Error updating demand:', error);
    return NextResponse.json(
      { error: 'Failed to update demand' },
      { status: 500 }
    );
  }
}

// DELETE /api/demands/:demandId - Cancel a demand
export async function DELETE(
  request: NextRequest,
  { params }: { params: { demandId: string } }
) {
  try {
    const demandId = params.demandId || request.url.split('/').pop();
    
    if (!demandId) {
      return NextResponse.json(
        { error: 'Demand ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would update the demand status to 'cancelled'
    // in the database rather than actually deleting it
    
    return NextResponse.json({
      message: 'Demand cancelled successfully',
      id: demandId
    });
  } catch (error) {
    console.error('Error cancelling demand:', error);
    return NextResponse.json(
      { error: 'Failed to cancel demand' },
      { status: 500 }
    );
  }
} 