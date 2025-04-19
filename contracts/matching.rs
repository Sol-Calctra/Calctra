// matching.rs - Resource Matching Contract for Calctra Platform
use anchor_lang::prelude::*;
use anchor_spl::token::{self, TokenAccount};

declare_id!("CALMtch7YRx6nHFg3PZx8vQ9Dw2KeLjyhwRMMbmGj4");

#[program]
pub mod matching_engine {
    use super::*;

    // Match a demand with a resource
    pub fn create_match(
        ctx: Context<CreateMatch>,
        start_time: i64,
        end_time: i64,
        price_per_hour: u64,
        total_price: u64,
        match_score: u8,
        escrow_amount: u64,
    ) -> Result<()> {
        let match_record = &mut ctx.accounts.match_record;
        let demand = &ctx.accounts.demand;
        let resource = &ctx.accounts.resource;
        let matcher = &ctx.accounts.matcher;
        
        // Validate time parameters
        require!(
            end_time > start_time,
            MatchingError::InvalidTimeRange
        );
        
        // Validate price
        require!(
            price_per_hour > 0 && total_price > 0,
            MatchingError::InvalidPrice
        );
        
        match_record.demand = demand.key();
        match_record.resource = resource.key();
        match_record.consumer = *ctx.accounts.consumer.key;
        match_record.provider = *ctx.accounts.provider.key;
        match_record.matcher = matcher.key();
        match_record.start_time = start_time;
        match_record.end_time = end_time;
        match_record.price_per_hour = price_per_hour;
        match_record.total_price = total_price;
        match_record.match_score = match_score;
        match_record.escrow_amount = escrow_amount;
        match_record.status = MatchStatus::Created;
        match_record.created_at = Clock::get()?.unix_timestamp;
        match_record.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(MatchCreated {
            match_id: match_record.key(),
            demand: match_record.demand,
            resource: match_record.resource,
            consumer: match_record.consumer,
            provider: match_record.provider,
            total_price: match_record.total_price,
        });

        Ok(())
    }

    // Accept a match (by consumer)
    pub fn accept_match_consumer(ctx: Context<AcceptMatchConsumer>) -> Result<()> {
        let match_record = &mut ctx.accounts.match_record;
        let consumer = &ctx.accounts.consumer;
        
        // Verify the consumer matches the demand's consumer
        require!(
            match_record.consumer == consumer.key(),
            MatchingError::UnauthorizedConsumerAction
        );
        
        // Only created matches can be accepted
        require!(
            match_record.status == MatchStatus::Created,
            MatchingError::InvalidMatchStatus
        );
        
        match_record.status = MatchStatus::ConsumerAccepted;
        match_record.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(MatchStatusUpdated {
            match_id: match_record.key(),
            status: match_record.status,
        });

        Ok(())
    }

    // Accept a match (by provider)
    pub fn accept_match_provider(ctx: Context<AcceptMatchProvider>) -> Result<()> {
        let match_record = &mut ctx.accounts.match_record;
        let provider = &ctx.accounts.provider;
        
        // Verify the provider matches the resource's provider
        require!(
            match_record.provider == provider.key(),
            MatchingError::UnauthorizedProviderAction
        );
        
        // Only consumer-accepted matches can be accepted by provider
        require!(
            match_record.status == MatchStatus::ConsumerAccepted,
            MatchingError::InvalidMatchStatus
        );
        
        match_record.status = MatchStatus::Confirmed;
        match_record.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(MatchStatusUpdated {
            match_id: match_record.key(),
            status: match_record.status,
        });

        Ok(())
    }

    // Reject a match (by consumer or provider)
    pub fn reject_match(ctx: Context<RejectMatch>) -> Result<()> {
        let match_record = &mut ctx.accounts.match_record;
        let signer = &ctx.accounts.signer;
        
        // Verify the signer is either consumer or provider
        require!(
            match_record.consumer == signer.key() || match_record.provider == signer.key(),
            MatchingError::UnauthorizedRejection
        );
        
        // Only matches that are not in progress or completed can be rejected
        require!(
            match_record.status == MatchStatus::Created || 
            match_record.status == MatchStatus::ConsumerAccepted,
            MatchingError::CannotRejectActiveMatch
        );
        
        match_record.status = MatchStatus::Rejected;
        match_record.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(MatchStatusUpdated {
            match_id: match_record.key(),
            status: match_record.status,
        });

        Ok(())
    }

