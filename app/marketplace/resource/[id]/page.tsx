'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  color: #3498db;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: #999;
`;

const ResourceHeader = styled.div`
  margin-bottom: 2rem;
`;

const ResourceTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ResourceType = styled.span`
  display: inline-block;
  background-color: #edf2f7;
  color: #4a5568;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const ResourceDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailsCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const RentalCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SpecItem = styled.div`
  margin-bottom: 1rem;
`;

const SpecLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const SpecValue = styled.div`
  font-weight: 500;
  color: #333;
`;

const ProviderInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProviderAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 1rem;
`;

const ProviderName = styled.div`
  font-weight: 500;
`;

const ProviderRating = styled.div`
  color: #f39c12;
  margin-top: 0.25rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  color: #666;
`;

const DetailValue = styled.div`
  font-weight: 500;
  color: #333;
`;

const PriceSection = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eaeaea;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const PriceLabel = styled.div`
  color: #666;
`;

const PriceValue = styled.div`
  font-weight: 500;
  color: #333;
`;

const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
`;

const NotFoundState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
`;

const NotFoundTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

interface Resource {
  id: string;
  name: string;
  description: string;
  type: string;
  cores: number;
  memory: number;
  storage: number;
  gpuCount: number;
  gpuModel: string;
  benchmarkScore: number;
  pricePerHour: number;
  minimumRentalTime: number;
  availabilityStart: string;
  availabilityEnd: string;
  region: string;
  country: string;
  provider: {
    id: string;
    name: string;
    rating: number;
  };
}

interface RentalForm {
  startDate: string;
  duration: number;
}

