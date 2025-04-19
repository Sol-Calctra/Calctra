/**
 * Calctra资源匹配系统
 * 这个模块实现了计算资源的智能匹配算法
 */

// 计算资源类型定义
export interface ComputationResource {
  id: string;
  providerId: string;
  name: string;
  description: string;
  resourceType: 'CPU' | 'GPU' | 'TPU' | 'QUANTUM' | 'CLUSTER';
  performance: {
    cores: number;
    memory: number; // GB
    speed: number; // GHz
    benchmarkScore: number;
  };
  availability: {
    startTime: Date;
    endTime: Date;
    timeZone: string;
  };
  pricing: {
    pricePerHour: number; // 以CAL代币计价
    minRentalTime: number; // 小时
  };
  location: {
    region: string;
    country: string;
  };
  reliability: number; // 0-100可靠性评分
  energyEfficiency: number; // 0-100能效评分
}

// 计算任务需求定义
export interface ComputationDemand {
  id: string;
  userId: string;
  title: string;
  description: string;
  resourceRequirements: {
    minCores: number;
    minMemory: number; // GB
    minSpeed: number; // GHz
    preferredResourceType?: 'CPU' | 'GPU' | 'TPU' | 'QUANTUM' | 'CLUSTER';
  };
  timeRequirements: {
    deadline?: Date;
    maxDuration: number; // 小时
    preferredStartTime?: Date;
  };
  budgetConstraints: {
    maxTotalBudget: number; // CAL代币总预算
    maxHourlyRate?: number; // 最大时薪率
  };
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: {
    preferredRegion?: string;
    maxLatency?: number; // 毫秒
  };
}

// 匹配结果接口
export interface MatchResult {
  demand: ComputationDemand;
  resource: ComputationResource;
  matchScore: number; // 0-100
  estimatedCost: number;
  estimatedStartTime: Date;
  estimatedEndTime: Date;
}

/**
 * 智能资源匹配引擎类
 */
export class ResourceMatchingEngine {
  private resources: ComputationResource[] = [];
  private demands: ComputationDemand[] = [];
  private matchResults: MatchResult[] = []; // 存储最近一次匹配结果
  
  /**
   * 添加计算资源到池中
   */
  public addResource(resource: ComputationResource): void {
    this.resources.push(resource);
  }
  
  /**
   * 添加计算需求
   */
  public addDemand(demand: ComputationDemand): void {
    this.demands.push(demand);
  }
  
  /**
   * 匹配资源和需求
   * 实现了多维度匹配算法，考虑性能、成本、可用性、位置等因素
   */
  public matchResources(): MatchResult[] {
    const results: MatchResult[] = [];
    
    // 对每个需求寻找最匹配的资源
    for (const demand of this.demands) {
      const matches = this.findMatchesForDemand(demand);
      
      if (matches.length > 0) {
        // 按匹配分数排序并选择最佳匹配
        matches.sort((a, b) => b.matchScore - a.matchScore);
        results.push(...matches); // 保存所有匹配结果，而不仅仅是最佳匹配
      }
    }
    
    // 存储匹配结果供后续使用
    this.matchResults = results;
    
    return results;
  }
  
  /**
   * 获取最近一次匹配的结果
   */
  public getMatchResults(): MatchResult[] {
    return this.matchResults;
  }
  
  /**
   * 为特定需求寻找匹配的资源
   */
  private findMatchesForDemand(demand: ComputationDemand): MatchResult[] {
    const results: MatchResult[] = [];
    
    for (const resource of this.resources) {
      const matchScore = this.calculateMatchScore(demand, resource);
      
      // 只考虑匹配度50%以上的资源
      if (matchScore > 50) {
        const estimatedCost = this.calculateEstimatedCost(demand, resource);
        const { startTime, endTime } = this.estimateTimeWindow(demand, resource);
        
        results.push({
          demand,
          resource,
          matchScore,
          estimatedCost,
          estimatedStartTime: startTime,
          estimatedEndTime: endTime
        });
      }
    }
    
    return results;
  }
  