    // Complete a match
    pub fn complete_match(ctx: Context<CompleteMatch>) -> Result<()> {
        let match_record = &mut ctx.accounts.match_record;
        let provider = &ctx.accounts.provider;
        
        // Verify the provider matches the resource's provider
        require!(
            match_record.provider == provider.key(),
            MatchingError::UnauthorizedProviderAction
        );
        
        // Only confirmed matches can be completed
        require!(
            match_record.status == MatchStatus::Confirmed,
            MatchingError::InvalidMatchStatusForCompletion
        );
        
        match_record.status = MatchStatus::Completed;
        match_record.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(MatchStatusUpdated {
            match_id: match_record.key(),
            status: match_record.status,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMatch<'info> {
    #[account(init, payer = matcher, space = 8 + Match::LEN)]
    pub match_record: Account<'info, Match>,
    /// CHECK: We only use this for reading public key
    pub demand: AccountInfo<'info>,
    /// CHECK: We only use this for reading public key
    pub resource: AccountInfo<'info>,
    /// CHECK: We only use this for reading public key
    pub consumer: AccountInfo<'info>,
    /// CHECK: We only use this for reading public key
    pub provider: AccountInfo<'info>,
    #[account(mut)]
    pub matcher: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptMatchConsumer<'info> {
    #[account(mut)]
    pub match_record: Account<'info, Match>,
    pub consumer: Signer<'info>,
}

#[derive(Accounts)]
pub struct AcceptMatchProvider<'info> {
    #[account(mut)]
    pub match_record: Account<'info, Match>,
    pub provider: Signer<'info>,
}

#[derive(Accounts)]
pub struct RejectMatch<'info> {
    #[account(mut)]
    pub match_record: Account<'info, Match>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CompleteMatch<'info> {
    #[account(mut)]
    pub match_record: Account<'info, Match>,
    pub provider: Signer<'info>,
}

#[account]
pub struct Match {
    pub demand: Pubkey,                  // Demand account address
    pub resource: Pubkey,                // Resource account address
    pub consumer: Pubkey,                // Consumer address
    pub provider: Pubkey,                // Provider address
    pub matcher: Pubkey,                 // Matcher address (who created the match)
    pub start_time: i64,                 // Start time for resource usage
    pub end_time: i64,                   // End time for resource usage
    pub price_per_hour: u64,             // Agreed price per hour
    pub total_price: u64,                // Total price for the match
    pub match_score: u8,                 // Match score (0-100)
    pub escrow_amount: u64,              // Amount in escrow for the match
    pub status: MatchStatus,             // Current status of the match
    pub created_at: i64,                 // Creation timestamp
    pub updated_at: i64,                 // Last update timestamp
}

impl Match {
    pub const LEN: usize = 32 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 1 + 8 + 1 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum MatchStatus {
    Created,
    ConsumerAccepted,
    Confirmed,
    Rejected,
    Completed,
    Disputed,
}

#[event]
pub struct MatchCreated {
    pub match_id: Pubkey,
    pub demand: Pubkey,
    pub resource: Pubkey,
    pub consumer: Pubkey,
    pub provider: Pubkey,
    pub total_price: u64,
}

#[event]
pub struct MatchStatusUpdated {
    pub match_id: Pubkey,
    pub status: MatchStatus,
}

#[error_code]
pub enum MatchingError {
    #[msg("End time must be after start time")]
    InvalidTimeRange,
    #[msg("Price per hour and total price must be greater than zero")]
    InvalidPrice,
    #[msg("Only the consumer can accept this match")]
    UnauthorizedConsumerAction,
    #[msg("Only the provider can accept this match")]
    UnauthorizedProviderAction,
    #[msg("Only the consumer or provider can reject this match")]
    UnauthorizedRejection,
    #[msg("Match status is not appropriate for this action")]
    InvalidMatchStatus,
    #[msg("Cannot reject a match that is already in progress or completed")]
    CannotRejectActiveMatch,
    #[msg("Only confirmed matches can be completed")]
    InvalidMatchStatusForCompletion,
} 