import { NextRequest, NextResponse } from 'next/server';
import { ProviderManager, ResourceProvider } from '../../lib/providerManager';
import { ComputationResource } from '../../lib/resourceMatching';

// 创建提供者管理器实例
const providerManager = new ProviderManager();

// 模拟数据 - 在真实应用中，这些数据会来自数据库
const mockProviders: ResourceProvider[] = [
  {
    id: 'provider_123',
    name: 'Cloud Computing Solutions',
    description: '企业级计算资源提供商',
    walletAddress: 'CALproviderAbc123XYZ456',
    contactEmail: 'info@cloudcomputing.example',
    website: 'https://cloudcomputing.example',
    country: '美国',
    organizationType: 'CORPORATE',
    verificationStatus: 'VERIFIED',
    reputationScore: 92,
    joinedDate: new Date('2023-01-15'),
    resources: []
  },
  {
    id: 'provider_456',
    name: '量子计算研究所',
    description: '专注于量子计算资源提供',
    walletAddress: 'CALproviderQbc789XYZ012',
    contactEmail: 'research@quantum.example',
    country: '德国',
    organizationType: 'ACADEMIC',
    verificationStatus: 'VERIFIED',
    reputationScore: 88,
    joinedDate: new Date('2023-03-22'),
    resources: []
  }
];

// 模拟初始化数据
(() => {
  // 添加模拟提供者
  mockProviders.forEach(provider => {
    providerManager.providers.set(provider.id, provider);
  });

  // 添加一些模拟资源
  providerManager.addResourceToProvider('provider_123', {
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
  });

  providerManager.addResourceToProvider('provider_456', {
    name: '量子计算处理器Q1',
    description: '5量子比特量子计算资源，适用于量子算法研究',
    resourceType: 'QUANTUM',
    performance: {
      cores: 1,
      memory: 16,
      speed: 1.0,
      benchmarkScore: 9500
    },
    availability: {
      startTime: new Date('2023-10-15'),
      endTime: new Date('2024-04-15'),
      timeZone: 'CET'
    },
    pricing: {
      pricePerHour: 45,
      minRentalTime: 0.5
    },
    location: {
      region: '欧洲',
      country: '德国'
    },
    reliability: 85,
    energyEfficiency: 80
  });
})();

/**
 * 获取所有资源列表
 */
export async function GET(request: NextRequest) {
  try {
    // 获取所有已验证提供者的资源
    const providers = providerManager.listVerifiedProviders();
    let allResources: ComputationResource[] = [];
    
    providers.forEach(provider => {
      allResources = allResources.concat(provider.resources);
    });
    
    // 筛选和排序
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const minCores = parseInt(url.searchParams.get('minCores') || '0');
    const minMemory = parseInt(url.searchParams.get('minMemory') || '0');
    const maxPrice = parseInt(url.searchParams.get('maxPrice') || '9999');
    const region = url.searchParams.get('region');
    
    // 应用筛选条件
    let filteredResources = allResources;
    
    if (type) {
      filteredResources = filteredResources.filter(r => r.resourceType === type);
    }
    
    if (minCores > 0) {
      filteredResources = filteredResources.filter(r => r.performance.cores >= minCores);
    }
    
    if (minMemory > 0) {
      filteredResources = filteredResources.filter(r => r.performance.memory >= minMemory);
    }
    
    if (maxPrice < 9999) {
      filteredResources = filteredResources.filter(r => r.pricing.pricePerHour <= maxPrice);
    }
    
    if (region) {
      filteredResources = filteredResources.filter(r => r.location.region === region);
    }
    
    // 按性价比排序（性能分数/价格）
    filteredResources.sort((a, b) => {
      const valueA = a.performance.benchmarkScore / a.pricing.pricePerHour;
      const valueB = b.performance.benchmarkScore / b.pricing.pricePerHour;
      return valueB - valueA; // 从高到低排序
    });
    
    return NextResponse.json({
      success: true,
      data: filteredResources
    });
  } catch (error) {
    console.error('获取资源列表失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `获取资源列表失败: ${error instanceof Error ? error.message : String(error)}` 
      },
      { status: 500 }
    );
  }
}

/**
 * 添加新资源
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { providerId, resource } = data;
    
    if (!providerId || !resource) {
      return NextResponse.json(
        { success: false, message: '缺少必要字段: providerId 或 resource' },
        { status: 400 }
      );
    }
    
    // 检查提供者是否存在和已验证
    const provider = providerManager.getProvider(providerId);
    if (!provider) {
      return NextResponse.json(
        { success: false, message: `提供者 ID ${providerId} 不存在` },
        { status: 404 }
      );
    }
    
    if (provider.verificationStatus !== 'VERIFIED') {
      return NextResponse.json(
        { success: false, message: '只有已验证的提供者才能添加资源' },
        { status: 403 }
      );
    }
    
    // 添加资源
    const newResource = providerManager.addResourceToProvider(providerId, resource);
    
    if (!newResource) {
      return NextResponse.json(
        { success: false, message: '添加资源失败' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: newResource
    }, { status: 201 });
  } catch (error) {
    console.error('添加资源失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: `添加资源失败: ${error instanceof Error ? error.message : String(error)}` 
      },
      { status: 500 }
    );
  }
} 