import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// GET /api/resources - Get all resources
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const resourceType = url.searchParams.get('resourceType');
    const minCores = url.searchParams.get('minCores');
    const minMemory = url.searchParams.get('minMemory');
    const region = url.searchParams.get('region');
    const maxPricePerHour = url.searchParams.get('maxPricePerHour');
    const providerId = url.searchParams.get('providerId');
    const status = url.searchParams.get('status');
    
    // In a real implementation, this would fetch from a database
    const mockResources = [
      {
        id: 'resource-1',
        name: 'High Performance Computing Node',
        description: 'Powerful computing node with multi-core CPU and large memory',
        providerId: 'provider-456',
        resourceType: 'CPU',
        cores: 32,
        memory: 128,
        storage: 2000,
        gpuModel: null,
        gpuCount: 0,
        processorSpeed: 3.5,
        benchmarkScore: 9600,
        availableFrom: '2025-05-15T00:00:00Z',
        availableTo: '2025-12-31T23:59:59Z',
        pricePerHour: 2.5,
        minimumRentalHours: 1,
        region: 'us-east',
        country: 'USA',
        status: 'available',
        created: '2025-05-01T10:15:00Z',
        updated: '2025-05-01T10:15:00Z'
      },
      {
        id: 'resource-2',
        name: 'GPU Compute Node',
        description: 'GPU-accelerated computing node ideal for ML workloads',
        providerId: 'provider-789',
        resourceType: 'GPU',
        cores: 16,
        memory: 64,
        storage: 1000,
        gpuModel: 'NVIDIA RTX A6000',
        gpuCount: 2,
        processorSpeed: 2.9,
        benchmarkScore: 18500,
        availableFrom: '2025-06-01T00:00:00Z',
        availableTo: '2025-09-30T23:59:59Z',
        pricePerHour: 4.75,
        minimumRentalHours: 4,
        region: 'eu-west',
        country: 'Germany',
        status: 'available',
        created: '2025-05-02T14:30:00Z',
        updated: '2025-05-03T09:15:00Z'
      },
      {
        id: 'resource-3',
        name: 'Storage Optimized Node',
        description: 'High-capacity storage node with fast I/O performance',
        providerId: 'provider-456',
        resourceType: 'Storage',
        cores: 8,
        memory: 32,
        storage: 10000,
        gpuModel: null,
        gpuCount: 0,
        processorSpeed: 2.4,
        benchmarkScore: 4200,
        availableFrom: '2025-05-20T00:00:00Z',
        availableTo: '2026-05-19T23:59:59Z',
        pricePerHour: 1.8,
        minimumRentalHours: 24,
        region: 'ap-southeast',
        country: 'Singapore',
        status: 'available',
        created: '2025-05-10T08:45:00Z',
        updated: '2025-05-10T08:45:00Z'
      }
    ];
    
    // Filter resources based on query parameters
    let filteredResources = [...mockResources];
    
    if (resourceType) {
      filteredResources = filteredResources.filter(resource => 
        resource.resourceType.toLowerCase() === resourceType.toLowerCase()
      );
    }
    
    if (minCores) {
      const cores = parseInt(minCores);
      if (!isNaN(cores)) {
        filteredResources = filteredResources.filter(resource => resource.cores >= cores);
      }
    }
    
    if (minMemory) {
      const memory = parseInt(minMemory);
      if (!isNaN(memory)) {
        filteredResources = filteredResources.filter(resource => resource.memory >= memory);
      }
    }
    
    if (region) {
      filteredResources = filteredResources.filter(resource => 
        resource.region.toLowerCase().includes(region.toLowerCase())
      );
    }
    
    if (maxPricePerHour) {
      const price = parseFloat(maxPricePerHour);
      if (!isNaN(price)) {
        filteredResources = filteredResources.filter(resource => resource.pricePerHour <= price);
      }
    }
    
    if (providerId) {
      filteredResources = filteredResources.filter(resource => resource.providerId === providerId);
    }
    
    if (status) {
      filteredResources = filteredResources.filter(resource => resource.status === status);
    }
    
    return NextResponse.json({ resources: filteredResources });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'name', 'description', 'providerId', 'resourceType',
      'cores', 'memory', 'storage', 'processorSpeed',
      'availableFrom', 'availableTo', 'pricePerHour',
      'minimumRentalHours', 'region', 'country'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate dates
    const availableFrom = new Date(body.availableFrom);
    const availableTo = new Date(body.availableTo);
    
    if (isNaN(availableFrom.getTime()) || isNaN(availableTo.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    if (availableTo <= availableFrom) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }
    
    // Additional validations
    if (typeof body.cores !== 'number' || body.cores <= 0) {
      return NextResponse.json(
        { error: 'Cores must be a positive number' },
        { status: 400 }
      );
    }
    
    if (typeof body.memory !== 'number' || body.memory <= 0) {
      return NextResponse.json(
        { error: 'Memory must be a positive number' },
        { status: 400 }
      );
    }
    
    if (typeof body.storage !== 'number' || body.storage <= 0) {
      return NextResponse.json(
        { error: 'Storage must be a positive number' },
        { status: 400 }
      );
    }
    
    if (typeof body.pricePerHour !== 'number' || body.pricePerHour <= 0) {
      return NextResponse.json(
        { error: 'Price per hour must be a positive number' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would create a resource in the database
    // and interact with the blockchain
    const newResource = {
      id: `resource-${Date.now()}`,
      ...body,
      status: 'available',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    return NextResponse.json(
      { message: 'Resource created successfully', resource: newResource },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

// PATCH /api/resources/:resourceId - Update a resource
export async function PATCH(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const resourceId = params.resourceId || request.url.split('/').pop();
    
    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // In a real implementation, this would first check if the resource exists
    // and then update it in the database
    const updatedResource = {
      id: resourceId,
      ...body,
      updated: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: 'Resource updated successfully',
      resource: updatedResource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/:resourceId - Delete a resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const resourceId = params.resourceId || request.url.split('/').pop();
    
    if (!resourceId) {
      return NextResponse.json(
        { error: 'Resource ID is required' },
        { status: 400 }
      );
    }
    
    // In a real implementation, this would delete the resource from the database
    // or mark it as deleted
    
    return NextResponse.json({
      message: 'Resource deleted successfully',
      id: resourceId
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
} 