'use client';

import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

// Style components
const Container = styled.div`
  max-width: 100%;
  overflow-x: hidden;
`;

const HeroSection = styled.div`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/bg-pattern.svg');
  background-size: cover;
  opacity: 0.1;
  z-index: 1;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  
  img {
    max-width: 200px;
    height: auto;
  }
  
  @media (max-width: 768px) {
    img {
      max-width: 150px;
    }
  }
`;

const Tagline = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const SubTagline = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled.button`
  background-color: white;
  color: #3a0ca3;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 300px;
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  color: white;
  border: 2px solid white;
  
  &:hover {
    background-color: white;
    color: #3a0ca3;
  }
`;

const Section = styled.div`
  padding: 5rem 2rem;
  
  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #3a0ca3;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #555;
  max-width: 800px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  color: #4361ee;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #3a0ca3;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #555;
  line-height: 1.6;
`;

const HowItWorksSection = styled(Section)`
  background-color: #f8f9fa;
`;

const Timeline = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const TimelineItem = styled.div`
  display: flex;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TimelineNumber = styled.div`
  flex: 0 0 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #4361ee;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  margin-right: 2rem;
  
  @media (max-width: 768px) {
    margin: 0 auto 1rem;
  }
`;

const TimelineContent = styled.div`
  flex: 1;
`;

const TimelineTitle = styled.h3`
  font-size: 1.5rem;
  color: #3a0ca3;
  margin-bottom: 1rem;
`;

const TimelineDescription = styled.p`
  color: #555;
  line-height: 1.6;
`;

const StatsSection = styled(Section)`
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  color: white;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const TestimonialsSection = styled(Section)`
  background-color: white;
`;

const TestimonialCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin: 0 auto;
  max-width: 800px;
  text-align: center;
`;

const QuoteIcon = styled.div`
  font-size: 2rem;
  color: #4361ee;
  margin-bottom: 1rem;
`;

const TestimonialText = styled.p`
  font-size: 1.2rem;
  color: #333;
  line-height: 1.8;
  font-style: italic;
  margin-bottom: 2rem;
`;

const TestimonialAuthor = styled.div`
  font-weight: bold;
  color: #3a0ca3;
`;

const TestimonialRole = styled.div`
  color: #555;
  font-size: 0.9rem;
`;

const CtaSection = styled(Section)`
  background-color: #f8f9fa;
  text-align: center;
`;

const Footer = styled.footer`
  background-color: #2b2d42;
  color: white;
  padding: 3rem 2rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  img {
    max-width: 120px;
    height: auto;
  }
