'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';

// Style components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const BreadcrumbLink = styled(Link)`
  color: #4361ee;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: #555;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2.2rem;
  color: #3a0ca3;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatTitle = styled.h3`
  font-size: 1rem;
  color: #555;
  margin: 0 0 1rem 0;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3a0ca3;
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtonsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  background-color: transparent;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? '#3a0ca3' : '#555'};
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? '#3a0ca3' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    color: #3a0ca3;
  }
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ResourceCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ResourceCardHeader = styled.div`
  padding: 1.2rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const ResourceCardTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ResourceCardContent = styled.div`
  padding: 1.5rem;
`;

const ResourceSpecs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const ResourceSpec = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpecLabel = styled.div`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.2rem;
`;

const SpecValue = styled.div`
  font-weight: bold;
  color: #333;
`;

const ResourceStatus = styled.div<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${props => {
    switch (props.status) {
      case 'ONLINE': return '#2ecc71';
      case 'OFFLINE': return '#e74c3c';
      case 'BUSY': return '#f39c12';
      case 'MAINTENANCE': return '#3498db';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const ResourceCardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background-color: #f1f3f5;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  color: #555;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e9ecef;
    color: #333;
  }
`;

const PrimaryButton = styled.button`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #777;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 1rem;
`;

const DemandCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const DemandTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
`;

const DemandDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DemandDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const DemandDetailLabel = styled.div`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.2rem;
`;

const DemandDetailValue = styled.div`
  font-weight: bold;
  color: #333;
`;

const DemandStatus = styled.div<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${props => {
    switch (props.status) {
      case 'OPEN': return '#4cc9f0';
      case 'IN_PROGRESS': return '#4361ee';
      case 'COMPLETED': return '#2ecc71';
      case 'CANCELLED': return '#e63946';
      default: return '#aaa';
    }
  }};
  color: white;
  margin-bottom: 1rem;
`;

const DemandActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const TransactionCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TransactionInfo = styled.div`
  flex: 1;
`;

const TransactionId = styled.div`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.5rem;
`;

const TransactionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const TransactionMeta = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #555;
`;

const TransactionAmount = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #3a0ca3;
  margin-left: 1rem;
`;

const TransactionStatus = styled.div<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${props => {
    switch (props.status) {
      case 'COMPLETED': return '#2ecc71';
      case 'PENDING': return '#f39c12';
      case 'FAILED': return '#e74c3c';
      default: return '#aaa';
    }
  }};
  color: white;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? '#4361ee' : '#f1f3f5'};
  color: ${props => props.active ? 'white' : '#555'};
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#3a0ca3' : '#e9ecef'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Mock data
// Provider stats
const providerStats = {
  resourceCount: 5,
  activeRentals: 3,
  totalEarnings: 12500,
  availableResources: 2,
  utilizationRate: 60,
  monthlyEarningsChange: 12,
  weeklyCpuUsage: [30, 45, 60, 75, 65, 70, 80]
};

// Resources
const resources = [
  {
    id: 'resource_1',
    name: 'High-Performance GPU Server',
    type: 'GPU',
    status: 'ONLINE',
    price: 25,
    specs: {
      cores: 64,
      memory: 256,
      gpu: 'NVIDIA A100',
      storage: 2000
    },
    uptime: 99.8,
    income: 5400,
    rentalCount: 12
  },
  {
    id: 'resource_2',
    name: 'Multi-Core CPU Cluster',
    type: 'CPU',
    status: 'BUSY',
    price: 15,
    specs: {
      cores: 128,
      memory: 512,
      storage: 4000
    },
    uptime: 99.5,
    income: 4200,
    rentalCount: 18
  },
  {
    id: 'resource_3',
    name: 'Advanced Memory Server',
    type: 'CPU',
    status: 'ONLINE',
    price: 18,
    specs: {
      cores: 32,
      memory: 1024,
      storage: 1000
    },
    uptime: 99.9,
    income: 2900,
    rentalCount: 8
  },
  {
    id: 'resource_4',
    name: 'Storage Server',
    type: 'STORAGE',
    status: 'MAINTENANCE',
    price: 10,
    specs: {
      cores: 16,
      memory: 128,
      storage: 10000
    },
    uptime: 98.7,
    income: 0,
    rentalCount: 0
  },
  {
    id: 'resource_5',
    name: 'Legacy Computation Server',
    type: 'CPU',
    status: 'OFFLINE',
    price: 8,
    specs: {
      cores: 24,
      memory: 128,
      storage: 2000
    },
    uptime: 95.3,
    income: 0,
    rentalCount: 0
  }
];

