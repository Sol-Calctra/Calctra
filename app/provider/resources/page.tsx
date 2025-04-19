'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const AddButton = styled.button`
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3a70b2;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const ResourcesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const ResourceCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ResourceHeader = styled.div`
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
`;

const ResourceName = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const ResourceType = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e1f0ff;
  color: #4a90e2;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ResourceBody = styled.div`
  padding: 1.5rem;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpecLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const SpecValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #333;
`;

// Styled Components with props
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${(props: StatusBadgeProps) => {
    switch (props.status) {
      case 'active':
        return '#e3f9e5';
      case 'inactive':
        return '#f9e1e0';
      case 'maintenance':
        return '#fff8e0';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${(props: StatusBadgeProps) => {
    switch (props.status) {
      case 'active':
        return '#2da53c';
      case 'inactive':
        return '#e53935';
      case 'maintenance':
        return '#f9a825';
      default:
        return '#757575';
    }
  }};
  margin-bottom: 1rem;
`;

const ResourceActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

interface ActionButtonProps {
  variant?: string;
}

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  background-color: ${(props: ActionButtonProps) => {
    switch (props.variant) {
      case 'primary':
        return '#4a90e2';
      case 'success':
        return '#2da53c';
      case 'danger':
        return '#e53935';
      case 'warning':
        return '#f9a825';
      default:
        return '#f5f5f5';
    }
  }};
  
  color: ${(props: ActionButtonProps) => {
    switch (props.variant) {
      case 'primary':
      case 'success':
      case 'danger':
      case 'warning':
        return 'white';
      default:
        return '#333';
    }
  }};
  
  border: ${(props: ActionButtonProps) => {
    return props.variant ? 'none' : '1px solid #ddd';
  }};
  
  &:hover {
    background-color: ${(props: ActionButtonProps) => {
      switch (props.variant) {
        case 'primary':
          return '#3a70b2';
        case 'success':
          return '#1e8e2c';
        case 'danger':
          return '#c62828';
        case 'warning':
          return '#f57f17';
        default:
          return '#e0e0e0';
      }
    }};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 2rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

interface PageButtonProps {
  current?: boolean;
}

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.25rem;
  border: 1px solid ${(props: PageButtonProps) => (props.current ? '#4a90e2' : '#ddd')};
  background-color: ${(props: PageButtonProps) => (props.current ? '#4a90e2' : 'white')};
  color: ${(props: PageButtonProps) => (props.current ? 'white' : '#333')};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${(props: PageButtonProps) => (props.current ? '#3a70b2' : '#f5f5f5')};
  }
  
  &:disabled {
    background-color: #f5f5f5;
    color: #bbb;
    cursor: not-allowed;
  }
