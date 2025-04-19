'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eaeaea;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FormColumn = styled.div`
  flex: 1;
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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
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

const DateTimeGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  & > div {
    flex: 1;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

interface ResourceData {
  name: string;
  description: string;
  resourceType: string;
  cores: number;
  memory: number;
  storageCapacity: number;
  gpuModel: string;
  gpuCount: number;
  benchmarkScore: number;
  availabilityStart: string;
  availabilityEnd: string;
  timeZone: string;
  pricePerHour: number;
  minimumRentalTime: number;
  region: string;
  country: string;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  resourceType?: string;
  cores?: string;
  memory?: string;
  storageCapacity?: string;
  gpuModel?: string;
  gpuCount?: string;
  benchmarkScore?: string;
  availabilityStart?: string;
  availabilityEnd?: string;
  timeZone?: string;
  pricePerHour?: string;
  minimumRentalTime?: string;
  region?: string;
  country?: string;
}

export default function AddResource() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<ResourceData>({
    name: '',
    description: '',
    resourceType: '',
    cores: 0,
    memory: 0,
    storageCapacity: 0,
    gpuModel: '',
    gpuCount: 0,
    benchmarkScore: 0,
    availabilityStart: '',
    availabilityEnd: '',
    timeZone: 'UTC',
    pricePerHour: 0,
    minimumRentalTime: 1,
    region: '',
    country: ''
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Convert value to appropriate type for number inputs
    let parsedValue: string | number = value;
    if (type === 'number' || name === 'pricePerHour') {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Resource name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.resourceType) newErrors.resourceType = 'Resource type is required';
    
    // Performance validations
    if (formData.cores <= 0) newErrors.cores = 'Number of cores must be greater than zero';
    if (formData.memory <= 0) newErrors.memory = 'Memory must be greater than zero';
    if (formData.storageCapacity <= 0) newErrors.storageCapacity = 'Storage capacity must be greater than zero';
    
    // If GPU type is selected but no GPU info provided
    if (formData.resourceType === 'gpu') {
      if (!formData.gpuModel.trim()) newErrors.gpuModel = 'GPU model is required for GPU resources';
      if (formData.gpuCount <= 0) newErrors.gpuCount = 'Number of GPUs must be greater than zero';
    }
    
    if (formData.benchmarkScore <= 0) newErrors.benchmarkScore = 'Benchmark score must be greater than zero';
    
    // Availability validation
    if (!formData.availabilityStart) newErrors.availabilityStart = 'Start date is required';
    if (!formData.availabilityEnd) newErrors.availabilityEnd = 'End date is required';
    if (!formData.timeZone) newErrors.timeZone = 'Time zone is required';
    
    // Dates comparison
    if (formData.availabilityStart && formData.availabilityEnd) {
      const start = new Date(formData.availabilityStart);
      const end = new Date(formData.availabilityEnd);
      if (start >= end) {
        newErrors.availabilityEnd = 'End date must be after start date';
      }
    }
    
    // Pricing validation
    if (formData.pricePerHour <= 0) newErrors.pricePerHour = 'Price per hour must be greater than zero';
    if (formData.minimumRentalTime <= 0) newErrors.minimumRentalTime = 'Minimum rental time must be greater than zero';
    
    // Location validation
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // This would be an API call to your backend in a real application
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      console.log('Resource data submitted:', formData);
      
      // Redirect to resource listing page
      router.push('/provider/resources');
    } catch (error) {
      console.error('Error submitting resource:', error);
      
      // Show a generic error
      alert('Failed to add resource. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If the resource type is not GPU, disable GPU fields
  const isGpuResource = formData.resourceType === 'gpu';
  
  return (
    <Container>
      <Title>Add Computing Resource</Title>
      <Subtitle>
        Provide details about the computing resource you want to offer in the marketplace.
      </Subtitle>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="name">Resource Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter a descriptive name for your resource"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your resource, its capabilities and unique features"
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="resourceType">Resource Type</Label>
            <Select
              id="resourceType"
              name="resourceType"
              value={formData.resourceType}
              onChange={handleChange}
            >
              <option value="">Select a resource type</option>
              <option value="cpu">CPU Optimized</option>
              <option value="memory">Memory Optimized</option>
              <option value="storage">Storage Optimized</option>
              <option value="gpu">GPU Compute</option>
              <option value="balanced">Balanced</option>
            </Select>
            {errors.resourceType && <ErrorMessage>{errors.resourceType}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Performance Parameters</SectionTitle>
          
          <FormRow>
            <FormColumn>
              <Label htmlFor="cores">Number of CPU Cores</Label>
              <Input
                type="number"
                id="cores"
                name="cores"
                value={formData.cores || ''}
                onChange={handleChange}
                min="1"
              />
              {errors.cores && <ErrorMessage>{errors.cores}</ErrorMessage>}
            </FormColumn>
            
            <FormColumn>
              <Label htmlFor="memory">Memory (GB)</Label>
              <Input
                type="number"
                id="memory"
                name="memory"
                value={formData.memory || ''}
                onChange={handleChange}
                min="1"
              />
              {errors.memory && <ErrorMessage>{errors.memory}</ErrorMessage>}
            </FormColumn>
            
            <FormColumn>
              <Label htmlFor="storageCapacity">Storage Capacity (GB)</Label>
              <Input
                type="number"
                id="storageCapacity"
                name="storageCapacity"
                value={formData.storageCapacity || ''}
                onChange={handleChange}
                min="1"
              />
              {errors.storageCapacity && <ErrorMessage>{errors.storageCapacity}</ErrorMessage>}
            </FormColumn>
          </FormRow>
          
          <FormRow>
            <FormColumn>
              <Label htmlFor="gpuModel">GPU Model</Label>
              <Input
                type="text"
                id="gpuModel"
                name="gpuModel"
                value={formData.gpuModel}
                onChange={handleChange}
                disabled={!isGpuResource}
                placeholder={isGpuResource ? "e.g., NVIDIA A100, AMD Instinct MI100" : "Not applicable"}
              />
              {errors.gpuModel && <ErrorMessage>{errors.gpuModel}</ErrorMessage>}
            </FormColumn>
            
            <FormColumn>
              <Label htmlFor="gpuCount">Number of GPUs</Label>
              <Input
                type="number"
                id="gpuCount"
                name="gpuCount"
                value={formData.gpuCount || ''}
                onChange={handleChange}
                min="0"
                disabled={!isGpuResource}
              />
              {errors.gpuCount && <ErrorMessage>{errors.gpuCount}</ErrorMessage>}
            </FormColumn>
            
            <FormColumn>
              <Label htmlFor="benchmarkScore">Benchmark Score</Label>
              <Input
                type="number"
                id="benchmarkScore"
                name="benchmarkScore"
                value={formData.benchmarkScore || ''}
                onChange={handleChange}
                min="1"
                placeholder="Enter a standardized benchmark score"
              />
              {errors.benchmarkScore && <ErrorMessage>{errors.benchmarkScore}</ErrorMessage>}
            </FormColumn>
          </FormRow>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Availability</SectionTitle>
          
          <DateTimeGroup>
            <div>
              <Label htmlFor="availabilityStart">Available From</Label>
              <Input
                type="datetime-local"
                id="availabilityStart"
                name="availabilityStart"
                value={formData.availabilityStart}
                onChange={handleChange}
              />
              {errors.availabilityStart && <ErrorMessage>{errors.availabilityStart}</ErrorMessage>}
            </div>
            
            <div>
              <Label htmlFor="availabilityEnd">Available Until</Label>
              <Input
                type="datetime-local"
                id="availabilityEnd"
                name="availabilityEnd"
                value={formData.availabilityEnd}
                onChange={handleChange}
              />
              {errors.availabilityEnd && <ErrorMessage>{errors.availabilityEnd}</ErrorMessage>}
            </div>
            
            <div>
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select
                id="timeZone"
                name="timeZone"
                value={formData.timeZone}
                onChange={handleChange}
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (ET)</option>
                <option value="CST">Central Time (CT)</option>
                <option value="MST">Mountain Time (MT)</option>
                <option value="PST">Pacific Time (PT)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="CET">Central European Time (CET)</option>
                <option value="IST">India Standard Time (IST)</option>
                <option value="JST">Japan Standard Time (JST)</option>
                <option value="AEST">Australian Eastern Standard Time (AEST)</option>
              </Select>
              {errors.timeZone && <ErrorMessage>{errors.timeZone}</ErrorMessage>}
            </div>
          </DateTimeGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Pricing</SectionTitle>
          
          <FormRow>
            <FormColumn>
              <Label htmlFor="pricePerHour">Price per Hour (USD)</Label>
              <Input
                type="number"
                id="pricePerHour"
                name="pricePerHour"
                value={formData.pricePerHour || ''}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                placeholder="e.g., 1.25"
              />
              {errors.pricePerHour && <ErrorMessage>{errors.pricePerHour}</ErrorMessage>}
            </FormColumn>
            
            <FormColumn>
              <Label htmlFor="minimumRentalTime">Minimum Rental Time (hours)</Label>
              <Input
                type="number"
                id="minimumRentalTime"
                name="minimumRentalTime"
                value={formData.minimumRentalTime || ''}
                onChange={handleChange}
                min="1"
              />
              {errors.minimumRentalTime && <ErrorMessage>{errors.minimumRentalTime}</ErrorMessage>}
            </FormColumn>
          </FormRow>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Location</SectionTitle>
          
          <FormRow>
            <FormColumn>
              <Label htmlFor="region">Region</Label>
              <Select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
              >
                <option value="">Select a region</option>
                <option value="north_america">North America</option>
                <option value="south_america">South America</option>
                <option value="europe">Europe</option>
                <option value="asia_pacific">Asia Pacific</option>
                <option value="africa">Africa</option>
                <option value="middle_east">Middle East</option>
              </Select>
              {errors.region && <ErrorMessage>{errors.region}</ErrorMessage>}
            </FormColumn>
            
            <FormColumn>
              <Label htmlFor="country">Country</Label>
              <Input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g., United States, Germany, Japan"
              />
              {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
            </FormColumn>
          </FormRow>
        </FormSection>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Resource...' : 'Add Resource'}
        </Button>
      </Form>
    </Container>
  );
} 