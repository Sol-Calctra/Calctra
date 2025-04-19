import { ComputationDemand } from './resourceMatching';

/**
 * 需求方接口
 */
export interface DemandUser {
  id: string;
  name: string;
  walletAddress: string;
  email: string;
  organization?: string;
  researchField?: string;
  joinedDate: Date;
  demands: ComputationDemand[];
}

/**
 * 需求状态
 */
export type DemandStatus = 'DRAFT' | 'PUBLISHED' | 'MATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

/**
 * 扩展计算需求接口，添加状态信息
 */
export interface ManagedDemand extends ComputationDemand {
  status: DemandStatus;
  createdAt: Date;
  updatedAt: Date;
  matchedResourceId?: string;
  completedAt?: Date;
  result?: {
    success: boolean;
    message?: string;
    outputLocation?: string;
  };
}

/**
 * 需求管理系统
 * 负责管理计算需求的创建、发布和状态跟踪
 */
export class DemandManager {
  private users: Map<string, DemandUser> = new Map();
  private demands: Map<string, ManagedDemand> = new Map();
  
  /**
   * 注册新用户
   */
  public registerUser(user: Omit<DemandUser, 'id' | 'joinedDate' | 'demands'>): DemandUser {
    const newUser: DemandUser = {
      id: this.generateUserId(),
      joinedDate: new Date(),
      demands: [],
      ...user
    };
    
    this.users.set(newUser.id, newUser);
    return newUser;
  }
  
  /**
   * 创建新的计算需求
   */
  public createDemand(
    userId: string,
    demand: Omit<ComputationDemand, 'id' | 'userId'>
  ): ManagedDemand | null {
    const user = this.users.get(userId);
    
    if (!user) {
      return null;
    }
    
    const now = new Date();
    const newDemand: ManagedDemand = {
      id: this.generateDemandId(),
      userId,
      status: 'DRAFT',
      createdAt: now,
      updatedAt: now,
      ...demand
    };
    
    this.demands.set(newDemand.id, newDemand);
    user.demands.push(newDemand);
    
    return newDemand;
  }
  
  /**
   * 发布计算需求
   */
  public publishDemand(demandId: string): ManagedDemand | null {
    const demand = this.demands.get(demandId);
    
    if (!demand || demand.status !== 'DRAFT') {
      return null;
    }
    
    demand.status = 'PUBLISHED';
    demand.updatedAt = new Date();
    
    return demand;
  }
  
  /**
   * 更新需求状态
   */
  public updateDemandStatus(demandId: string, status: DemandStatus, additionalInfo?: Partial<ManagedDemand>): ManagedDemand | null {
    const demand = this.demands.get(demandId);
    
    if (!demand) {
      return null;
    }
    
    demand.status = status;
    demand.updatedAt = new Date();
    
    if (status === 'COMPLETED') {
      demand.completedAt = new Date();
    }
    
    // 添加其他信息
    if (additionalInfo) {
      Object.assign(demand, additionalInfo);
    }
    
    return demand;
  }
  
  /**
   * 匹配需求与资源
   */
  public matchDemandWithResource(demandId: string, resourceId: string): ManagedDemand | null {
    const demand = this.demands.get(demandId);
    
    if (!demand || demand.status !== 'PUBLISHED') {
      return null;
    }
    
    demand.status = 'MATCHED';
    demand.matchedResourceId = resourceId;
    demand.updatedAt = new Date();
    
    return demand;
  }
  
  /**
   * 标记需求为进行中
   */
  public startDemandExecution(demandId: string): ManagedDemand | null {
    const demand = this.demands.get(demandId);
    
    if (!demand || demand.status !== 'MATCHED') {
      return null;
    }
    
    demand.status = 'IN_PROGRESS';
    demand.updatedAt = new Date();
    
    return demand;
  }
  
  /**
   * 完成需求执行
   */
  public completeDemand(demandId: string, success: boolean, message?: string, outputLocation?: string): ManagedDemand | null {
    const demand = this.demands.get(demandId);
    
    if (!demand || demand.status !== 'IN_PROGRESS') {
      return null;
    }
    
    demand.status = 'COMPLETED';
    demand.completedAt = new Date();
    demand.updatedAt = new Date();
    demand.result = {
      success,
      message,
      outputLocation
    };
    
    return demand;
  }
  
  /**
   * 取消需求
   */
  public cancelDemand(demandId: string, reason?: string): ManagedDemand | null {
    const demand = this.demands.get(demandId);
    
    if (!demand || ['COMPLETED', 'CANCELLED'].includes(demand.status)) {
      return null;
    }
    
    demand.status = 'CANCELLED';
    demand.updatedAt = new Date();
    demand.result = {
      success: false,
      message: reason || '需求已取消'
    };
    
    return demand;
  }
  
  /**
   * 获取用户的所有需求
   */
  public getUserDemands(userId: string): ManagedDemand[] {
    const user = this.users.get(userId);
    
    if (!user) {
      return [];
    }
    
    return user.demands as ManagedDemand[];
  }
  
  /**
   * 获取所有已发布的需求
   */
  public getPublishedDemands(): ManagedDemand[] {
    return Array.from(this.demands.values())
      .filter(demand => demand.status === 'PUBLISHED');
  }
  
  /**
   * 获取特定需求
   */
  public getDemand(demandId: string): ManagedDemand | undefined {
    return this.demands.get(demandId);
  }
  
  /**
   * 生成唯一的用户ID
   */
  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  /**
   * 生成唯一的需求ID
   */
  private generateDemandId(): string {
    return `demand_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
} 