import { ComputationResource } from './resourceMatching';

/**
 * 资源提供者接口
 */
export interface ResourceProvider {
  id: string;
  name: string;
  description: string;
  walletAddress: string;
  contactEmail: string;
  website?: string;
  country: string;
  organizationType: 'INDIVIDUAL' | 'ACADEMIC' | 'CORPORATE' | 'NONPROFIT';
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  reputationScore: number; // 0-100
  joinedDate: Date;
  resources: ComputationResource[];
}

/**
 * 提供者验证结果
 */
export interface VerificationResult {
  providerId: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  message?: string;
  verifiedAt?: Date;
}

/**
 * 资源提供者管理器类
 * 负责管理计算资源提供者的注册、验证和评价
 */
export class ProviderManager {
  private providers: Map<string, ResourceProvider> = new Map();
  
  /**
   * 注册新的资源提供者
   */
  public registerProvider(provider: Omit<ResourceProvider, 'id' | 'verificationStatus' | 'reputationScore' | 'joinedDate' | 'resources'>): ResourceProvider {
    const newProvider: ResourceProvider = {
      id: this.generateProviderId(),
      verificationStatus: 'PENDING',
      reputationScore: 50, // 初始中等信誉度
      joinedDate: new Date(),
      resources: [],
      ...provider
    };
    
    this.providers.set(newProvider.id, newProvider);
    return newProvider;
  }
  
  /**
   * 添加计算资源到提供者
   */
  public addResourceToProvider(providerId: string, resource: Omit<ComputationResource, 'id' | 'providerId'>): ComputationResource | null {
    const provider = this.providers.get(providerId);
    
    if (!provider) {
      return null;
    }
    
    const newResource: ComputationResource = {
      id: this.generateResourceId(),
      providerId,
      ...resource
    };
    
    provider.resources.push(newResource);
    return newResource;
  }
  
  /**
   * 验证资源提供者
   */
  public verifyProvider(providerId: string, status: 'VERIFIED' | 'REJECTED', message?: string): VerificationResult {
    const provider = this.providers.get(providerId);
    
    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }
    
    provider.verificationStatus = status;
    
    const result: VerificationResult = {
      providerId,
      status,
      message,
      verifiedAt: new Date()
    };
    
    return result;
  }
  
  /**
   * 获取提供者信息
   */
  public getProvider(providerId: string): ResourceProvider | undefined {
    return this.providers.get(providerId);
  }
  
  /**
   * 列出所有已验证的提供者
   */
  public listVerifiedProviders(): ResourceProvider[] {
    return Array.from(this.providers.values())
      .filter(provider => provider.verificationStatus === 'VERIFIED');
  }
  
  /**
   * 列出提供者的所有资源
   */
  public listProviderResources(providerId: string): ComputationResource[] {
    const provider = this.providers.get(providerId);
    
    if (!provider) {
      return [];
    }
    
    return provider.resources;
  }
  
  /**
   * 更新提供者声誉分数
   */
  public updateProviderReputation(providerId: string, newScore: number): boolean {
    const provider = this.providers.get(providerId);
    
    if (!provider) {
      return false;
    }
    
    // 确保分数在0-100范围内
    provider.reputationScore = Math.max(0, Math.min(100, newScore));
    return true;
  }
  
  /**
   * 生成唯一的提供者ID
   */
  private generateProviderId(): string {
    return `provider_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * 生成唯一的资源ID
   */
  private generateResourceId(): string {
    return `resource_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
} 