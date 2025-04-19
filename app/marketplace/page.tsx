'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

// Styled components
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

const CreateButton = styled.a`
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0060df;
  }
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
`;

interface TabProps {
  active: boolean;
}

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${(props: TabProps) => props.active ? '#0070f3' : 'transparent'};
  color: ${(props: TabProps) => props.active ? '#0070f3' : '#666'};
  font-weight: ${(props: TabProps) => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #0070f3;
  }
`;

const FiltersContainer = styled.div`
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: white;
`;

const ResourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ResourceCard = styled.div`
  border: 1px solid #eaeaea;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ResourceCardHeader = styled.div`
  padding: 1rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eaeaea;
`;

const ResourceName = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
`;

const ResourceType = styled.span`
  display: inline-block;
  background-color: #e6f7ff;
  color: #0070f3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

const ResourceCardBody = styled.div`
  padding: 1rem;
`;

const ResourceDetail = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #666;
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  font-weight: 500;
  color: #333;
  font-size: 0.875rem;
`;

const ResourceCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-top: 1px solid #eaeaea;
`;

const Price = styled.div`
  font-weight: 600;
  color: #0070f3;
  font-size: 1.125rem;
`;

const ViewButton = styled.a`
  background-color: #0070f3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0060df;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.25rem;
`;

// Mock data for resources
interface Resource {
  id: string;
  name: string;
  type: 'cpu' | 'gpu' | 'storage' | 'hybrid';
  cores: number;
  memory: number;
  storage: number;
  region: string;
  location: string;
  price: number;
  availability: string;
}

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'High-Performance Computing Node',
    type: 'cpu',
    cores: 64,
    memory: 256,
    storage: 2000,
    region: 'North America',
    location: 'United States - East',
    price: 2.50,
    availability: 'Immediate'
  },
  {
    id: '2',
    name: 'GPU Compute Cluster',
    type: 'gpu',
    cores: 32,
    memory: 128,
    storage: 1000,
    region: 'Europe',
    location: 'Germany - Frankfurt',
    price: 4.75,
    availability: 'Immediate'
  },
  {
    id: '3',
    name: 'Storage Optimized Server',
    type: 'storage',
    cores: 16,
    memory: 64,
    storage: 10000,
    region: 'Asia Pacific',
    location: 'Singapore',
    price: 1.95,
    availability: '48 hours'
  },
  {
    id: '4',
    name: 'Balanced Computation Node',
    type: 'hybrid',
    cores: 48,
    memory: 192,
    storage: 4000,
    region: 'North America',
    location: 'Canada - Toronto',
    price: 3.25,
    availability: 'Immediate'
  },
  {
    id: '5',
    name: 'Economy Computing Instance',
    type: 'cpu',
    cores: 8,
    memory: 32,
    storage: 500,
    region: 'South America',
    location: 'Brazil - São Paulo',
    price: 0.95,
    availability: '24 hours'
  },
  {
    id: '6',
    name: 'High Memory Computing',
    type: 'cpu',
    cores: 24,
    memory: 384,
    storage: 1000,
    region: 'Europe',
    location: 'UK - London',
    price: 2.85,
    availability: 'Immediate'
  }
];

// Interface for filter state
interface Filters {
  minCores: string;
  minMemory: string;
  resourceType: string;
  maxPrice: string;
  region: string;
}

export default function Marketplace() {
  const [activeTab, setActiveTab] = React.useState('resources');
  const [isLoading, setIsLoading] = React.useState(false);
  const [filters, setFilters] = React.useState<Filters>({
    minCores: '',
    minMemory: '',
    resourceType: '',
    maxPrice: '',
    region: ''
  });
  
  // Apply filters to resources
  const filteredResources = React.useMemo(() => {
    return mockResources.filter(resource => {
      if (filters.minCores && resource.cores < parseInt(filters.minCores)) {
        return false;
      }
      if (filters.minMemory && resource.memory < parseInt(filters.minMemory)) {
        return false;
      }
      if (filters.resourceType && resource.type !== filters.resourceType) {
        return false;
      }
      if (filters.maxPrice && resource.price > parseFloat(filters.maxPrice)) {
        return false;
      }
      if (filters.region && !resource.region.includes(filters.region)) {
        return false;
      }
      return true;
    });
  }, [filters, mockResources]);
  
  // Handle filter changes
  const handleFilterChange = (event: any) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      <Header>
        <Title>Resource Marketplace</Title>
        <CreateButton as={Link} href={activeTab === 'resources' ? '/provider/add-resource' : '/marketplace/create-demand'}>
          {activeTab === 'resources' ? 'Add Resource' : 'Create Demand'}
        </CreateButton>
      </Header>
      
      <Tabs>
        <Tab 
          active={activeTab === 'resources'} 
          onClick={() => setActiveTab('resources')}
        >
          Available Resources
        </Tab>
        <Tab 
          active={activeTab === 'demands'} 
          onClick={() => setActiveTab('demands')}
        >
          Computation Demands
        </Tab>
      </Tabs>
      
      {activeTab === 'resources' && (
        <>
          <FiltersContainer>
            <FilterGroup>
              <Label htmlFor="minCores">Min. Cores</Label>
              <Input 
                type="number" 
                id="minCores" 
                name="minCores" 
                placeholder="e.g., 8" 
                value={filters.minCores}
                onChange={handleFilterChange}
              />
            </FilterGroup>
            
            <FilterGroup>
              <Label htmlFor="minMemory">Min. Memory (GB)</Label>
              <Input 
                type="number" 
                id="minMemory" 
                name="minMemory" 
                placeholder="e.g., 16" 
                value={filters.minMemory}
                onChange={handleFilterChange}
              />
            </FilterGroup>
            
            <FilterGroup>
              <Label htmlFor="resourceType">Resource Type</Label>
              <Select 
                id="resourceType" 
                name="resourceType" 
                value={filters.resourceType}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="cpu">CPU Compute</option>
                <option value="gpu">GPU Compute</option>
                <option value="storage">Storage</option>
                <option value="hybrid">Hybrid</option>
              </Select>
            </FilterGroup>
            
            <FilterGroup>
              <Label htmlFor="maxPrice">Max. Price/Hour ($)</Label>
              <Input 
                type="number" 
                id="maxPrice" 
                name="maxPrice" 
                placeholder="e.g., 5.00" 
                step="0.01"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </FilterGroup>
            
            <FilterGroup>
              <Label htmlFor="region">Region</Label>
              <Select 
                id="region" 
                name="region" 
                value={filters.region}
                onChange={handleFilterChange}
              >
                <option value="">All Regions</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia Pacific">Asia Pacific</option>
                <option value="South America">South America</option>
                <option value="Africa">Africa</option>
              </Select>
            </FilterGroup>
          </FiltersContainer>
          
          {isLoading ? (
            <NoResults>Loading resources...</NoResults>
          ) : filteredResources.length === 0 ? (
            <NoResults>No resources match your filters. Try adjusting your criteria.</NoResults>
          ) : (
            <ResourceGrid>
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id}>
                  <ResourceCardHeader>
                    <ResourceName>{resource.name}</ResourceName>
                    <ResourceType>{resource.type.toUpperCase()}</ResourceType>
                  </ResourceCardHeader>
                  
                  <ResourceCardBody>
                    <ResourceDetail>
                      <DetailLabel>CPU Cores</DetailLabel>
                      <DetailValue>{resource.cores}</DetailValue>
                    </ResourceDetail>
                    
                    <ResourceDetail>
                      <DetailLabel>Memory</DetailLabel>
                      <DetailValue>{resource.memory} GB</DetailValue>
                    </ResourceDetail>
                    
                    <ResourceDetail>
                      <DetailLabel>Storage</DetailLabel>
                      <DetailValue>{resource.storage} GB</DetailValue>
                    </ResourceDetail>
                    
                    <ResourceDetail>
                      <DetailLabel>Location</DetailLabel>
                      <DetailValue>{resource.location}</DetailValue>
                    </ResourceDetail>
                    
                    <ResourceDetail>
                      <DetailLabel>Availability</DetailLabel>
                      <DetailValue>{resource.availability}</DetailValue>
                    </ResourceDetail>
                  </ResourceCardBody>
                  
                  <ResourceCardFooter>
                    <Price>${resource.price.toFixed(2)}/hour</Price>
                    <ViewButton as={Link} href={`/marketplace/resource/${resource.id}`}>
                      View Details
                    </ViewButton>
                  </ResourceCardFooter>
                </ResourceCard>
              ))}
            </ResourceGrid>
          )}
        </>
      )}
      
      {activeTab === 'demands' && (
        <NoResults>
          Demand listings coming soon. <Link href="/marketplace/create-demand">Create a new demand</Link>
        </NoResults>
      )}
    </Container>
  );
} 