'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #444;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0060df;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

// Form data type
interface DemandFormData {
  title: string;
  description: string;
  resourceType: string;
  minCores: string;
  minMemoryGb: string;
  minStorage: string;
  gpuRequired: boolean;
  startDate: string;
  endDate: string;
  maxPricePerHour: string;
  totalBudget: string;
  preferredRegions: string[];
}

const CreateDemand = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<DemandFormData>({
    title: '',
    description: '',
    resourceType: 'cpu',
    minCores: '',
    minMemoryGb: '',
    minStorage: '',
    gpuRequired: false,
    startDate: '',
    endDate: '',
    maxPricePerHour: '',
    totalBudget: '',
    preferredRegions: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.minCores.trim()) {
      newErrors.minCores = 'Minimum cores is required';
    } else if (isNaN(Number(formData.minCores)) || Number(formData.minCores) <= 0) {
      newErrors.minCores = 'Must be a positive number';
    }

    if (!formData.minMemoryGb.trim()) {
      newErrors.minMemoryGb = 'Minimum memory is required';
    } else if (isNaN(Number(formData.minMemoryGb)) || Number(formData.minMemoryGb) <= 0) {
      newErrors.minMemoryGb = 'Must be a positive number';
    }

    if (!formData.minStorage.trim()) {
      newErrors.minStorage = 'Minimum storage is required';
    } else if (isNaN(Number(formData.minStorage)) || Number(formData.minStorage) <= 0) {
      newErrors.minStorage = 'Must be a positive number';
    }

    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate.trim()) {
      newErrors.endDate = 'End date is required';
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.maxPricePerHour.trim()) {
      newErrors.maxPricePerHour = 'Maximum price is required';
    } else if (isNaN(Number(formData.maxPricePerHour)) || Number(formData.maxPricePerHour) <= 0) {
      newErrors.maxPricePerHour = 'Must be a positive number';
    }

    if (!formData.totalBudget.trim()) {
      newErrors.totalBudget = 'Total budget is required';
    } else if (isNaN(Number(formData.totalBudget)) || Number(formData.totalBudget) <= 0) {
      newErrors.totalBudget = 'Must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call to publish demand
      console.log('Publishing demand:', formData);
      
      // In a real application, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to marketplace or demand details page
      router.push('/marketplace');
    } catch (error) {
      console.error('Error publishing demand:', error);
      setErrors({
        submit: 'Failed to publish demand. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Create Computation Demand</Title>
      <Subtitle>Specify your computation requirements to find matching providers</Subtitle>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="E.g., Machine Learning Training Job"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your computation requirements in detail"
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Resource Requirements</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="resourceType">Resource Type</Label>
            <Select
              id="resourceType"
              name="resourceType"
              value={formData.resourceType}
              onChange={handleInputChange}
            >
              <option value="cpu">CPU Compute</option>
              <option value="gpu">GPU Compute</option>
              <option value="storage">Storage</option>
              <option value="hybrid">Hybrid</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="minCores">Minimum CPU Cores</Label>
            <Input
              type="number"
              id="minCores"
              name="minCores"
              value={formData.minCores}
              onChange={handleInputChange}
              placeholder="E.g., 4"
              min="1"
            />
            {errors.minCores && <ErrorMessage>{errors.minCores}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="minMemoryGb">Minimum Memory (GB)</Label>
            <Input
              type="number"
              id="minMemoryGb"
              name="minMemoryGb"
              value={formData.minMemoryGb}
              onChange={handleInputChange}
              placeholder="E.g., 16"
              min="1"
            />
            {errors.minMemoryGb && <ErrorMessage>{errors.minMemoryGb}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="minStorage">Minimum Storage (GB)</Label>
            <Input
              type="number"
              id="minStorage"
              name="minStorage"
              value={formData.minStorage}
              onChange={handleInputChange}
              placeholder="E.g., 100"
              min="1"
            />
            {errors.minStorage && <ErrorMessage>{errors.minStorage}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label>
              <Input
                type="checkbox"
                name="gpuRequired"
                checked={formData.gpuRequired}
                onChange={handleCheckboxChange}
              />
              GPU Required
            </Label>
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Time Requirements</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
            {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
            {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Budget</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="maxPricePerHour">Maximum Price per Hour (USD)</Label>
            <Input
              type="number"
              id="maxPricePerHour"
              name="maxPricePerHour"
              value={formData.maxPricePerHour}
              onChange={handleInputChange}
              placeholder="E.g., 5.00"
              step="0.01"
              min="0.01"
            />
            {errors.maxPricePerHour && <ErrorMessage>{errors.maxPricePerHour}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="totalBudget">Total Budget (USD)</Label>
            <Input
              type="number"
              id="totalBudget"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleInputChange}
              placeholder="E.g., 500.00"
              step="0.01"
              min="0.01"
            />
            {errors.totalBudget && <ErrorMessage>{errors.totalBudget}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormSection>
          <SectionTitle>Geographic Preferences</SectionTitle>
          
          <FormGroup>
            <Label>Preferred Regions</Label>
            {['North America', 'Europe', 'Asia Pacific', 'South America', 'Africa'].map((region) => (
              <Label key={region}>
                <Input
                  type="checkbox"
                  name={region}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        preferredRegions: [...prev.preferredRegions, region]
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        preferredRegions: prev.preferredRegions.filter(r => r !== region)
                      }));
                    }
                  }}
                />
                {region}
              </Label>
            ))}
          </FormGroup>
        </FormSection>
        
        {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish Demand'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateDemand; 