`;

// Mock Data
const mockResources = [
  {
    id: 'resource-1',
    name: 'High-Performance Computing Cluster',
    type: 'HPC',
    description: 'Powerful computing cluster optimized for parallel processing',
    specs: {
      cores: 64,
      memory: '256 GB',
      storage: '4 TB SSD',
      benchmark: 9850
    },
    status: 'active',
    earnings: '$1,245.78',
    utilization: '78%',
    region: 'North America',
    country: 'United States'
  },
  {
    id: 'resource-2',
    name: 'GPU Research Station',
    type: 'GPU',
    description: 'Dedicated GPU workstation with NVIDIA A100 GPUs',
    specs: {
      cores: 24,
      memory: '128 GB',
      storage: '2 TB SSD',
      benchmark: 9200,
      gpus: '2x NVIDIA A100'
    },
    status: 'active',
    earnings: '$2,145.30',
    utilization: '92%',
    region: 'North America',
    country: 'Canada'
  },
  {
    id: 'resource-3',
    name: 'Quantum Simulation Server',
    type: 'Quantum',
    description: 'Specialized server for quantum algorithm simulations',
    specs: {
      cores: 32,
      memory: '192 GB',
      storage: '1 TB SSD',
      benchmark: 8750
    },
    status: 'maintenance',
    earnings: '$567.45',
    utilization: '25%',
    region: 'Europe',
    country: 'Germany'
  },
  {
    id: 'resource-4',
    name: 'Edge Computing Node',
    type: 'Edge',
    description: 'Low-latency edge computing server with optimized network connectivity',
    specs: {
      cores: 16,
      memory: '64 GB',
      storage: '1 TB SSD',
      benchmark: 7200
    },
    status: 'inactive',
    earnings: '$0.00',
    utilization: '0%',
    region: 'Asia',
    country: 'Singapore'
  },
  {
    id: 'resource-5',
    name: 'Big Data Processing Cluster',
    type: 'Data',
    description: 'Specialized cluster for big data analytics and machine learning',
    specs: {
      cores: 48,
      memory: '384 GB',
      storage: '8 TB SSD',
      benchmark: 8900
    },
    status: 'active',
    earnings: '$1,875.22',
    utilization: '85%',
    region: 'South America',
    country: 'Brazil'
  }
];

const ProviderResources = () => {
  const router = useRouter();
  const [resources, setResources] = useState(mockResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 6;

  // Handle resource status toggle
  const handleStatusToggle = (resourceId: string, newStatus: string) => {
    setResources(prevResources =>
      prevResources.map(resource =>
        resource.id === resourceId ? { ...resource, status: newStatus } : resource
      )
    );
  };

  // Handle resource deletion
  const handleDeleteResource = (resourceId: string) => {
    if (confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      setResources(prevResources => prevResources.filter(resource => resource.id !== resourceId));
    }
  };

  // Filter resources based on search query and filters
  const filteredResources = resources.filter(resource => {
    // Apply search filter
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
    
    // Apply type filter
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate pagination
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);
  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage);

  // Get unique resource types for filter
  const resourceTypes = Array.from(new Set(resources.map(resource => resource.type)));

  return (
    <Container>
      <Header>
        <Title>My Computing Resources</Title>
        <AddButton onClick={() => router.push('/provider/add-resource')}>
          Add New Resource
        </AddButton>
      </Header>

      {/* Search and Filters */}
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="Search resources by name or description" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      <FilterContainer>
        <FilterSelect 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </FilterSelect>

        <FilterSelect 
          value={typeFilter} 
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          {resourceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </FilterSelect>
      </FilterContainer>

      {/* Resource Cards */}
      {currentResources.length > 0 ? (
        <>
          <ResourcesGrid>
            {currentResources.map(resource => (
              <ResourceCard key={resource.id}>
                <ResourceHeader>
                  <ResourceName>{resource.name}</ResourceName>
                  <ResourceType>{resource.type}</ResourceType>
                </ResourceHeader>
                <ResourceBody>
                  <StatusBadge status={resource.status}>
                    {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                  </StatusBadge>
                  <p>{resource.description}</p>
                  <SpecsGrid>
                    <SpecItem>
                      <SpecLabel>Cores</SpecLabel>
                      <SpecValue>{resource.specs.cores}</SpecValue>
                    </SpecItem>
                    <SpecItem>
                      <SpecLabel>Memory</SpecLabel>
                      <SpecValue>{resource.specs.memory}</SpecValue>
                    </SpecItem>
                    <SpecItem>
                      <SpecLabel>Benchmark</SpecLabel>
                      <SpecValue>{resource.specs.benchmark}</SpecValue>
                    </SpecItem>
                    <SpecItem>
                      <SpecLabel>Utilization</SpecLabel>
                      <SpecValue>{resource.utilization}</SpecValue>
                    </SpecItem>
                  </SpecsGrid>
                  <div>
                    <SpecLabel>Earnings</SpecLabel>
                    <SpecValue style={{ fontSize: '1.25rem', color: '#2da53c' }}>{resource.earnings}</SpecValue>
                  </div>
                  <ResourceActions>
                    <Link href={`/provider/resources/${resource.id}`} passHref>
                      <ActionButton variant="primary">View Details</ActionButton>
                    </Link>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {resource.status === 'active' ? (
                        <ActionButton 
                          variant="warning"
                          onClick={() => handleStatusToggle(resource.id, 'maintenance')}
                        >
                          Set Maintenance
                        </ActionButton>
                      ) : resource.status === 'inactive' ? (
                        <ActionButton 
                          variant="success"
                          onClick={() => handleStatusToggle(resource.id, 'active')}
                        >
                          Activate
                        </ActionButton>
                      ) : (
                        <ActionButton 
                          variant="success"
                          onClick={() => handleStatusToggle(resource.id, 'active')}
                        >
                          Finish Maintenance
                        </ActionButton>
                      )}
                      <ActionButton 
                        variant="danger"
                        onClick={() => handleDeleteResource(resource.id)}
                      >
                        Delete
                      </ActionButton>
                    </div>
                  </ResourceActions>
                </ResourceBody>
              </ResourceCard>
            ))}
          </ResourcesGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  current={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No resources found</EmptyStateTitle>
          <EmptyStateText>
            {resources.length === 0 
              ? "You haven't added any computing resources yet."
              : "No resources match your current filters."
            }
          </EmptyStateText>
          {resources.length === 0 && (
            <AddButton onClick={() => router.push('/provider/add-resource')}>
              Add Your First Resource
            </AddButton>
          )}
        </EmptyState>
      )}
    </Container>
  );
};

export default ProviderResources;