`;

const FooterDescription = styled.p`
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const FooterTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: #4361ee;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.75rem;
  
  a {
    color: #aaa;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #444;
  color: #aaa;
  font-size: 0.9rem;
`;

// Feature data
const features = [
  {
    icon: '🔍',
    title: 'Efficient Resource Matching',
    description: 'Smart algorithms automatically match supply and demand, ensuring optimal resource allocation and utilization, reducing waste and improving efficiency.'
  },
  {
    icon: '🔒',
    title: 'Secure Computing Environment',
    description: 'Blockchain-based secure computing environment that protects data privacy and ensures reliable computation results, suitable for sensitive data processing.'
  },
  {
    icon: '💰',
    title: 'Transparent Incentive Mechanism',
    description: 'CAL token incentive system ensures resource providers receive fair compensation, demanders pay reasonable prices, and the platform maintains healthy operations.'
  },
  {
    icon: '🌐',
    title: 'Decentralized Governance',
    description: 'Community-driven decentralized governance structure ensures the platform operates fairly and transparently, with continuous optimization based on user needs.'
  },
  {
    icon: '📊',
    title: 'Flexible Resource Pricing',
    description: 'Dynamic market pricing mechanism adjusts based on supply-demand and resource performance, enabling both parties to obtain optimal value.'
  },
  {
    icon: '🚀',
    title: 'Global Resource Network',
    description: 'Connects computing resources worldwide, breaking geographical barriers to make high-performance computing accessible and accelerating scientific innovation.'
  }
];

// Workflow process data
const howItWorks = [
  {
    number: 1,
    title: 'Resource Provision',
    description: 'Resource owners register their idle computing resources (e.g., servers, GPU clusters) on the platform, detailing performance parameters, availability, and pricing.'
  },
  {
    number: 2,
    title: 'Demand Publication',
    description: 'Computing demanders publish specific computational task requirements, including resource type, performance needs, computing duration, and budget.'
  },
  {
    number: 3,
    title: 'Smart Matching',
    description: 'The platform\'s intelligent algorithm automatically matches the most suitable computing resources based on requirements, or providers can directly bid on demands.'
  },
  {
    number: 4,
    title: 'Secure Computation',
    description: 'After successful matching, the platform establishes a secure computing environment where demand-side algorithms run on provider hardware while ensuring data security.'
  },
  {
    number: 5,
    title: 'Token Settlement',
    description: 'After the computing task is completed, the system automatically settles using CAL tokens, with resource providers receiving payment in a transparent, trustless process.'
  }
];

// Platform statistics data
const stats = [
  {
    value: '5,000+',
    label: 'Registered Resources'
  },
  {
    value: '10,000+',
    label: 'Completed Tasks'
  },
  {
    value: '50+',
    label: 'Supported Countries'
  },
  {
    value: '99.9%',
    label: 'Platform Reliability'
  }
];

// User testimonials
const testimonials = [
  {
    text: 'The Calctra platform has completely transformed our research methods. Genome analysis that previously took weeks now takes just hours. This not only saves time but also significantly reduces our computing costs.',
    author: 'Prof. Zhang',
    role: 'Bioinformatics Researcher'
  },
  {
    text: 'As an AI researcher, I need substantial GPU resources to train models. Calctra allows me to access high-performance computing resources on demand without having to invest in expensive hardware.',
    author: 'Dr. Li',
    role: 'AI Algorithm Expert'
  },
  {
    text: 'Our data center servers are basically idle at night. Through Calctra, these resources now generate additional income while helping researchers accelerate their work. It\'s a win-win situation.',
    author: 'Director Wang',
    role: 'Data Center Operations'
  }
];

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  return (
    <Container>
      {/* Hero Section */}
      <HeroSection>
        <Overlay />
        <HeroContent>
          <LogoContainer>
            <img src="/images/logo.png" alt="Calctra Logo" />
          </LogoContainer>
          <Tagline>Decentralized Scientific Computing Resource Marketplace</Tagline>
          <SubTagline>
            Connecting global idle computing resources with research needs, 
            making high-performance computing accessible and accelerating 
            scientific innovation and breakthroughs
          </SubTagline>
          <ButtonGroup>
            <Link href="/marketplace">
              <Button>Browse Resources</Button>
            </Link>
            <Link href="/provider/add-resource">
              <OutlineButton>Provide Resources</OutlineButton>
            </Link>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>
      
      {/* Features Section */}
      <Section>
        <SectionHeader>
          <SectionTitle>Platform Features</SectionTitle>
          <SectionSubtitle>
            Calctra builds an efficient, secure, and decentralized scientific 
            computing resource ecosystem through these core features
          </SectionSubtitle>
        </SectionHeader>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <FeatureCard key={index}>
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>
      
      {/* How It Works Section */}
      <HowItWorksSection>
        <SectionHeader>
          <SectionTitle>Platform Workflow</SectionTitle>
          <SectionSubtitle>
            Understand how Calctra connects global scientific computing resources 
            with demands to build a frictionless computing resource sharing ecosystem
          </SectionSubtitle>
        </SectionHeader>
        
        <Timeline>
          {howItWorks.map((step, index) => (
            <TimelineItem key={index}>
              <TimelineNumber>{step.number}</TimelineNumber>
              <TimelineContent>
                <TimelineTitle>{step.title}</TimelineTitle>
                <TimelineDescription>{step.description}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </HowItWorksSection>
      
      {/* Stats Section */}
      <StatsSection>
        <SectionHeader>
          <SectionTitle style={{ color: 'white' }}>Platform Statistics</SectionTitle>
          <SectionSubtitle style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Calctra has accumulated a large number of computing resources and users,
            providing efficient and reliable computing power for researchers worldwide
          </SectionSubtitle>
        </SectionHeader>
        
        <StatsGrid>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </StatsGrid>
      </StatsSection>
      
      {/* Testimonials Section */}
      <TestimonialsSection>
        <SectionHeader>
          <SectionTitle>User Testimonials</SectionTitle>
          <SectionSubtitle>
            Hear how our users evaluate the value Calctra brings to their work
          </SectionSubtitle>
        </SectionHeader>
        
        <TestimonialCard>
          <QuoteIcon>"</QuoteIcon>
          <TestimonialText>
            {testimonials[currentTestimonial].text}
          </TestimonialText>
          <TestimonialAuthor>
            {testimonials[currentTestimonial].author}
          </TestimonialAuthor>
          <TestimonialRole>
            {testimonials[currentTestimonial].role}
          </TestimonialRole>
          
          <div style={{ marginTop: '2rem' }}>
            <button
              onClick={prevTestimonial}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginRight: '1rem',
                color: '#4361ee'
              }}
            >
              ←
            </button>
            <button
              onClick={nextTestimonial}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#4361ee'
              }}
            >
              →
            </button>
          </div>
        </TestimonialCard>
      </TestimonialsSection>
      
      {/* CTA Section */}
      <CtaSection>
        <SectionHeader>
          <SectionTitle>Join the Calctra Ecosystem</SectionTitle>
          <SectionSubtitle>
            Whether you're a researcher looking for computing resources or have 
            idle computing power seeking returns, Calctra offers the ideal solution
          </SectionSubtitle>
        </SectionHeader>
        
        <ButtonGroup>
          <Link href="/account">
            <Button>Create Account</Button>
          </Link>
          <Link href="/marketplace/create-demand">
            <OutlineButton style={{ color: '#3a0ca3', borderColor: '#3a0ca3' }}>
              Publish Demand
            </OutlineButton>
          </Link>
        </ButtonGroup>
      </CtaSection>
      
      {/* Footer */}
      <Footer>
        <FooterContent>
          <div>
            <FooterLogo>
              <img src="/images/logo.png" alt="Calctra Logo" />
            </FooterLogo>
            <FooterDescription>
              Calctra is a decentralized scientific computing resource trading platform
              that connects global computing resources with research demands,
              accelerating scientific innovation and breakthroughs.
            </FooterDescription>
          </div>
          
          <div>
            <FooterTitle>Platform</FooterTitle>
            <FooterLinks>
              <FooterLink>
                <Link href="/marketplace">Resource Market</Link>
              </FooterLink>
              <FooterLink>
                <Link href="/marketplace/create-demand">Publish Demand</Link>
              </FooterLink>
              <FooterLink>
                <Link href="/provider/add-resource">Provide Resources</Link>
              </FooterLink>
              <FooterLink>
                <Link href="/account">My Account</Link>
              </FooterLink>
            </FooterLinks>
          </div>
          
          <div>
            <FooterTitle>Resources</FooterTitle>
            <FooterLinks>
              <FooterLink>
                <Link href="#">Documentation</Link>
              </FooterLink>
              <FooterLink>
                <Link href="#">API Reference</Link>
              </FooterLink>
              <FooterLink>
                <Link href="#">Whitepaper</Link>
              </FooterLink>
              <FooterLink>
                <Link href="#">Provider Guide</Link>
              </FooterLink>
            </FooterLinks>
          </div>
          
          <div>
            <FooterTitle>About Us</FooterTitle>
            <FooterLinks>
              <FooterLink>
                <Link href="#">Team</Link>
              </FooterLink>
              <FooterLink>
                <Link href="#">Partners</Link>
              </FooterLink>
              <FooterLink>
                <Link href="#">Contact Us</Link>
              </FooterLink>
              <FooterLink>
                <Link href="#">Privacy Policy</Link>
              </FooterLink>
            </FooterLinks>
          </div>
        </FooterContent>
        
        <Copyright>
          © {new Date().getFullYear()} Calctra. All rights reserved.
        </Copyright>
      </Footer>
    </Container>
  );
} 