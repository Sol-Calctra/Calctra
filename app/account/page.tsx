'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

// 样式组件
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #3a0ca3;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid ${(props: { active: boolean }) => props.active ? '#4361ee' : 'transparent'};
  color: ${(props: { active: boolean }) => props.active ? '#3a0ca3' : '#555'};
  font-weight: ${(props: { active: boolean }) => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #3a0ca3;
  }
`;

const ProfileSection = styled.div`
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #4361ee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 3rem;
  font-weight: bold;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #3a0ca3;
`;

const UserRole = styled.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #4361ee;
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const UserStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4361ee;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #555;
`;

const ProfileForm = styled.form`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  min-height: 100px;
  grid-column: 1 / -1;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
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
  justify-content: flex-end;
  gap: 1rem;
  grid-column: 1 / -1;
  margin-top: 1rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  color: #3a0ca3;
  margin: 0;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityInfo = styled.div`
  flex: 1;
`;

const ActivityType = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const ActivityDetails = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: #777;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  background-color: #4361ee;
  color: white;
  margin-left: 0.5rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: #555;
`;

const TabContent = styled.div`
  min-height: 300px;
`;

// 模拟数据
const mockUserData = {
  id: 'user_123',
  name: '赵科学家',
  email: 'scientist@example.com',
  bio: '量子计算和人工智能研究者，专注于复杂系统模拟。上海量子计算研究中心高级研究员，发表过15篇相关领域论文。',
  roles: ['CONSUMER', 'PROVIDER'],
  createdAt: new Date('2024-12-15'),
  wallet: {
    address: '0x1a2b3c4d5e6f7g8h9i0j',
    balance: 1250.75
  },
  stats: {
    completedDemands: 12,
    providedResources: 3,
    totalSpent: 3450.5,
    totalEarned: 1250.75,
    averageRating: 4.8
  },
  organization: '上海量子计算研究中心',
  country: '中国',
  website: 'https://example.com/scientist',
  preferredPaymentMethod: 'WALLET'
};

const mockActivities = [
  {
    id: 'activity_1',
    type: 'DEMAND_CREATED',
    details: {
      demandId: 'demand_789',
      title: '量子算法优化计算',
      budget: 500
    },
    time: new Date('2025-03-18T14:30:00')
  },
  {
    id: 'activity_2',
    type: 'RESOURCE_ADDED',
    details: {
      resourceId: 'resource_456',
      name: '高性能计算服务器',
      type: 'CPU'
    },
    time: new Date('2025-03-15T09:45:00')
  },
  {
    id: 'activity_3',
    type: 'PAYMENT_RECEIVED',
    details: {
      transactionId: 'tx_123',
      from: 'user_456',
      amount: 350.5
    },
    time: new Date('2025-03-12T11:20:00')
  },
  {
    id: 'activity_4',
    type: 'BID_SUBMITTED',
    details: {
      bidId: 'bid_789',
      demandId: 'demand_123',
      demandTitle: '基因序列分析计算',
      amount: 420.25
    },
    time: new Date('2025-03-10T16:05:00')
  },
  {
    id: 'activity_5',
    type: 'DEMAND_COMPLETED',
    details: {
      demandId: 'demand_456',
      title: '流体动力学模拟',
      rating: 5
    },
    time: new Date('2025-03-05T13:15:00')
  }
];

