// token.rs - CAL Token Contract for Calctra Platform
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("CALTrajd1Vdjh64YLAQiUzMFpkjfbXcF72uXP5eTXyL");

#[program]
pub mod cal_token {
    use super::*;

    // Initialize the CAL token with specified parameters
    pub fn initialize(
        ctx: Context<Initialize>,
        name: String,
        symbol: String,
        decimals: u8,
        total_supply: u64,
    ) -> Result<()> {
        // Set token metadata
        let token_info = &mut ctx.accounts.token_info;
        token_info.name = name;
        token_info.symbol = symbol;
        token_info.decimals = decimals;
        token_info.total_supply = total_supply;
        token_info.authority = ctx.accounts.authority.key();

        // Mint initial supply to the authority
        let cpi_accounts = Transfer {
            from: ctx.accounts.mint_authority.to_account_info(),
            to: ctx.accounts.authority_token.to_account_info(),
            authority: ctx.accounts.mint_authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, total_supply)?;

        Ok(())
    }

    // Transfer tokens between accounts
    pub fn transfer(ctx: Context<TransferTokens>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    // Allocate tokens for staking rewards
    pub fn allocate_rewards(ctx: Context<AllocateRewards>, amount: u64) -> Result<()> {
        let token_info = &mut ctx.accounts.token_info;
        require!(
            ctx.accounts.authority.key() == token_info.authority,
            TokenError::InvalidAuthority
        );

        let cpi_accounts = Transfer {
            from: ctx.accounts.authority_token.to_account_info(),
            to: ctx.accounts.rewards_pool.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + TokenInfo::LEN)]
    pub token_info: Account<'info, TokenInfo>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub mint_authority: AccountInfo<'info>,
    #[account(mut)]
    pub authority_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct AllocateRewards<'info> {
    #[account(mut)]
    pub token_info: Account<'info, TokenInfo>,
    #[account(mut)]
    pub authority_token: Account<'info, TokenAccount>,
    #[account(mut)]
    pub rewards_pool: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct TokenInfo {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
    pub authority: Pubkey,
}

impl TokenInfo {
    pub const LEN: usize = 32 + 8 + 8 + 1 + 8 + 32;
}

#[error_code]
pub enum TokenError {
    #[msg("The provided authority is invalid")]
    InvalidAuthority,
    #[msg("Insufficient token balance")]
    InsufficientBalance,
} 