// demand.rs - Demand Management Contract for Calctra Platform
use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount};

declare_id!("CALDmnd3Yx5rWmHQixRYCj9q2ESLNp7eMm4mnKGgJTh");

#[program]
pub mod demand_manager {
    use super::*;

    // Publish a new computation demand
    pub fn publish_demand(
        ctx: Context<PublishDemand>,
        title: String,
        description: String,
        resource_type: ResourceType,
        min_cores: u16,
        min_memory_gb: u16,
        min_storage_gb: u32,
        gpu_required: bool,
        start_time: i64,
        end_time: i64,
        max_price_per_hour: u64,
        total_budget: u64,
        preferred_regions: Vec<String>,
    ) -> Result<()> {
        let demand = &mut ctx.accounts.demand;
        let consumer = &ctx.accounts.consumer;

        // Validate time parameters
        require!(
            end_time > start_time,
            DemandError::InvalidTimeRange
        );
        
        // Validate budget
        require!(
            total_budget > 0,
            DemandError::InvalidBudget
        );
        
        demand.title = title;
        demand.description = description;
        demand.resource_type = resource_type;
        demand.min_cores = min_cores;
        demand.min_memory_gb = min_memory_gb;
        demand.min_storage_gb = min_storage_gb;
        demand.gpu_required = gpu_required;
        demand.consumer = consumer.key();
        demand.start_time = start_time;
        demand.end_time = end_time;
        demand.max_price_per_hour = max_price_per_hour;
        demand.total_budget = total_budget;
        demand.preferred_regions = preferred_regions;
        demand.status = DemandStatus::Open;
        demand.created_at = Clock::get()?.unix_timestamp;
        demand.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(DemandPublished {
            demand_id: demand.key(),
            consumer: consumer.key(),
            title: demand.title.clone(),
            resource_type: demand.resource_type,
            total_budget: demand.total_budget,
        });

        Ok(())
    }

    // Update demand status
    pub fn update_demand_status(
        ctx: Context<UpdateDemandStatus>,
        status: DemandStatus,
    ) -> Result<()> {
        let demand = &mut ctx.accounts.demand;
        let consumer = &ctx.accounts.consumer;
        
        // Verify the consumer is the demand creator
        require!(
            demand.consumer == consumer.key(),
            DemandError::UnauthorizedStatusUpdate
        );
        
        demand.status = status;
        demand.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(DemandStatusUpdated {
            demand_id: demand.key(),
            status,
        });

        Ok(())
    }

    // Update demand budget
    pub fn update_demand_budget(
        ctx: Context<UpdateDemandBudget>,
        max_price_per_hour: u64,
        total_budget: u64,
    ) -> Result<()> {
        let demand = &mut ctx.accounts.demand;
        let consumer = &ctx.accounts.consumer;
        
        // Verify the consumer is the demand creator
        require!(
            demand.consumer == consumer.key(),
            DemandError::UnauthorizedBudgetUpdate
        );
        
        // Validate budget
        require!(
            total_budget > 0,
            DemandError::InvalidBudget
        );
        
        demand.max_price_per_hour = max_price_per_hour;
        demand.total_budget = total_budget;
        demand.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(DemandBudgetUpdated {
            demand_id: demand.key(),
            max_price_per_hour,
            total_budget,
        });

        Ok(())
    }

    // Cancel a demand
    pub fn cancel_demand(ctx: Context<CancelDemand>) -> Result<()> {
        let demand = &mut ctx.accounts.demand;
        let consumer = &ctx.accounts.consumer;
        
        // Verify the consumer is the demand creator
        require!(
            demand.consumer == consumer.key(),
            DemandError::UnauthorizedCancellation
        );
        
        // Only open demands can be cancelled
        require!(
            demand.status == DemandStatus::Open,
            DemandError::CannotCancelFulfilledDemand
        );
        
        demand.status = DemandStatus::Cancelled;
        demand.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(DemandCancelled {
            demand_id: demand.key(),
            consumer: consumer.key(),
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct PublishDemand<'info> {
    #[account(init, payer = consumer, space = 8 + Demand::LEN)]
    pub demand: Account<'info, Demand>,
    #[account(mut)]
    pub consumer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateDemandStatus<'info> {
    #[account(mut)]
    pub demand: Account<'info, Demand>,
    pub consumer: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateDemandBudget<'info> {
    #[account(mut)]
    pub demand: Account<'info, Demand>,
    pub consumer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CancelDemand<'info> {
    #[account(mut)]
    pub demand: Account<'info, Demand>,
    pub consumer: Signer<'info>,
}

#[account]
pub struct Demand {
    pub title: String,                     // Demand title
    pub description: String,               // Detailed description
    pub resource_type: ResourceType,       // Type of resource needed
    pub min_cores: u16,                    // Minimum CPU cores required
    pub min_memory_gb: u16,                // Minimum RAM in GB
    pub min_storage_gb: u32,               // Minimum storage in GB
    pub gpu_required: bool,                // Whether GPU is needed
    pub consumer: Pubkey,                  // Demand creator address
    pub start_time: i64,                   // Start time for computation
    pub end_time: i64,                     // End time for computation
    pub max_price_per_hour: u64,           // Maximum price willing to pay per hour
    pub total_budget: u64,                 // Total budget for the computation
    pub preferred_regions: Vec<String>,    // Preferred geographical regions
    pub status: DemandStatus,              // Current status
    pub created_at: i64,                   // Creation timestamp
    pub updated_at: i64,                   // Last update timestamp
}

impl Demand {
    pub const LEN: usize = 512; // Approximation, should be calculated precisely in production
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ResourceType {
    CPU,
    GPU,
    Storage,
    Hybrid,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum DemandStatus {
    Open,
    Matched,
    InProgress,
    Completed,
    Cancelled,
    Failed,
}

#[event]
pub struct DemandPublished {
    pub demand_id: Pubkey,
    pub consumer: Pubkey,
    pub title: String,
    pub resource_type: ResourceType,
    pub total_budget: u64,
}

#[event]
pub struct DemandStatusUpdated {
    pub demand_id: Pubkey,
    pub status: DemandStatus,
}

#[event]
pub struct DemandBudgetUpdated {
    pub demand_id: Pubkey,
    pub max_price_per_hour: u64,
    pub total_budget: u64,
}

#[event]
pub struct DemandCancelled {
    pub demand_id: Pubkey,
    pub consumer: Pubkey,
}

#[error_code]
pub enum DemandError {
    #[msg("End time must be after start time")]
    InvalidTimeRange,
    #[msg("Budget must be greater than zero")]
    InvalidBudget,
    #[msg("Only the demand creator can update status")]
    UnauthorizedStatusUpdate,
    #[msg("Only the demand creator can update budget")]
    UnauthorizedBudgetUpdate,
    #[msg("Only the demand creator can cancel this demand")]
    UnauthorizedCancellation,
    #[msg("Cannot cancel a demand that has already been matched or is in progress")]
    CannotCancelFulfilledDemand,
} 