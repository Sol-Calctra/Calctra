// resource.rs - Resource Management Contract for Calctra Platform
use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount};

declare_id!("CALRsrce5gHmzW8bpPvqQhCTf7Zpyy6wdxfKdQwZMDj");

#[program]
pub mod resource_manager {
    use super::*;

    // Register a new computing resource
    pub fn register_resource(
        ctx: Context<RegisterResource>,
        name: String,
        resource_type: ResourceType,
        cores: u16,
        memory_gb: u16,
        storage_gb: u32,
        price_per_hour: u64,
        min_rental_time_hours: u16,
        max_rental_time_hours: u16,
        region: String,
        location: String,
        benchmark_score: u32,
    ) -> Result<()> {
        let resource = &mut ctx.accounts.resource;
        let provider = &ctx.accounts.provider;
        
        resource.name = name;
        resource.resource_type = resource_type;
        resource.cores = cores;
        resource.memory_gb = memory_gb;
        resource.storage_gb = storage_gb;
        resource.provider = provider.key();
        resource.price_per_hour = price_per_hour;
        resource.min_rental_time_hours = min_rental_time_hours;
        resource.max_rental_time_hours = max_rental_time_hours;
        resource.region = region;
        resource.location = location;
        resource.benchmark_score = benchmark_score;
        resource.status = ResourceStatus::Available;
        resource.utilization_rate = 0;
        resource.created_at = Clock::get()?.unix_timestamp;
        resource.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(ResourceRegistered {
            resource_id: resource.key(),
            provider: provider.key(),
            name: resource.name.clone(),
            resource_type: resource.resource_type,
            price_per_hour: resource.price_per_hour,
        });

        Ok(())
    }

    // Update resource availability status
    pub fn update_resource_status(
        ctx: Context<UpdateResourceStatus>,
        status: ResourceStatus,
    ) -> Result<()> {
        let resource = &mut ctx.accounts.resource;
        let provider = &ctx.accounts.provider;
        
        // Verify the provider is the owner
        require!(
            resource.provider == provider.key(),
            ResourceError::UnauthorizedStatusUpdate
        );
        
        resource.status = status;
        resource.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(ResourceStatusUpdated {
            resource_id: resource.key(),
            status,
        });

        Ok(())
    }

    // Update resource pricing
    pub fn update_resource_pricing(
        ctx: Context<UpdateResourcePricing>,
        price_per_hour: u64,
        min_rental_time_hours: u16,
        max_rental_time_hours: u16,
    ) -> Result<()> {
        let resource = &mut ctx.accounts.resource;
        let provider = &ctx.accounts.provider;
        
        // Verify the provider is the owner
        require!(
            resource.provider == provider.key(),
            ResourceError::UnauthorizedPricingUpdate
        );
        
        resource.price_per_hour = price_per_hour;
        resource.min_rental_time_hours = min_rental_time_hours;
        resource.max_rental_time_hours = max_rental_time_hours;
        resource.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(ResourcePricingUpdated {
            resource_id: resource.key(),
            price_per_hour,
            min_rental_time_hours,
            max_rental_time_hours,
        });

        Ok(())
    }

    // Delete a resource
    pub fn delete_resource(ctx: Context<DeleteResource>) -> Result<()> {
        let resource = &ctx.accounts.resource;
        let provider = &ctx.accounts.provider;
        
        // Verify the provider is the owner
        require!(
            resource.provider == provider.key(),
            ResourceError::UnauthorizedDeletion
        );
        
        emit!(ResourceDeleted {
            resource_id: resource.key(),
            provider: provider.key(),
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterResource<'info> {
    #[account(init, payer = provider, space = 8 + Resource::LEN)]
    pub resource: Account<'info, Resource>,
    #[account(mut)]
    pub provider: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateResourceStatus<'info> {
    #[account(mut)]
    pub resource: Account<'info, Resource>,
    pub provider: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateResourcePricing<'info> {
    #[account(mut)]
    pub resource: Account<'info, Resource>,
    pub provider: Signer<'info>,
}

#[derive(Accounts)]
pub struct DeleteResource<'info> {
    #[account(mut, close = provider)]
    pub resource: Account<'info, Resource>,
    #[account(mut)]
    pub provider: Signer<'info>,
}

#[account]
pub struct Resource {
    pub name: String,                      // Resource name
    pub resource_type: ResourceType,       // Type of resource (CPU, GPU, etc.)
    pub cores: u16,                        // Number of CPU cores
    pub memory_gb: u16,                    // RAM in GB
    pub storage_gb: u32,                   // Storage in GB
    pub provider: Pubkey,                  // Resource provider address
    pub price_per_hour: u64,               // Price per hour in lamports
    pub min_rental_time_hours: u16,        // Minimum rental duration
    pub max_rental_time_hours: u16,        // Maximum rental duration
    pub region: String,                    // Geographical region
    pub location: String,                  // More specific location
    pub benchmark_score: u32,              // Performance benchmark score
    pub status: ResourceStatus,            // Current availability status
    pub utilization_rate: u8,              // Current utilization (0-100)
    pub created_at: i64,                   // Creation timestamp
    pub updated_at: i64,                   // Last update timestamp
}

impl Resource {
    pub const LEN: usize = 256; // Approximation, should be calculated precisely in production
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ResourceType {
    CPU,
    GPU,
    Storage,
    Hybrid,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ResourceStatus {
    Available,
    InUse,
    Maintenance,
    Offline,
}

#[event]
pub struct ResourceRegistered {
    pub resource_id: Pubkey,
    pub provider: Pubkey,
    pub name: String,
    pub resource_type: ResourceType,
    pub price_per_hour: u64,
}

#[event]
pub struct ResourceStatusUpdated {
    pub resource_id: Pubkey,
    pub status: ResourceStatus,
}

#[event]
pub struct ResourcePricingUpdated {
    pub resource_id: Pubkey,
    pub price_per_hour: u64,
    pub min_rental_time_hours: u16,
    pub max_rental_time_hours: u16,
}

#[event]
pub struct ResourceDeleted {
    pub resource_id: Pubkey,
    pub provider: Pubkey,
}

#[error_code]
pub enum ResourceError {
    #[msg("Only the resource provider can update status")]
    UnauthorizedStatusUpdate,
    #[msg("Only the resource provider can update pricing")]
    UnauthorizedPricingUpdate,
    #[msg("Only the resource provider can delete this resource")]
    UnauthorizedDeletion,
} 