const mockTransactions = [
  {
    id: 'tx_1',
    type: 'PAYMENT_SENT',
    details: {
      to: 'provider_789',
      providerName: '高性能计算中心',
      demandId: 'demand_123',
      demandTitle: '基因序列分析计算'
    },
    amount: -420.25,
    time: new Date('2025-03-18T10:30:00')
  },
  {
    id: 'tx_2',
    type: 'PAYMENT_RECEIVED',
    details: {
      from: 'user_456',
      userName: '量子物理研究所',
      resourceId: 'resource_789',
      resourceName: '高性能计算服务器'
    },
    amount: 350.5,
    time: new Date('2025-03-12T11:20:00')
  },
  {
    id: 'tx_3',
    type: 'PLATFORM_FEE',
    details: {
      resourceId: 'resource_456',
      resourceName: 'GPU计算集群'
    },
    amount: -15.25,
    time: new Date('2025-03-10T14:45:00')
  },
  {
    id: 'tx_4',
    type: 'PAYMENT_RECEIVED',
    details: {
      from: 'user_789',
      userName: '医学AI研究团队',
      resourceId: 'resource_123',
      resourceName: 'TPU计算节点'
    },
    amount: 900.25,
    time: new Date('2025-03-05T09:15:00')
  }
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    bio: '',
    organization: '',
    country: '',
    website: '',
    preferredPaymentMethod: 'WALLET'
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // 模拟API请求
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 实际项目中这里会调用API
        await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
        
        setUserData(mockUserData);
        setActivities(mockActivities);
        setTransactions(mockTransactions);
        
        setProfileForm({
          name: mockUserData.name,
          email: mockUserData.email,
          bio: mockUserData.bio,
          organization: mockUserData.organization,
          country: mockUserData.country,
          website: mockUserData.website,
          preferredPaymentMethod: mockUserData.preferredPaymentMethod
        });
      } catch (error) {
        console.error('获取用户数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 实际项目中这里会调用API更新用户资料
      console.log('更新用户资料:', profileForm);
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟更新成功
      setUserData(prev => ({
        ...prev,
        name: profileForm.name,
        email: profileForm.email,
        bio: profileForm.bio,
        organization: profileForm.organization,
        country: profileForm.country,
        website: profileForm.website,
        preferredPaymentMethod: profileForm.preferredPaymentMethod
      }));
      
      setIsEditing(false);
    } catch (error) {
      console.error('更新用户资料失败:', error);
    }
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getActivityDescription = (activity) => {
    switch (activity.type) {
      case 'DEMAND_CREATED':
        return `Created a calculation demand "${activity.details.title}"`;
      case 'RESOURCE_ADDED':
        return `Added a calculation resource "${activity.details.name}"`;
      case 'PAYMENT_RECEIVED':
        return `Received payment ${activity.details.amount} CAL`;
      case 'BID_SUBMITTED':
        return `Submitted a bid for demand "${activity.details.demandTitle}"`;
      case 'DEMAND_COMPLETED':
        return `Completed a calculation demand "${activity.details.title}"`;
      default:
        return 'Performed an action';
    }
  };
  
  const getTransactionDescription = (transaction) => {
    switch (transaction.type) {
      case 'PAYMENT_SENT':
        return `Payment to ${transaction.details.providerName} - "${transaction.details.demandTitle}"`;
      case 'PAYMENT_RECEIVED':
        return `From ${transaction.details.userName} - "${transaction.details.resourceName}"`;
      case 'PLATFORM_FEE':
        return `Platform fee - "${transaction.details.resourceName}"`;
      default:
        return 'Transaction';
    }
  };
  
  if (loading) {
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>My Account</Title>
        <div>
          <UserRole>Balance: {userData.wallet.balance} CAL</UserRole>
        </div>
      </Header>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </Tab>
        <Tab 
          active={activeTab === 'activity'} 
          onClick={() => setActiveTab('activity')}
        >
          Recent Activity
        </Tab>
        <Tab 
          active={activeTab === 'transactions'} 
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </Tab>
      </TabsContainer>
      
      <TabContent>
        {activeTab === 'profile' && (
          <ProfileSection>
            <ProfileHeader>
              <Avatar>{userData.name[0]}</Avatar>
              <ProfileInfo>
                <UserName>{userData.name}</UserName>
                <div>
                  {userData.roles.includes('CONSUMER') && (
                    <UserRole>Consumer</UserRole>
                  )}
                  {userData.roles.includes('PROVIDER') && (
                    <UserRole style={{ marginLeft: '0.5rem' }}>Provider</UserRole>
                  )}
                </div>
                <div style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
                  Registration date: {formatDate(userData.createdAt)}
                </div>
                <UserStats>
                  <StatItem>
                    <StatValue>{userData.stats.completedDemands}</StatValue>
                    <StatLabel>Completed Demands</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{userData.stats.providedResources}</StatValue>
                    <StatLabel>Provided Resources</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{userData.stats.averageRating}</StatValue>
                    <StatLabel>Average Rating</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{userData.stats.totalSpent}</StatValue>
                    <StatLabel>Total Spent (CAL)</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>{userData.stats.totalEarned}</StatValue>
                    <StatLabel>Total Earned (CAL)</StatLabel>
                  </StatItem>
                </UserStats>
              </ProfileInfo>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </ProfileHeader>
            
            {isEditing ? (
              <ProfileForm onSubmit={handleProfileSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="organization">Organization/Institution</Label>
                  <Input
                    type="text"
                    id="organization"
                    name="organization"
                    value={profileForm.organization}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="country">Country/Region</Label>
                  <Input
                    type="text"
                    id="country"
                    name="country"
                    value={profileForm.country}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    type="url"
                    id="website"
                    name="website"
                    value={profileForm.website}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="preferredPaymentMethod">Preferred Payment Method</Label>
                  <Select
                    id="preferredPaymentMethod"
                    name="preferredPaymentMethod"
                    value={profileForm.preferredPaymentMethod}
                    onChange={handleInputChange}
                  >
                    <option value="WALLET">Wallet direct payment</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="bio">Personal Introduction</Label>
                  <TextArea
                    id="bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <ButtonsContainer>
                  <Button type="button" onClick={() => setIsEditing(false)} style={{ backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ddd' }}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </ButtonsContainer>
              </ProfileForm>
            ) : (
              <div>
                <h3 style={{ color: '#3a0ca3', marginBottom: '1rem' }}>Personal Introduction</h3>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{userData.bio}</p>
                
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#3a0ca3', marginBottom: '0.5rem' }}>Contact Information</h4>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Email:</strong> {userData.email}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Organization/Institution:</strong> {userData.organization}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Country/Region:</strong> {userData.country}
                    </div>
                    {userData.website && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Website:</strong> <a href={userData.website} target="_blank" rel="noopener noreferrer">{userData.website}</a>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 style={{ color: '#3a0ca3', marginBottom: '0.5rem' }}>Wallet Information</h4>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Wallet Address:</strong> {userData.wallet.address}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Preferred Payment Method:</strong> {
                        userData.preferredPaymentMethod === 'WALLET' ? 'Wallet direct payment' :
                        userData.preferredPaymentMethod === 'CREDIT_CARD' ? 'Credit Card' :
                        'Bank Transfer'
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ProfileSection>
        )}
        
        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            
            {activities.length > 0 ? (
              activities.map(activity => (
                <ActivityItem key={activity.id}>
                  <ActivityInfo>
                    <ActivityType>
                      {getActivityDescription(activity)}
                    </ActivityType>
                    <ActivityDetails>
                      {activity.type === 'DEMAND_CREATED' && (
                        <>Budget: {activity.details.budget} CAL</>
                      )}
                      {activity.type === 'RESOURCE_ADDED' && (
                        <>Resource Type: {activity.details.type}</>
                      )}
                      {activity.type === 'DEMAND_COMPLETED' && (
                        <>Rating: {activity.details.rating}/5</>
                      )}
                    </ActivityDetails>
                    <ActivityTime>{formatDate(activity.time)}</ActivityTime>
                  </ActivityInfo>
                  <div>
                    {activity.type === 'DEMAND_CREATED' && (
                      <Link href={`/marketplace/demand/${activity.details.demandId}`}>
                        <Button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Demand</Button>
                      </Link>
                    )}
                    {activity.type === 'RESOURCE_ADDED' && (
                      <Link href={`/provider/resources/${activity.details.resourceId}`}>
                        <Button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Resource</Button>
                      </Link>
                    )}
                    {activity.type === 'BID_SUBMITTED' && (
                      <Link href={`/marketplace/demand/${activity.details.demandId}`}>
                        <Button style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View Demand</Button>
                      </Link>
                    )}
                  </div>
                </ActivityItem>
              ))
            ) : (
              <EmptyState>
                <p>No activity records</p>
              </EmptyState>
            )}
          </Card>
        )}
        
        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
            </CardHeader>
            
            {transactions.length > 0 ? (
              transactions.map(transaction => (
                <ActivityItem key={transaction.id}>
                  <ActivityInfo>
                    <ActivityType>
                      {getTransactionDescription(transaction)}
                    </ActivityType>
                    <ActivityDetails>
                      <span style={{ 
                        color: transaction.amount > 0 ? '#2ecc71' : '#e74c3c',
                        fontWeight: 'bold'
                      }}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} CAL
                      </span>
                    </ActivityDetails>
                    <ActivityTime>{formatDate(transaction.time)}</ActivityTime>
                  </ActivityInfo>
                </ActivityItem>
              ))
            ) : (
              <EmptyState>
                <p>No transaction records</p>
              </EmptyState>
            )}
          </Card>
        )}
      </TabContent>
    </Container>
  );
} 