export default function ResourceDetail({ params }) {
  const router = useRouter();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rentalForm, setRentalForm] = useState<RentalForm>({
    startDate: '',
    duration: 24
  });
  const [errors, setErrors] = useState<{startDate?: string; duration?: string}>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  useEffect(() => {
    // Simulate fetching resource details from API
    const fetchResourceDetails = async () => {
      try {
        // In a real app, this would be an API call like:
        // const response = await fetch(`/api/resources/${params.id}`);
        // const data = await response.json();
        
        // Simulated API response
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generating fictional data based on the ID
        const data: Resource = {
          id: params.id,
          name: `High-Performance Compute Cluster ${params.id}`,
          description: "This high-performance computing cluster is optimized for intensive computational tasks. It provides excellent performance for scientific simulations, data analysis, machine learning training, and other computation-heavy workloads. The system includes dedicated high-speed storage and network infrastructure for optimal performance.",
          type: "cpu",
          cores: 32,
          memory: 128,
          storage: 2000,
          gpuCount: 0,
          gpuModel: "",
          benchmarkScore: 15600,
          pricePerHour: 2.50,
          minimumRentalTime: 1,
          availabilityStart: "2023-10-01T00:00:00Z",
          availabilityEnd: "2023-12-31T23:59:59Z",
          region: "north_america",
          country: "United States",
          provider: {
            id: "p1",
            name: "CloudCompute Solutions",
            rating: 4.8
          }
        };
        
        setResource(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resource details:', error);
        setLoading(false);
      }
    };
    
    fetchResourceDetails();
  }, [params.id]);
  
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Convert numeric values
    let parsedValue: string | number = value;
    if (type === 'number' || name === 'duration') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setRentalForm(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: {startDate?: string; duration?: string} = {};
    
    if (!rentalForm.startDate) {
      newErrors.startDate = 'Please select a start date';
    } else {
      const selectedDate = new Date(rentalForm.startDate);
      const currentDate = new Date();
      
      if (selectedDate < currentDate) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      
      if (resource) {
        const availabilityStart = new Date(resource.availabilityStart);
        const availabilityEnd = new Date(resource.availabilityEnd);
        
        if (selectedDate < availabilityStart || selectedDate > availabilityEnd) {
          newErrors.startDate = 'Start date is outside the resource availability period';
        }
      }
    }
    
    if (!rentalForm.duration || rentalForm.duration <= 0) {
      newErrors.duration = 'Please enter a valid duration';
    } else if (resource && rentalForm.duration < resource.minimumRentalTime) {
      newErrors.duration = `Duration must be at least ${resource.minimumRentalTime} hours`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // This would be an API call to your backend in a real application
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Redirect to confirmation page or show success
      alert('Rental request submitted successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting rental request:', error);
      
      // Show a generic error
      alert('Failed to submit rental request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to calculate estimated total cost
  const calculateTotalCost = () => {
    if (!resource || !rentalForm.duration) return 0;
    return resource.pricePerHour * rentalForm.duration;
  };
  
  // Get resource type display name
  const getResourceTypeLabel = (type: string): string => {
    switch (type) {
      case 'cpu': return 'CPU Optimized';
      case 'memory': return 'Memory Optimized';
      case 'storage': return 'Storage Optimized';
      case 'gpu': return 'GPU Compute';
      case 'balanced': return 'Balanced';
      default: return type;
    }
  };
  
  if (loading) {
    return (
      <Container>
        <LoadingState>
          <h2>Loading resource details...</h2>
        </LoadingState>
      </Container>
    );
  }
  
  if (!resource) {
    return (
      <Container>
        <NotFoundState>
          <NotFoundTitle>Resource Not Found</NotFoundTitle>
          <p>The resource you're looking for doesn't exist or has been removed.</p>
          <Link href="/marketplace">
            <Button>Return to Marketplace</Button>
          </Link>
        </NotFoundState>
      </Container>
    );
  }
  
  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbLink href="/marketplace">Resource Marketplace</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <span>Resource Details</span>
      </Breadcrumb>
      
      <ResourceHeader>
        <ResourceTitle>{resource.name}</ResourceTitle>
        <ResourceType>{getResourceTypeLabel(resource.type)}</ResourceType>
        <ResourceDescription>{resource.description}</ResourceDescription>
      </ResourceHeader>
      
      <Grid>
        <div>
          <DetailsCard>
            <SectionTitle>Technical Specifications</SectionTitle>
            <SpecsGrid>
              <SpecItem>
                <SpecLabel>CPU Cores</SpecLabel>
                <SpecValue>{resource.cores}</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Memory</SpecLabel>
                <SpecValue>{resource.memory} GB</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Storage</SpecLabel>
                <SpecValue>{resource.storage} GB</SpecValue>
              </SpecItem>
              <SpecItem>
                <SpecLabel>Benchmark Score</SpecLabel>
                <SpecValue>{resource.benchmarkScore}</SpecValue>
              </SpecItem>
              {resource.gpuCount > 0 && (
                <>
                  <SpecItem>
                    <SpecLabel>GPU</SpecLabel>
                    <SpecValue>{resource.gpuCount}x {resource.gpuModel}</SpecValue>
                  </SpecItem>
                </>
              )}
            </SpecsGrid>
            
            <SectionTitle>Provider Information</SectionTitle>
            <ProviderInfo>
              <ProviderAvatar>{resource.provider.name.charAt(0)}</ProviderAvatar>
              <div>
                <ProviderName>{resource.provider.name}</ProviderName>
                <ProviderRating>★ {resource.provider.rating.toFixed(1)} / 5.0</ProviderRating>
              </div>
            </ProviderInfo>
            
            <SectionTitle>Availability & Location</SectionTitle>
            <DetailRow>
              <DetailLabel>Available From</DetailLabel>
              <DetailValue>{new Date(resource.availabilityStart).toLocaleDateString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Available Until</DetailLabel>
              <DetailValue>{new Date(resource.availabilityEnd).toLocaleDateString()}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Region</DetailLabel>
              <DetailValue>{resource.region.replace('_', ' ')}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Country</DetailLabel>
              <DetailValue>{resource.country}</DetailValue>
            </DetailRow>
          </DetailsCard>
        </div>
        
        <div>
          <RentalCard>
            <SectionTitle>Rent This Resource</SectionTitle>
            
            <PriceSection>
              <PriceRow>
                <PriceLabel>Price per Hour</PriceLabel>
                <PriceValue>${resource.pricePerHour.toFixed(2)}</PriceValue>
              </PriceRow>
              <PriceRow>
                <PriceLabel>Minimum Rental Time</PriceLabel>
                <PriceValue>{resource.minimumRentalTime} hour(s)</PriceValue>
              </PriceRow>
              <TotalPrice>
                <span>Total Estimated Cost</span>
                <span>${calculateTotalCost().toFixed(2)}</span>
              </TotalPrice>
            </PriceSection>
            
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="startDate">Start Date and Time</Label>
                <Input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={rentalForm.startDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  value={rentalForm.duration || ''}
                  onChange={handleInputChange}
                  min={resource.minimumRentalTime}
                  step="1"
                />
                {errors.duration && <ErrorMessage>{errors.duration}</ErrorMessage>}
              </FormGroup>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Rent Now'}
              </Button>
            </form>
          </RentalCard>
        </div>
      </Grid>
    </Container>
  );
} 