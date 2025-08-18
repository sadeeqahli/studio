
# 9ja Pitch Connect - Full Stack Integration Guide

## Overview
This guide covers the complete integration of Flutterwave payment system with Node.js backend and MySQL database.

## 🔧 Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Flutterwave account (Test/Live)

## 🚀 Setup Instructions

### 1. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
source backend/database/schema.sql
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your actual values
nano .env
```

### 3. Flutterwave Configuration

#### Required Environment Variables:
```
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_public_key
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-your_secret_key
FLUTTERWAVE_WEBHOOK_SECRET=your_webhook_secret
```

#### Webhook Setup:
1. Login to Flutterwave Dashboard
2. Go to Settings > Webhooks
3. Add webhook URL: `https://your-domain.com/api/payments/webhook`
4. Select events: `charge.completed`

### 4. Frontend Configuration
Update your Next.js environment variables:

```env
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your_public_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📋 What We've Integrated

### Backend Components:
1. **Express Server** (`backend/server.js`)
   - CORS configuration
   - Security middleware (Helmet, Rate limiting)
   - Error handling
   - Health check endpoint

2. **Database Layer** (`backend/config/database.js`)
   - MySQL connection pool
   - Connection testing
   - Auto-reconnection handling

3. **Authentication System** (`backend/middleware/auth.js`)
   - JWT token validation
   - Role-based access control
   - User session management

4. **Payment Integration** (`backend/routes/payments.js`)
   - Flutterwave SDK integration
   - Payment initialization
   - Transaction verification
   - Webhook handling
   - Commission calculations
   - Cashback processing

5. **Database Schema** (`backend/database/schema.sql`)
   - Users table with wallet support
   - Pitches management
   - Bookings with payment tracking
   - Transactions logging
   - Reward system
   - Referral tracking
   - Payouts management

### Frontend Updates Needed:
1. **API Integration** - Replace placeholder data with API calls
2. **Payment Flow** - Integrate with Flutterwave payment popup
3. **Authentication** - JWT token management
4. **Error Handling** - Proper error boundaries

## 🔄 Payment Flow

### 1. Payment Initialization
```javascript
// Frontend initiates payment
const response = await fetch('/api/payments/initialize', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(paymentData)
});
```

### 2. Flutterwave Payment Popup
```javascript
// Use Flutterwave's payment link or inline payment
window.FlutterwaveCheckout({
  public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
  tx_ref: txRef,
  amount: amount,
  currency: 'NGN',
  customer: customerData,
  callback: function(data) {
    // Verify payment on backend
    verifyPayment(data.tx_ref);
  }
});
```

### 3. Payment Verification
```javascript
// Backend verifies with Flutterwave
const verification = await flw.Transaction.verify({ id: tx_ref });
// Updates booking status
// Processes commission
// Adds cashback rewards
```

## 🏗️ Additional Components to Add

### Backend Routes (Still needed):
1. **Auth Routes** (`backend/routes/auth.js`)
   - Login/Signup
   - Password reset
   - Token refresh

2. **User Routes** (`backend/routes/users.js`)
   - Profile management
   - Wallet operations
   - Booking history

3. **Pitch Routes** (`backend/routes/pitches.js`)
   - CRUD operations
   - Search and filtering
   - Availability checking

4. **Booking Routes** (`backend/routes/bookings.js`)
   - Create bookings
   - Update status
   - Cancel bookings

5. **Reward Routes** (`backend/routes/rewards.js`)
   - Cashback management
   - Referral tracking
   - Reward redemption

6. **Admin Routes** (`backend/routes/admin.js`)
   - Dashboard analytics
   - User management
   - Transaction monitoring

### Frontend Updates:
1. **API Service Layer** (`src/lib/api.ts`)
   - Centralized API calls
   - Error handling
   - Token management

2. **Payment Components** 
   - Flutterwave integration
   - Payment status tracking
   - Receipt generation

3. **State Management**
   - User authentication state
   - Booking state
   - Payment state

## 🔐 Security Features

### Already Implemented:
- JWT authentication
- Rate limiting
- Input validation
- SQL injection prevention
- CORS protection
- Helmet security headers

### Additional Recommendations:
- API key encryption
- Payment webhook verification
- User session monitoring
- Audit logging

## 📊 Database Features

### Key Tables:
- **users** - User accounts with wallet integration
- **pitches** - Pitch listings with owner relations
- **bookings** - Booking records with payment tracking
- **transactions** - All financial transactions
- **reward_transactions** - Cashback and referral tracking
- **payouts** - Commission and payout management

### Performance Optimizations:
- Indexed columns for faster queries
- Connection pooling
- Query optimization
- Caching layer (recommended)

## 🚀 Deployment Checklist

### Before Going Live:
1. Switch to production Flutterwave keys
2. Set up SSL certificates
3. Configure production database
4. Set up monitoring and logging
5. Test payment flows thoroughly
6. Set up backup systems
7. Configure environment variables
8. Test webhook endpoints

## 📞 Support & Troubleshooting

### Common Issues:
1. **Database Connection**: Check credentials and network
2. **Payment Failures**: Verify Flutterwave keys and webhook setup
3. **CORS Errors**: Check frontend/backend URL configuration
4. **Token Expiry**: Implement refresh token mechanism

### Monitoring:
- Transaction logs
- Error tracking
- Performance metrics
- User activity logs

This integration provides a solid foundation for a production-ready football pitch booking platform with secure payment processing.