// Demands
const demands = [
  {
    id: 'demand_1',
    title: 'Large-scale Machine Learning Training Task',
    status: 'IN_PROGRESS',
    budget: 1000,
    duration: 72,
    resourceType: 'GPU',
    deadline: '2025-04-15',
    bids: 5,
    selectedBid: {
      provider: 'Your Bid',
      amount: 950,
      resource: 'High-Performance GPU Server'
    }
  },
  {
    id: 'demand_2',
    title: 'Genomic Data Processing',
    status: 'OPEN',
    budget: 800,
    duration: 48,
    resourceType: 'CPU',
    deadline: '2025-04-10',
    bids: 3,
    selectedBid: null
  },
  {
    id: 'demand_3',
    title: 'Climate Model Simulation',
    status: 'COMPLETED',
    budget: 1200,
    duration: 96,
    resourceType: 'GPU',
    deadline: '2025-03-01',
    bids: 7,
    selectedBid: {
      provider: 'Your Bid',
      amount: 1150,
      resource: 'High-Performance GPU Server'
    }
  }
];

// Transactions
const transactions = [
  {
    id: 'tx_1',
    title: 'Payment for Climate Model Simulation',
    status: 'COMPLETED',
    amount: 1150,
    date: new Date('2025-03-05'),
    counterparty: 'ResearchLab',
    type: 'INCOME'
  },
  {
    id: 'tx_2',
    title: 'Payment for Machine Learning Training',
    status: 'PENDING',
    amount: 950,
    date: new Date('2025-04-01'),
    counterparty: 'AI Solutions',
    type: 'INCOME'
  },
  {
    id: 'tx_3',
    title: 'Platform Fee',
    status: 'COMPLETED',
    amount: 210,
    date: new Date('2025-03-05'),
    counterparty: 'Calctra Platform',
    type: 'EXPENSE'
  },
  {
    id: 'tx_4',
    title: 'Network Usage Fee',
    status: 'COMPLETED',
    amount: 50,
    date: new Date('2025-03-10'),
    counterparty: 'Calctra Platform',
    type: 'EXPENSE'
  }
];

