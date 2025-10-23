# Requirements Analysis - FileSure Referral System

## Project Overview

Building a referral and credit system for a digital product platform. Users can register, share referral links, earn credits when referrals make purchases, and track activity through a dashboard.

## Business Goals

- Increase user acquisition through referral program
- Reward both referrer and referee to encourage participation
- Track referral performance and credit allocation
- Ensure fair credit distribution (no double-crediting)

## User Roles

### Standard User

- Can register and login
- Receives unique referral code
- Can share referral link
- Earns credits when referrals purchase
- Can simulate purchases

## Functional Requirements

### 1. User Authentication

- User registration with email/password
- Secure login/logout
- Password hashing (bcrypt)
- JWT-based session management
- OAuth providers (Google)

### 2. Referral System

- Generate unique referral code on registration
- Accept referral code during signup
- Track referrer-referee relationship
- Referral status: pending → converted
- Prevent self-referral
- Prevent duplicate referrals

### 3. Credit Management

- Award 2 credits to referrer on referee's first purchase
- Award 2 credits to referee on their first purchase
- Only first purchase triggers credits
- Maintain credit transaction history
- Display current credit balance
- Prevent double-crediting

### 4. Purchase Simulation

- Simple button to simulate purchase
- Detect if first purchase for user
- Trigger credit allocation if first purchase
- Track purchase history

### 5. Dashboard

- Display total referred users count
- Show converted users (who made purchase)
- Show total credits earned
- Display referral link with copy functionality
- List recent credit transactions

## Non-Functional Requirements

### Security

- Passwords must be hashed, never stored as plaintext
- JWT tokens for authentication
- Input validation on all endpoints
- Rate limiting to prevent abuse
- CORS configuration for frontend access

### Performance

- API response time < 500ms
- Database queries optimized with indexes
- Efficient referral tracking

### Scalability

- Modular architecture for easy feature additions
- Service layer separation
- Repository pattern for data access

## Business Logic

### Referral Flow Example

1. Lina registers → receives code "LINA123"
2. Lina shares link with Ryan
3. Ryan registers using "LINA123"
4. System creates referral record (status: pending)
5. Ryan clicks "Simulate Purchase"
6. System checks: Is this Ryan's first purchase? → Yes
7. System awards:
   - Lina: +2 credits
   - Ryan: +2 credits
8. Referral status updated to "converted"
9. Future purchases by Ryan don't generate credits

### Credit Allocation Rules

- Credits awarded ONLY on first purchase
- Both referrer and referee get exactly 2 credits
- No credits for self-referral
- No credits if user wasn't referred
- Transaction logged for audit trail

## Success Criteria

- Users can register and login securely
- Referral codes are unique and functional
- Credits allocated correctly (2 + 2)
- No double-crediting occurs
- Dashboard shows accurate statistics
- System handles edge cases gracefully
