'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';

// Style components
const Container = styled.div`
  max-width: 1000px;
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

const Header = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #3a0ca3;
  margin-bottom: 1rem;
`;

const DemandMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  background-color: ${(props: { status: string }) => {
    switch (props.status) {
      case 'OPEN': return '#4cc9f0';
      case 'IN_PROGRESS': return '#4361ee';
      case 'COMPLETED': return '#2ecc71';
      case 'CANCELLED': return '#e63946';
      default: return '#aaa';
    }
  }};
  color: white;
`;

const DemandDescription = styled.div`
  white-space: pre-line;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #3a0ca3;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const RequirementCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const RequirementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const RequirementItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const RequirementLabel = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.25rem;
`;

const RequirementValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
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
  
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const BidSection = styled.div`
  margin-top: 3rem;
`;

const BidCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const BidInfo = styled.div`
  flex: 1;
`;

const BidProvider = styled.div`
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const BidAmount = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #3a0ca3;
  margin-bottom: 0.5rem;
`;

const BidDetails = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.5rem;
`;

const BidActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SmallButton = styled.button`
  background-color: ${(props: { primary?: boolean }) => props.primary ? '#4361ee' : '#f8f9fa'};
  color: ${(props: { primary?: boolean }) => props.primary ? 'white' : '#333'};
  border: 1px solid ${(props: { primary?: boolean }) => props.primary ? '#4361ee' : '#ddd'};
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${(props: { primary?: boolean }) => props.primary ? '#3a0ca3' : '#e9ecef'};
    border-color: ${(props: { primary?: boolean }) => props.primary ? '#3a0ca3' : '#ddd'};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  color: #3a0ca3;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  color: #e63946;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

// Add type definitions for the bidForm and related interfaces
interface BidFormData {
  amount: string;
  estimatedCompletion: string;
  proposal: string;
}

interface BidFormErrors {
  amount?: string;
  estimatedCompletion?: string;
  proposal?: string;
  form?: string;
}

// Mock data
const mockDemand = {
  id: 'demand_123',
  title: 'Large-scale Medical Imaging AI Training Task',
  description: 'High-performance computing resources needed for large-scale training of medical imaging AI models. Our team is developing a new medical image analysis algorithm that requires processing and analyzing large volumes of radiological image data.\n\nThis algorithm will be used for early disease detection and diagnostic assistance. We need sufficient computing power to support the training process of deep learning models.',
  status: 'OPEN',
  creator: {
    id: 'user_456',
    name: 'Medical AI Research Team',
    reputation: 4.8
  },
  createdAt: new Date('2025-03-10T14:30:00'),
  requirements: {
    resourceType: 'GPU',
    minCores: 32,
    minMemory: 256,
    minSpeed: 3.0,
    estimatedDuration: 72, // hours
    maxBudget: 2500, // CAL tokens
    preferredRegions: ['Asia Pacific', 'Europe']
  },
  bids: [
    {
      id: 'bid_1',
      providerId: 'provider_1',
      providerName: 'High-Performance Computing Center',
      providerReputation: 4.9,
      amount: 2200,
      estimatedCompletion: 68,
      proposal: 'We can provide the latest A100 GPU cluster with high-bandwidth memory and optimized computing environment, ideal for medical imaging AI training. Our resources have successfully supported multiple similar medical research projects.',
      createdAt: new Date('2025-03-12T09:15:00')
    },
    {
      id: 'bid_2',
      providerId: 'provider_2',
      providerName: 'Cloud Computing Service',
      providerReputation: 4.7,
      amount: 2450,
      estimatedCompletion: 65,
      proposal: 'We offer GPU computing resources optimized for AI training, including customized Docker environments and real-time monitoring services to ensure smooth training processes.',
      createdAt: new Date('2025-03-11T16:40:00')
    }
  ]
};

export default function DemandDetail({ params }) {
  const router = useRouter();
  const [demand, setDemand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidForm, setBidForm] = useState<BidFormData>({
    amount: '',
    estimatedCompletion: '',
    proposal: ''
  });
  const [bidErrors, setBidErrors] = useState<BidFormErrors>({});
  const [submittingBid, setSubmittingBid] = useState(false);
  
  // Simulate API request to get demand details
  useEffect(() => {
    const fetchDemandDetails = async () => {
      try {
        // In an actual project, this would call an API to get specific ID demand
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setDemand(mockDemand);
      } catch (error) {
        console.error('Failed to fetch demand details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDemandDetails();
  }, [params.id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBidForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateBidForm = () => {
    const newErrors: BidFormErrors = {};
    
    if (!bidForm.amount.trim() || isNaN(parseFloat(bidForm.amount)) || parseFloat(bidForm.amount) <= 0) {
      newErrors.amount = 'Please enter a valid bid amount';
    } else if (parseFloat(bidForm.amount) > demand.requirements.maxBudget) {
      newErrors.amount = `Bid amount cannot exceed maximum budget of ${demand.requirements.maxBudget} CAL`;
    }
    
    if (!bidForm.estimatedCompletion.trim() || isNaN(parseFloat(bidForm.estimatedCompletion)) || parseFloat(bidForm.estimatedCompletion) <= 0) {
      newErrors.estimatedCompletion = 'Please enter a valid estimated completion time';
    }
    
    if (!bidForm.proposal.trim()) {
      newErrors.proposal = 'Please fill in the bid proposal';
    } else if (bidForm.proposal.length < 50) {
      newErrors.proposal = 'Proposal is too short, please describe your service plan in detail';
    }
    
    setBidErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    if (!validateBidForm()) {
      return;
    }
    
    setSubmittingBid(true);
    
    try {
      // In an actual project, this would call an API to submit the bid
      console.log('Submitting bid:', bidForm);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API request
      
      // Simulate success and close modal
      setShowBidModal(false);
      
      // Reset form
      setBidForm({
        amount: '',
        estimatedCompletion: '',
        proposal: ''
      });
      
      // Simulate updating bid list (would fetch data in actual project)
      const newBid = {
        id: `bid_${Date.now()}`,
        providerId: 'current_provider',
        providerName: 'Current Provider',
        providerReputation: 4.5,
        amount: parseFloat(bidForm.amount),
        estimatedCompletion: parseFloat(bidForm.estimatedCompletion),
        proposal: bidForm.proposal,
        createdAt: new Date()
      };
      
      setDemand(prev => ({
        ...prev,
        bids: [newBid, ...prev.bids]
      }));
      
    } catch (error) {
      console.error('Failed to submit bid:', error);
      setBidErrors({
        form: 'Failed to submit bid, please try again later'
      });
    } finally {
      setSubmittingBid(false);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }
  
  if (!demand) {
    return (
      <Container>
        <div>Demand does not exist or has been deleted</div>
        <Link href="/marketplace">
          <Button>Return to Marketplace</Button>
        </Link>
      </Container>
    );
  }
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink href="/marketplace">Computing Resource Market</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <span>Demand Details</span>
      </Breadcrumb>
      
      <Header>
        <Title>{demand.title}</Title>
        <DemandMeta>
          <MetaItem>
            <span>Creator: {demand.creator.name}</span>
          </MetaItem>
          <MetaItem>
            <span>Published: {formatDate(demand.createdAt)}</span>
          </MetaItem>
          <MetaItem>
            <StatusBadge status={demand.status}>
              {demand.status === 'OPEN' ? 'Open for Bids' : 
                demand.status === 'IN_PROGRESS' ? 'In Progress' : 
                demand.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
            </StatusBadge>
          </MetaItem>
        </DemandMeta>
        <DemandDescription>{demand.description}</DemandDescription>
      </Header>
      
      <Section>
        <SectionTitle>Requirements</SectionTitle>
        <RequirementCard>
          <RequirementGrid>
            <RequirementItem>
              <RequirementLabel>Resource Type</RequirementLabel>
              <RequirementValue>{demand.requirements.resourceType}</RequirementValue>
            </RequirementItem>
            <RequirementItem>
              <RequirementLabel>Minimum Cores</RequirementLabel>
              <RequirementValue>{demand.requirements.minCores} cores</RequirementValue>
            </RequirementItem>
            <RequirementItem>
              <RequirementLabel>Minimum Memory</RequirementLabel>
              <RequirementValue>{demand.requirements.minMemory} GB</RequirementValue>
            </RequirementItem>
            <RequirementItem>
              <RequirementLabel>Minimum Processor Speed</RequirementLabel>
              <RequirementValue>{demand.requirements.minSpeed} GHz</RequirementValue>
            </RequirementItem>
            <RequirementItem>
              <RequirementLabel>Estimated Duration</RequirementLabel>
              <RequirementValue>{demand.requirements.estimatedDuration} hours</RequirementValue>
            </RequirementItem>
            <RequirementItem>
              <RequirementLabel>Maximum Budget</RequirementLabel>
              <RequirementValue>{demand.requirements.maxBudget} CAL</RequirementValue>
            </RequirementItem>
          </RequirementGrid>
          <div>
            <RequirementLabel>Preferred Regions</RequirementLabel>
            <div>{demand.requirements.preferredRegions.join(', ')}</div>
          </div>
        </RequirementCard>
        
        {demand.status === 'OPEN' && (
          <ButtonsContainer>
            <Button onClick={() => setShowBidModal(true)}>Submit Bid</Button>
          </ButtonsContainer>
        )}
      </Section>
      
      <BidSection>
        <SectionTitle>Bids ({demand.bids.length})</SectionTitle>
        {demand.bids.length > 0 ? (
          demand.bids.map(bid => (
            <BidCard key={bid.id}>
              <BidInfo>
                <BidProvider>{bid.providerName} (Reputation: {bid.providerReputation}/5)</BidProvider>
                <BidAmount>{bid.amount} CAL</BidAmount>
                <BidDetails>Estimated Completion: {bid.estimatedCompletion} hours</BidDetails>
                <BidDetails>Submitted: {formatDate(bid.createdAt)}</BidDetails>
                <BidDetails>Proposal: {bid.proposal}</BidDetails>
              </BidInfo>
              <BidActions>
                {demand.status === 'OPEN' && demand.creator.id === 'user_456' && (
                  <SmallButton primary>Accept Bid</SmallButton>
                )}
                <Link href={`/provider/${bid.providerId}`}>
                  <SmallButton>View Provider</SmallButton>
                </Link>
              </BidActions>
            </BidCard>
          ))
        ) : (
          <div>No bids yet</div>
        )}
      </BidSection>
      
      {showBidModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>Submit Bid</ModalTitle>
            <form onSubmit={handleSubmitBid}>
              <FormGroup>
                <Label htmlFor="amount">Bid Amount (CAL)</Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  min="1"
                  step="0.1"
                  value={bidForm.amount}
                  onChange={handleInputChange}
                  placeholder={`Maximum budget: ${demand.requirements.maxBudget} CAL`}
                />
                {bidErrors.amount && <ErrorMessage>{bidErrors.amount}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="estimatedCompletion">Estimated Completion Time (hours)</Label>
                <Input
                  type="number"
                  id="estimatedCompletion"
                  name="estimatedCompletion"
                  min="1"
                  value={bidForm.estimatedCompletion}
                  onChange={handleInputChange}
                  placeholder={`Estimated duration: ${demand.requirements.estimatedDuration} hours`}
                />
                {bidErrors.estimatedCompletion && <ErrorMessage>{bidErrors.estimatedCompletion}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="proposal">Bid Proposal</Label>
                <TextArea
                  id="proposal"
                  name="proposal"
                  value={bidForm.proposal}
                  onChange={handleInputChange}
                  placeholder="Describe your service plan, relevant experience, and competitive advantages in detail"
                />
                {bidErrors.proposal && <ErrorMessage>{bidErrors.proposal}</ErrorMessage>}
              </FormGroup>
              
              {bidErrors.form && <ErrorMessage>{bidErrors.form}</ErrorMessage>}
              
              <ModalActions>
                <SmallButton type="button" onClick={() => setShowBidModal(false)}>Cancel</SmallButton>
                <Button type="submit" disabled={submittingBid}>
                  {submittingBid ? 'Submitting...' : 'Submit Bid'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
} 