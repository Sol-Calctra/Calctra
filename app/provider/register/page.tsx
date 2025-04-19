'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

// 样式组件
const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #3a0ca3;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
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

const ErrorMessage = styled.div`
  color: #e63946;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

const FormSection = styled.div`
  // Add any necessary styles for the form section
`;

const SectionTitle = styled.h2`
  // Add any necessary styles for the section title
`;

export default function ProviderRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    walletAddress: '',
    contactEmail: '',
    website: '',
    country: '',
    organizationType: 'INDIVIDUAL'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name cannot be empty';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description cannot be empty';
    }
    
    if (!formData.walletAddress.trim()) {
      newErrors.walletAddress = 'Wallet address cannot be empty';
    } else if (!/^[A-HJ-NP-Za-km-z1-9]{32,44}$/.test(formData.walletAddress)) {
      newErrors.walletAddress = 'Please enter a valid Solana wallet address';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email cannot be empty';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country/region cannot be empty';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real project, this would call an API to register the provider
      console.log('Submitting provider registration form:', formData);
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Registration successful, redirect to provider dashboard
      router.push('/provider/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({
        form: 'Registration failed, please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container>
      <Title>Become a Resource Provider</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Basic Information</SectionTitle>
          
          <FormGroup>
            <Label htmlFor="name">Full Name or Organization Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., University Computing Lab"
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g., contact@example.com"
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Provider Description</Label>
            <TextArea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your organization and computing resources"
            />
            {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
          </FormGroup>
        </FormSection>
        
        <FormGroup>
          <Label htmlFor="walletAddress">Solana Wallet Address</Label>
          <Input
            type="text"
            id="walletAddress"
            name="walletAddress"
            value={formData.walletAddress}
            onChange={handleInputChange}
            placeholder="Enter your Solana wallet address"
          />
          {errors.walletAddress && <ErrorMessage>{errors.walletAddress}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleInputChange}
            placeholder="Enter contact email"
          />
          {errors.contactEmail && <ErrorMessage>{errors.contactEmail}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="Enter your website address"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="country">Country/Region</Label>
          <Input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Enter your country/region"
          />
          {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="organizationType">Organization Type</Label>
          <Select
            id="organizationType"
            name="organizationType"
            value={formData.organizationType}
            onChange={handleInputChange}
          >
            <option value="INDIVIDUAL">Individual</option>
            <option value="ACADEMIC">Academic Institution</option>
            <option value="CORPORATE">Corporate</option>
            <option value="NONPROFIT">Nonprofit Organization</option>
          </Select>
        </FormGroup>
        
        {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Register as a Resource Provider'}
        </Button>
      </Form>
    </Container>
  );
} 