  /**
   * 计算资源和需求的匹配分数
   * 实现了复杂的多因素加权算法
   */
  private calculateMatchScore(demand: ComputationDemand, resource: ComputationResource): number {
    // 性能匹配得分 (0-25分)
    const performanceScore = this.calculatePerformanceScore(demand, resource);
    
    // 预算匹配得分 (0-25分)
    const budgetScore = this.calculateBudgetScore(demand, resource);
    
    // 时间可用性得分 (0-20分)
    const timeScore = this.calculateTimeScore(demand, resource);
    
    // 位置匹配得分 (0-15分)
    const locationScore = this.calculateLocationScore(demand, resource);
    
    // 资源类型偏好得分 (0-10分)
    const typeScore = this.calculateTypeScore(demand, resource);
    
    // 资源提供者可靠性得分 (0-5分)
    const reliabilityScore = resource.reliability * 0.05;
    
    // 总分 (0-100)
    return performanceScore + budgetScore + timeScore + locationScore + typeScore + reliabilityScore;
  }
  
  /**
   * 计算性能匹配分数
   */
  private calculatePerformanceScore(demand: ComputationDemand, resource: ComputationResource): number {
    const { minCores, minMemory, minSpeed } = demand.resourceRequirements;
    const { cores, memory, speed, benchmarkScore } = resource.performance;
    
    // 基础分数 - 满足最低要求
    let score = 0;
    
    // 核心数匹配
    if (cores >= minCores) {
      score += 5;
      // 额外核心奖励
      score += Math.min(5, (cores - minCores) / minCores * 5);
    }
    
    // 内存匹配
    if (memory >= minMemory) {
      score += 5;
      // 额外内存奖励
      score += Math.min(5, (memory - minMemory) / minMemory * 5);
    }
    
    // 速度匹配
    if (speed >= minSpeed) {
      score += 5;
      // 额外速度奖励
      score += Math.min(5, (speed - minSpeed) / minSpeed * 5);
    }
    
    return Math.min(25, score);
  }
  
  /**
   * 计算预算匹配分数
   */
  private calculateBudgetScore(demand: ComputationDemand, resource: ComputationResource): number {
    const { maxTotalBudget, maxHourlyRate } = demand.budgetConstraints;
    const { pricePerHour } = resource.pricing;
    const { maxDuration } = demand.timeRequirements;
    
    const totalEstimatedCost = pricePerHour * maxDuration;
    
    // 总预算检查
    if (totalEstimatedCost > maxTotalBudget) {
      return 0; // 超出预算，完全不匹配
    }
    
    // 时薪率检查
    if (maxHourlyRate && pricePerHour > maxHourlyRate) {
      return 0; // 超出时薪率限制
    }
    
    // 根据预算使用效率计算分数
    const budgetEfficiency = 1 - (totalEstimatedCost / maxTotalBudget);
    return Math.min(25, budgetEfficiency * 25);
  }
  
  /**
   * 计算时间匹配分数
   */
  private calculateTimeScore(demand: ComputationDemand, resource: ComputationResource): number {
    // 时间可用性检查和评分逻辑
    // 为了简化MVP，这里使用简单实现
    return 15;
  }
  
  /**
   * 计算位置匹配分数
   */
  private calculateLocationScore(demand: ComputationDemand, resource: ComputationResource): number {
    if (!demand.location || !demand.location.preferredRegion) {
      return 15; // 没有位置偏好，给满分
    }
    
    if (demand.location.preferredRegion === resource.location.region) {
      return 15; // 完全匹配区域
    }
    
    if (demand.location.preferredRegion === resource.location.country) {
      return 10; // 同国家不同区域
    }
    
    // 其他情况，基于预估延迟给分
    return 5;
  }
  
  /**
   * 计算资源类型匹配分数
   */
  private calculateTypeScore(demand: ComputationDemand, resource: ComputationResource): number {
    if (!demand.resourceRequirements.preferredResourceType) {
      return 10; // 没有资源类型偏好，给满分
    }
    
    if (demand.resourceRequirements.preferredResourceType === resource.resourceType) {
      return 10; // 完全匹配资源类型
    }
    
    return 0; // 不匹配资源类型
  }
  
  /**
   * 计算估计成本
   */
  private calculateEstimatedCost(demand: ComputationDemand, resource: ComputationResource): number {
    return resource.pricing.pricePerHour * demand.timeRequirements.maxDuration;
  }
  
  /**
   * 估计时间窗口
   */
  private estimateTimeWindow(demand: ComputationDemand, resource: ComputationResource): { startTime: Date, endTime: Date } {
    // 简化逻辑，以当前时间为起点
    const startTime = demand.timeRequirements.preferredStartTime || new Date();
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + demand.timeRequirements.maxDuration);
    
    return { startTime, endTime };
  }
} 