export default function ProviderDashboard() {
  const router = useRouter();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('resources');
  const [loading, setLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'CAL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (loading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <span>Provider Dashboard</span>
      </Breadcrumb>
      
      <DashboardHeader>
        <DashboardTitle>Provider Dashboard</DashboardTitle>
        <Link href="/provider/add-resource">
          <PrimaryButton>Add New Resource</PrimaryButton>
        </Link>
      </DashboardHeader>
      
      <StatsContainer>
        <StatCard>
          <StatTitle>Resources</StatTitle>
          <StatValue>{providerStats.resourceCount}</StatValue>
          <div>{providerStats.availableResources} available</div>
        </StatCard>
        
        <StatCard>
          <StatTitle>Active Rentals</StatTitle>
          <StatValue>{providerStats.activeRentals}</StatValue>
          <div>Utilization: {providerStats.utilizationRate}%</div>
        </StatCard>
        
        <StatCard>
          <StatTitle>Total Earnings</StatTitle>
          <StatValue>{formatCurrency(providerStats.totalEarnings)}</StatValue>
          <StatChange positive={providerStats.monthlyEarningsChange > 0}>
            {providerStats.monthlyEarningsChange > 0 ? '↑' : '↓'} {Math.abs(providerStats.monthlyEarningsChange)}% this month
          </StatChange>
        </StatCard>
      </StatsContainer>
      
      <TabContainer>
        <TabButtonsContainer>
          <TabButton 
            active={activeTab === 'resources'} 
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </TabButton>
          <TabButton 
            active={activeTab === 'demands'} 
            onClick={() => setActiveTab('demands')}
          >
            Demands
          </TabButton>
          <TabButton 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')}
          >
            Transactions
          </TabButton>
        </TabButtonsContainer>
        
        {activeTab === 'resources' && (
          <>
            <ResourceGrid>
              {resources.map(resource => (
                <ResourceCard key={resource.id}>
                  <ResourceCardHeader>
                    <ResourceCardTitle>{resource.name}</ResourceCardTitle>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>{resource.type}</div>
                      <ResourceStatus status={resource.status}>
                        {resource.status === 'ONLINE' ? 'Online' : 
                         resource.status === 'OFFLINE' ? 'Offline' : 
                         resource.status === 'BUSY' ? 'Busy' : 'Maintenance'}
                      </ResourceStatus>
                    </div>
                  </ResourceCardHeader>
                  <ResourceCardContent>
                    <ResourceSpecs>
                      <ResourceSpec>
                        <SpecLabel>Cores</SpecLabel>
                        <SpecValue>{resource.specs.cores}</SpecValue>
                      </ResourceSpec>
                      <ResourceSpec>
                        <SpecLabel>Memory</SpecLabel>
                        <SpecValue>{resource.specs.memory} GB</SpecValue>
                      </ResourceSpec>
                      <ResourceSpec>
                        <SpecLabel>Storage</SpecLabel>
                        <SpecValue>{resource.specs.storage} GB</SpecValue>
                      </ResourceSpec>
                      <ResourceSpec>
                        <SpecLabel>Price</SpecLabel>
                        <SpecValue>{formatCurrency(resource.price)}/hr</SpecValue>
                      </ResourceSpec>
                      <ResourceSpec>
                        <SpecLabel>Uptime</SpecLabel>
                        <SpecValue>{resource.uptime}%</SpecValue>
                      </ResourceSpec>
                      <ResourceSpec>
                        <SpecLabel>Total Income</SpecLabel>
                        <SpecValue>{formatCurrency(resource.income)}</SpecValue>
                      </ResourceSpec>
                    </ResourceSpecs>
                    <ResourceCardActions>
                      <ActionButton>Edit</ActionButton>
                      <ActionButton>
                        {resource.status === 'ONLINE' ? 'Set Offline' : 
                         resource.status === 'OFFLINE' ? 'Set Online' : 
                         resource.status === 'MAINTENANCE' ? 'Complete Maintenance' : 'View Details'}
                      </ActionButton>
                    </ResourceCardActions>
                  </ResourceCardContent>
                </ResourceCard>
              ))}
            </ResourceGrid>
          </>
        )}
        
        {activeTab === 'demands' && (
          <>
            {demands.length > 0 ? (
              demands.map(demand => (
                <DemandCard key={demand.id}>
                  <DemandStatus status={demand.status}>
                    {demand.status === 'OPEN' ? 'Open' : 
                     demand.status === 'IN_PROGRESS' ? 'In Progress' : 
                     demand.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                  </DemandStatus>
                  <DemandTitle>{demand.title}</DemandTitle>
                  <DemandDetails>
                    <DemandDetail>
                      <DemandDetailLabel>Budget</DemandDetailLabel>
                      <DemandDetailValue>{formatCurrency(demand.budget)}</DemandDetailValue>
                    </DemandDetail>
                    <DemandDetail>
                      <DemandDetailLabel>Duration</DemandDetailLabel>
                      <DemandDetailValue>{demand.duration} hours</DemandDetailValue>
                    </DemandDetail>
                    <DemandDetail>
                      <DemandDetailLabel>Resource Type</DemandDetailLabel>
                      <DemandDetailValue>{demand.resourceType}</DemandDetailValue>
                    </DemandDetail>
                    <DemandDetail>
                      <DemandDetailLabel>Deadline</DemandDetailLabel>
                      <DemandDetailValue>{demand.deadline}</DemandDetailValue>
                    </DemandDetail>
                  </DemandDetails>
                  
                  {demand.selectedBid && (
                    <div style={{ marginBottom: '1rem' }}>
                      <DemandDetailLabel>Your Bid</DemandDetailLabel>
                      <div>{demand.selectedBid.resource} - {formatCurrency(demand.selectedBid.amount)}</div>
                    </div>
                  )}
                  
                  <DemandActions>
                    <Link href={`/marketplace/demand/${demand.id}`}>
                      <ActionButton>View Details</ActionButton>
                    </Link>
                    {demand.status === 'IN_PROGRESS' && (
                      <PrimaryButton>View Progress</PrimaryButton>
                    )}
                  </DemandActions>
                </DemandCard>
              ))
            ) : (
              <EmptyState>
                <EmptyStateTitle>No Demands Found</EmptyStateTitle>
                <div>You haven't bid on any computation demands yet.</div>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link href="/marketplace">
                    <PrimaryButton>Explore Marketplace</PrimaryButton>
                  </Link>
                </div>
              </EmptyState>
            )}
          </>
        )}
        
        {activeTab === 'transactions' && (
          <>
            {transactions.map(transaction => (
              <TransactionCard key={transaction.id}>
                <TransactionInfo>
                  <TransactionId>{transaction.id}</TransactionId>
                  <TransactionTitle>{transaction.title}</TransactionTitle>
                  <TransactionMeta>
                    <div>{formatDate(transaction.date)}</div>
                    <div>{transaction.counterparty}</div>
                    <TransactionStatus status={transaction.status}>
                      {transaction.status === 'COMPLETED' ? 'Completed' : 
                       transaction.status === 'PENDING' ? 'Pending' : 'Failed'}
                    </TransactionStatus>
                  </TransactionMeta>
                </TransactionInfo>
                <TransactionAmount style={{ color: transaction.type === 'INCOME' ? '#2ecc71' : '#e74c3c' }}>
                  {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </TransactionAmount>
              </TransactionCard>
            ))}
            
            <Pagination>
              <PageButton disabled>&lt;</PageButton>
              <PageButton active>1</PageButton>
              <PageButton>2</PageButton>
              <PageButton>3</PageButton>
              <PageButton>&gt;</PageButton>
            </Pagination>
          </>
        )}
      </TabContainer>
    </Container>
  );
} 