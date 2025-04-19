'use client';

import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

// Styled components
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const DownloadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const DownloadCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 2rem;
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const OSIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const DownloadButton = styled.a`
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const SystemRequirements = styled.div`
  margin-bottom: 4rem;
`;

const RequirementTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const RequirementsList = styled.ul`
  padding-left: 1.5rem;
  color: #555;
  line-height: 1.6;
  
  & li {
    margin-bottom: 0.5rem;
  }
`;

const FeatureSection = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 2rem;
  margin-bottom: 3rem;
`;

const FeatureTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  padding: 1.5rem;
`;

const FeatureCardTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const FeatureCardDescription = styled.p`
  color: #666;
  line-height: 1.5;
`;

export default function DownloadPage() {
  const clientVersion = "1.0.0";
  
  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <span>Download</span>
      </Breadcrumb>
      
      <Header>
        <Title>Download Calctra Client</Title>
        <Subtitle>
          Get the Calctra client software to start contributing your computing resources
          or to use resources from the network for your scientific computing needs.
        </Subtitle>
      </Header>
      
      <DownloadGrid>
        <DownloadCard>
          <OSIcon>🪟</OSIcon>
          <CardTitle>Windows</CardTitle>
          <CardDescription>
            For Windows 10 and Windows 11 (64-bit). Easy installation with user-friendly interface.
          </CardDescription>
          <DownloadButton href="/downloads/calctra-client-win-x64.exe">
            Download for Windows
          </DownloadButton>
        </DownloadCard>
        
        <DownloadCard>
          <OSIcon>🍎</OSIcon>
          <CardTitle>macOS</CardTitle>
          <CardDescription>
            For macOS 10.15 (Catalina) and later. Native support for both Intel and Apple Silicon.
          </CardDescription>
          <DownloadButton href="/downloads/calctra-client-macos.dmg">
            Download for macOS
          </DownloadButton>
        </DownloadCard>
        
        <DownloadCard>
          <OSIcon>🐧</OSIcon>
          <CardTitle>Linux</CardTitle>
          <CardDescription>
            Available as AppImage for all major distributions. Also available as .deb and .rpm packages.
          </CardDescription>
          <DownloadButton href="/downloads/calctra-client-linux-x86_64.AppImage">
            Download for Linux
          </DownloadButton>
        </DownloadCard>
      </DownloadGrid>
      
      <SystemRequirements>
        <RequirementTitle>System Requirements</RequirementTitle>
        <RequirementsList>
          <li><strong>CPU:</strong> At least 4 cores for resource providers, 2 cores for resource users</li>
          <li><strong>RAM:</strong> Minimum 8GB for resource providers, 4GB for resource users</li>
          <li><strong>Storage:</strong> 10GB of free space</li>
          <li><strong>Network:</strong> Stable internet connection with at least 10 Mbps upload/download speed for resource providers</li>
          <li><strong>Windows:</strong> Windows 10 or later (64-bit)</li>
          <li><strong>macOS:</strong> macOS 10.15 (Catalina) or later</li>
          <li><strong>Linux:</strong> Ubuntu 20.04+, Fedora 34+, or any distribution with GLIBC 2.31+</li>
        </RequirementsList>
      </SystemRequirements>
      
      <FeatureSection>
        <FeatureTitle>Client Features</FeatureTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureCardTitle>Resource Monitoring</FeatureCardTitle>
            <FeatureCardDescription>
              Real-time monitoring of your system's resources including CPU utilization, memory usage, 
              and network traffic when sharing your computing power.
            </FeatureCardDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureCardTitle>Secure Communication</FeatureCardTitle>
            <FeatureCardDescription>
              End-to-end encrypted communication with blockchain-based verification
              to ensure your data remains secure and private.
            </FeatureCardDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureCardTitle>Wallet Integration</FeatureCardTitle>
            <FeatureCardDescription>
              Built-in wallet for managing CAL tokens, tracking earnings and expenses,
              and processing transactions seamlessly.
            </FeatureCardDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureCardTitle>Resource Scheduling</FeatureCardTitle>
            <FeatureCardDescription>
              Set availability schedules for your computing resources or schedule
              resource usage to optimize costs and performance.
            </FeatureCardDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureCardTitle>Containerized Workloads</FeatureCardTitle>
            <FeatureCardDescription>
              Secure execution of workloads in isolated containers to ensure
              system integrity and prevent malicious activities.
            </FeatureCardDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureCardTitle>Smart Contract Management</FeatureCardTitle>
            <FeatureCardDescription>
              View, create, and manage smart contracts for resource sharing with
              fully transparent terms and conditions.
            </FeatureCardDescription>
          </FeatureCard>
        </FeatureGrid>
      </FeatureSection>
      
      <div style={{ textAlign: 'center' }}>
        <p>Current version: {clientVersion}</p>
        <p>
          <Link href="/changelog">View Changelog</Link> | <Link href="/documentation">View Documentation</Link>
        </p>
      </div>
    </Container>
  );
} 