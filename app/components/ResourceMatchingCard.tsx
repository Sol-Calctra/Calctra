'use client';

import React from 'react';
import styled from 'styled-components';
import { MatchResult } from '../lib/resourceMatching';

// 样式组件
const MatchCard = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const MatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const MatchTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
`;

interface ScoreProps {
  score: number;
}

const MatchScore = styled.div`
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  background-color: ${(props: ScoreProps) => {
    if (props.score >= 90) return '#2ecc71';
    if (props.score >= 75) return '#27ae60';
    if (props.score >= 60) return '#f39c12';
    if (props.score >= 40) return '#e67e22';
    return '#e74c3c';
  }};
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-weight: 500;
`;

const MatchFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eaeaea;
`;

const ProviderInfo = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ActionButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #2980b9;
  }
`;

interface ResourceMatchingCardProps {
  match: MatchResult;
  onSelectMatch: (match: MatchResult) => void;
}

/**
 * Resource Matching Card Component
 * Displays computing resources recommended by the smart matching algorithm
 */
const ResourceMatchingCard = ({ match, onSelectMatch }: ResourceMatchingCardProps) => {
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} CAL`;
  };
  
  return (
    <MatchCard>
      <MatchHeader>
        <MatchTitle>{match.resource.name}</MatchTitle>
        <MatchScore score={match.matchScore}>Match: {match.matchScore}%</MatchScore>
      </MatchHeader>
      
      <DetailsGrid>
        <DetailGroup>
          <DetailLabel>Computing Performance</DetailLabel>
          <DetailValue>
            {match.resource.performance.cores} cores / {match.resource.performance.memory}GB
          </DetailValue>
        </DetailGroup>
        
        <DetailGroup>
          <DetailLabel>Estimated Cost</DetailLabel>
          <DetailValue>{formatPrice(match.estimatedCost)}</DetailValue>
        </DetailGroup>
        
        <DetailGroup>
          <DetailLabel>Estimated Time Range</DetailLabel>
          <DetailValue>
            {formatDate(match.estimatedStartTime)} - {formatDate(match.estimatedEndTime)}
          </DetailValue>
        </DetailGroup>
        
        <DetailGroup>
          <DetailLabel>Resource Type</DetailLabel>
          <DetailValue>{match.resource.resourceType}</DetailValue>
        </DetailGroup>
      </DetailsGrid>
      
      <p>{match.resource.description}</p>
      
      <MatchFooter>
        <ProviderInfo>
          提供者: {match.resource.providerId} | 
          位置: {match.resource.location.country}, {match.resource.location.region}
        </ProviderInfo>
        
        <ActionButton onClick={() => onSelectMatch(match)}>
          Select This Resource
        </ActionButton>
      </MatchFooter>
    </MatchCard>
  );
};

export default ResourceMatchingCard; 