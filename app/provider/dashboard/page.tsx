'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #3a0ca3;
`;

const Button = styled.button`
  background-color: #4361ee;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #3a0ca3;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #3a0ca3;
  margin: 0;
`;

const CardBody = styled.div`
  margin-bottom: 1rem;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const StatItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #4361ee;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #555;
  font-size: 0.9rem;
`;

const ResourceList = styled.div`
  margin-top: 1rem;
`;

const ResourceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResourceInfo = styled.div`
  flex: 1;
`;

const ResourceName = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const ResourceType = styled.span`
  display: inline-block;
  background-color: #4361ee;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 0.5rem;
`;

const ResourceDetails = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #555;
  margin-top: 0.5rem;
`;

const ResourceDetail = styled.div``;

const ResourceActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled.button`
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div``;

const TransactionType = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const TransactionDate = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const TransactionAmount = styled.div`
  font-weight: bold;
  color: ${(props: { positive: boolean }) => props.positive ? '#2ecc71' : '#e74c3c'};
`;

const ChartCard = styled(Card)`
  grid-column: 1 / -1;
`;

const Chart = styled.div`
  height: 300px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #555;
`;

const NoResources = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
`;

// Mock data
const mockProviderData = {
  id: 'provider_123',
  name: 'High-Performance Computing Center',
  totalEarnings: 1250,
  activeResources: 3,
  uptime: 98.5,
  utilizationRate: 76.2
};

const mockResources = [
  {
    id: 'resource_1',
    name: 'High-Performance Computing Server',
    resourceType: 'CPU',
    cores: 64,
    memory: 512,
    speed: 3.5,
    status: 'active',
    earnings: 850,
    utilizationRate: 85
  },
  {
    id: 'resource_2',
    name: 'GPU Computing Cluster',
    resourceType: 'GPU',
    cores: 32,
    memory: 256,
    speed: 3.0,
    status: 'active',
    earnings: 320,
    utilizationRate: 72
  },
  {
    id: 'resource_3',
    name: 'TPU Computing Node',
    resourceType: 'TPU',
    cores: 16,
    memory: 128,
    speed: 2.8,
    status: 'inactive',
    earnings: 80,
    utilizationRate: 24
  }
];

const mockTransactions = [
  {
    id: 'tx_1',
    type: 'PAYMENT',
    date: new Date('2025-03-15'),
    amount: 125,
    demandId: 'demand_1'
  },
  {
    id: 'tx_2',
    type: 'PAYMENT',
    date: new Date('2025-03-12'),
    amount: 95,
    demandId: 'demand_2'
  },
  {
    id: 'tx_3',
    type: 'FEE',
    date: new Date('2025-03-10'),
    amount: -12,
    demandId: null
  },
  {
    id: 'tx_4',
    type: 'PAYMENT',
    date: new Date('2025-03-08'),
    amount: 210,
    demandId: 'demand_3'
  }
];

export default function ProviderDashboard() {
  const [provider, setProvider] = useState(null);
  const [resources, setResources] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 模拟API请求
  useEffect(() => {
    const fetchDashboardData = async () => {
      // 实际项目中这里会调用API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
      
      setProvider(mockProviderData);
      setResources(mockResources);
      setTransactions(mockTransactions);
      setLoading(false);
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) {
    return (
      <Container>
        <div>加载中...</div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>Provider Dashboard</Title>
        <Link href="/provider/add-resource">
          <Button>Add New Resource</Button>
        </Link>
      </Header>
      
      <DashboardGrid>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardBody>
            <StatGrid>
              <StatItem>
                <StatValue>{provider.totalEarnings} CAL</StatValue>
                <StatLabel>Total Earnings</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{provider.activeResources}</StatValue>
                <StatLabel>Active Resources</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{provider.uptime}%</StatValue>
                <StatLabel>Uptime</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{provider.utilizationRate}%</StatValue>
                <StatLabel>Average Utilization</StatLabel>
              </StatItem>
            </StatGrid>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <Link href="/provider/transactions">
              <SmallButton>View All</SmallButton>
            </Link>
          </CardHeader>
          <CardBody>
            {transactions.slice(0, 3).map(transaction => (
              <TransactionItem key={transaction.id}>
                <TransactionInfo>
                  <TransactionType>{transaction.type === 'PAYMENT' ? 'Payment Income' : 'Platform Fee'}</TransactionType>
                  <TransactionDate>{transaction.date.toLocaleDateString()}</TransactionDate>
                </TransactionInfo>
                <TransactionAmount positive={transaction.amount > 0}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} CAL
                </TransactionAmount>
              </TransactionItem>
            ))}
          </CardBody>
        </Card>
        
        <ChartCard>
          <CardHeader>
            <CardTitle>Resource Usage Statistics</CardTitle>
            <SmallButton>Last 7 Days</SmallButton>
          </CardHeader>
          <CardBody>
            <Chart>
              In the actual project, a resource usage chart would be displayed here
            </Chart>
          </CardBody>
        </ChartCard>
        
        <Card style={{ gridColumn: '1 / -1' }}>
          <CardHeader>
            <CardTitle>My Resources</CardTitle>
          </CardHeader>
          <CardBody>
            {resources.length > 0 ? (
              <ResourceList>
                {resources.map(resource => (
                  <ResourceItem key={resource.id}>
                    <ResourceInfo>
                      <ResourceName>{resource.name}</ResourceName>
                      <div>
                        <ResourceType>{resource.resourceType}</ResourceType>
                        <span style={{ 
                          color: resource.status === 'active' ? '#2ecc71' : '#e74c3c',
                          fontSize: '0.9rem'
                        }}>
                          {resource.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <ResourceDetails>
                        <ResourceDetail>Cores: {resource.cores}</ResourceDetail>
                        <ResourceDetail>Memory: {resource.memory}GB</ResourceDetail>
                        <ResourceDetail>Utilization: {resource.utilizationRate}%</ResourceDetail>
                        <ResourceDetail>Earnings: {resource.earnings} CAL</ResourceDetail>
                      </ResourceDetails>
                    </ResourceInfo>
                    <ResourceActions>
                      <Link href={`/provider/resources/${resource.id}`}>
                        <SmallButton>Details</SmallButton>
                      </Link>
                      <SmallButton>
                        {resource.status === 'active' ? 'Deactivate' : 'Activate'}
                      </SmallButton>
                    </ResourceActions>
                  </ResourceItem>
                ))}
              </ResourceList>
            ) : (
              <NoResources>
                <p>You have not added any computing resources</p>
                <Link href="/provider/add-resource">
                  <Button>Add Resource</Button>
                </Link>
              </NoResources>
            )}
          </CardBody>
        </Card>
      </DashboardGrid>
    </Container>
  );
} 