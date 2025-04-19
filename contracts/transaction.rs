// transaction.rs - Transaction Management Contract for Calctra Platform
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("CALTrxn8HfQVcfq2L9hJHTyvKS8MFALKvHt8DGwsWf");

#[program]
pub mod transaction_manager {
    use super::*;

    // Create an escrow transaction
    pub fn create_escrow(
        ctx: Context<CreateEscrow>,
        match_id: Pubkey,
        amount: u64,
        release_time: i64,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let consumer = &ctx.accounts.consumer;
        
        // Validate amount and time
        require!(
            amount > 0,
            TransactionError::InvalidAmount
        );
        
        require!(
            release_time > Clock::get()?.unix_timestamp,
            TransactionError::InvalidReleaseTime
        );
        
        // Initialize escrow account
        escrow.match_id = match_id;
        escrow.consumer = consumer.key();
        escrow.provider = ctx.accounts.provider.key();
        escrow.amount = amount;
        escrow.release_time = release_time;
        escrow.status = EscrowStatus::Created;
        escrow.created_at = Clock::get()?.unix_timestamp;
        escrow.updated_at = Clock::get()?.unix_timestamp;
        
        // Transfer tokens from consumer to escrow account
        let cpi_accounts = Transfer {
            from: ctx.accounts.consumer_token_account.to_account_info(),
            to: ctx.accounts.escrow_token_account.to_account_info(),
            authority: consumer.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;
        
        emit!(EscrowCreated {
            escrow_id: escrow.key(),
            match_id: escrow.match_id,
            consumer: escrow.consumer,
            provider: escrow.provider,
            amount: escrow.amount,
        });

        Ok(())
    }

    // Release funds from escrow to provider
    pub fn release_funds(ctx: Context<ReleaseFunds>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let signer = &ctx.accounts.signer;
        
        // Check if release is authorized
        let current_time = Clock::get()?.unix_timestamp;
        
        // Either the consumer can release, or anyone can release after release_time
        if current_time < escrow.release_time {
            // Before release time, only consumer can release
            require!(
                escrow.consumer == signer.key(),
                TransactionError::UnauthorizedRelease
            );
        }
        
        // Check escrow status
        require!(
            escrow.status == EscrowStatus::Created,
            TransactionError::InvalidEscrowStatus
        );
        
        // Update escrow status
        escrow.status = EscrowStatus::Released;
        escrow.updated_at = current_time;
        
        // Transfer funds from escrow to provider
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.provider_token_account.to_account_info(),
            authority: ctx.accounts.escrow_authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let seeds = &[
            b"escrow".as_ref(),
            escrow.key().as_ref(),
            &[*ctx.bumps.get("escrow_authority").unwrap()],
        ];
        let signer_seeds = &[&seeds[..]];
        
        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program,
            cpi_accounts,
            signer_seeds,
        );
        
        token::transfer(cpi_ctx, escrow.amount)?;
        
        emit!(EscrowReleased {
            escrow_id: escrow.key(),
            match_id: escrow.match_id,
            amount: escrow.amount,
            released_by: signer.key(),
        });

        Ok(())
    }

    // Refund escrow to consumer
    pub fn refund_escrow(ctx: Context<RefundEscrow>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let signer = &ctx.accounts.signer;
        
        // Either the provider can refund, or arbitrator can refund
        require!(
            escrow.provider == signer.key() || ctx.accounts.arbitrator.key() == signer.key(),
            TransactionError::UnauthorizedRefund
        );
        
        // Check escrow status
        require!(
            escrow.status == EscrowStatus::Created,
            TransactionError::InvalidEscrowStatus
        );
        
        // Update escrow status
        escrow.status = EscrowStatus::Refunded;
        escrow.updated_at = Clock::get()?.unix_timestamp;
        
        // Transfer funds from escrow back to consumer
        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.consumer_token_account.to_account_info(),
            authority: ctx.accounts.escrow_authority.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let seeds = &[
            b"escrow".as_ref(),
            escrow.key().as_ref(),
            &[*ctx.bumps.get("escrow_authority").unwrap()],
        ];
        let signer_seeds = &[&seeds[..]];
        
        let cpi_ctx = CpiContext::new_with_signer(
            cpi_program,
            cpi_accounts,
            signer_seeds,
        );
        
        token::transfer(cpi_ctx, escrow.amount)?;
        
        emit!(EscrowRefunded {
            escrow_id: escrow.key(),
            match_id: escrow.match_id,
            amount: escrow.amount,
            refunded_by: signer.key(),
        });

        Ok(())
    }

    // Dispute an escrow transaction
    pub fn dispute_escrow(ctx: Context<DisputeEscrow>, reason: String) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let signer = &ctx.accounts.signer;
        
        // Either consumer or provider can dispute
        require!(
            escrow.consumer == signer.key() || escrow.provider == signer.key(),
            TransactionError::UnauthorizedDispute
        );
        
        // Check escrow status
        require!(
            escrow.status == EscrowStatus::Created,
            TransactionError::InvalidEscrowStatus
        );
        
        // Update escrow status
        escrow.status = EscrowStatus::Disputed;
        escrow.updated_at = Clock::get()?.unix_timestamp;
        
        emit!(EscrowDisputed {
            escrow_id: escrow.key(),
            match_id: escrow.match_id,
            disputed_by: signer.key(),
            reason,
        });

        Ok(())
    }

    // Resolve a disputed escrow
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        consumer_share: u8,
        provider_share: u8,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        let arbitrator = &ctx.accounts.arbitrator;
        
        // Check escrow status
        require!(
            escrow.status == EscrowStatus::Disputed,
            TransactionError::InvalidEscrowStatus
        );
        
        // Validate shares
        require!(
            consumer_share + provider_share == 100,
            TransactionError::InvalidShares
        );
        
        // Update escrow status
        escrow.status = EscrowStatus::Resolved;
        escrow.updated_at = Clock::get()?.unix_timestamp;
        
        // Calculate amounts
        let consumer_amount = (escrow.amount as u128 * consumer_share as u128 / 100) as u64;
        let provider_amount = escrow.amount - consumer_amount;
        
        // Transfer consumer share
        if consumer_amount > 0 {
            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.consumer_token_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let seeds = &[
                b"escrow".as_ref(),
                escrow.key().as_ref(),
                &[*ctx.bumps.get("escrow_authority").unwrap()],
            ];
            let signer_seeds = &[&seeds[..]];
            
            let cpi_ctx = CpiContext::new_with_signer(
                cpi_program,
                cpi_accounts,
                signer_seeds,
            );
            
            token::transfer(cpi_ctx, consumer_amount)?;
        }
        
        // Transfer provider share
        if provider_amount > 0 {
            let cpi_accounts = Transfer {
                from: ctx.accounts.escrow_token_account.to_account_info(),
                to: ctx.accounts.provider_token_account.to_account_info(),
                authority: ctx.accounts.escrow_authority.to_account_info(),
            };
            
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let seeds = &[
                b"escrow".as_ref(),
                escrow.key().as_ref(),
                &[*ctx.bumps.get("escrow_authority").unwrap()],
            ];
            let signer_seeds = &[&seeds[..]];
            
            let cpi_ctx = CpiContext::new_with_signer(
                cpi_program,
                cpi_accounts,
                signer_seeds,
            );
            
            token::transfer(cpi_ctx, provider_amount)?;
        }
        
        emit!(DisputeResolved {
            escrow_id: escrow.key(),
            match_id: escrow.match_id,
            resolved_by: arbitrator.key(),
            consumer_share,
            provider_share,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(init, payer = consumer, space = 8 + Escrow::LEN)]
    pub escrow: Account<'info, Escrow>,
    #[account(mut)]
    pub consumer: Signer<'info>,
    #[account(mut)]
    pub consumer_token_account: Account<'info, TokenAccount>,
    /// CHECK: We only use this for recording the provider
    pub provider: AccountInfo<'info>,
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseFunds<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(seeds = [b"escrow".as_ref(), escrow.key().as_ref()], bump)]
    /// CHECK: This is a PDA that manages the escrow
    pub escrow_authority: AccountInfo<'info>,
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub provider_token_account: Account<'info, TokenAccount>,
    pub signer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct RefundEscrow<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(seeds = [b"escrow".as_ref(), escrow.key().as_ref()], bump)]
    /// CHECK: This is a PDA that manages the escrow
    pub escrow_authority: AccountInfo<'info>,
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub consumer_token_account: Account<'info, TokenAccount>,
    pub signer: Signer<'info>,
    /// CHECK: This is a trusted arbitrator account
    pub arbitrator: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct DisputeEscrow<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(seeds = [b"escrow".as_ref(), escrow.key().as_ref()], bump)]
    /// CHECK: This is a PDA that manages the escrow
    pub escrow_authority: AccountInfo<'info>,
    #[account(mut)]
    pub escrow_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub consumer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub provider_token_account: Account<'info, TokenAccount>,
    pub arbitrator: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Escrow {
    pub match_id: Pubkey,                 // Related match ID
    pub consumer: Pubkey,                 // Consumer address
    pub provider: Pubkey,                 // Provider address
    pub amount: u64,                      // Escrow amount
    pub release_time: i64,                // Time when funds can be auto-released
    pub status: EscrowStatus,             // Current status
    pub created_at: i64,                  // Creation timestamp
    pub updated_at: i64,                  // Last update timestamp
}

impl Escrow {
    pub const LEN: usize = 32 + 32 + 32 + 8 + 8 + 1 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EscrowStatus {
    Created,
    Released,
    Refunded,
    Disputed,
    Resolved,
}

#[event]
pub struct EscrowCreated {
    pub escrow_id: Pubkey,
    pub match_id: Pubkey,
    pub consumer: Pubkey,
    pub provider: Pubkey,
    pub amount: u64,
}

#[event]
pub struct EscrowReleased {
    pub escrow_id: Pubkey,
    pub match_id: Pubkey,
    pub amount: u64,
    pub released_by: Pubkey,
}

#[event]
pub struct EscrowRefunded {
    pub escrow_id: Pubkey,
    pub match_id: Pubkey,
    pub amount: u64,
    pub refunded_by: Pubkey,
}

#[event]
pub struct EscrowDisputed {
    pub escrow_id: Pubkey,
    pub match_id: Pubkey,
    pub disputed_by: Pubkey,
    pub reason: String,
}

#[event]
pub struct DisputeResolved {
    pub escrow_id: Pubkey,
    pub match_id: Pubkey,
    pub resolved_by: Pubkey,
    pub consumer_share: u8,
    pub provider_share: u8,
}

#[error_code]
pub enum TransactionError {
    #[msg("Escrow amount must be greater than zero")]
    InvalidAmount,
    #[msg("Release time must be in the future")]
    InvalidReleaseTime,
    #[msg("Only authorized parties can release the funds")]
    UnauthorizedRelease,
    #[msg("Only the provider or arbitrator can refund the escrow")]
    UnauthorizedRefund,
    #[msg("Only the consumer or provider can dispute the escrow")]
    UnauthorizedDispute,
    #[msg("Escrow is not in the correct status for this operation")]
    InvalidEscrowStatus,
    #[msg("Consumer and provider shares must add up to 100")]
    InvalidShares,
} 