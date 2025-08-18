
-- 9ja Pitch Connect Database Schema

CREATE DATABASE IF NOT EXISTS pitch_connect_db;
USE pitch_connect_db;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Player', 'Owner', 'Admin') NOT NULL,
    phone VARCHAR(20),
    registered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
    total_bookings INT DEFAULT 0,
    pitches_listed INT DEFAULT 0,
    subscription_plan ENUM('Starter', 'Plus', 'Pro') DEFAULT 'Starter',
    trial_end_date TIMESTAMP NULL,
    trial_type ENUM('3_months_free', '30_days_free') NULL,
    transaction_pin VARCHAR(6),
    reward_balance DECIMAL(10,2) DEFAULT 0.00,
    wallet_balance DECIMAL(10,2) DEFAULT 0.00,
    referral_code VARCHAR(20) UNIQUE,
    referred_by VARCHAR(20),
    virtual_account_number VARCHAR(20),
    virtual_account_balance DECIMAL(10,2) DEFAULT 0.00,
    flutterwave_subaccount_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pitches table
CREATE TABLE pitches (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    image_hint TEXT,
    owner_id VARCHAR(36) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    slot_interval INT DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY,
    pitch_id VARCHAR(36) NOT NULL,
    pitch_name VARCHAR(255) NOT NULL,
    user_id VARCHAR(36),
    customer_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Paid', 'Cancelled', 'Completed') DEFAULT 'Pending',
    booking_type ENUM('Online', 'Offline') DEFAULT 'Online',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    flutterwave_tx_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pitch_id) REFERENCES pitches(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Transactions table
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    booking_id VARCHAR(36),
    type ENUM('Payment', 'Payout', 'Commission', 'Cashback', 'Referral', 'Withdrawal') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Completed', 'Failed', 'Cancelled') DEFAULT 'Pending',
    payment_reference VARCHAR(100),
    flutterwave_tx_ref VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Reward transactions table
CREATE TABLE reward_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type ENUM('Cashback', 'Referral Bonus', 'Used', 'Bonus') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    related_booking_id VARCHAR(36),
    status ENUM('Active', 'Used', 'Expired') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Referrals table
CREATE TABLE referrals (
    id VARCHAR(36) PRIMARY KEY,
    referrer_id VARCHAR(36) NOT NULL,
    referee_id VARCHAR(36) NOT NULL,
    referee_name VARCHAR(255) NOT NULL,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    completed_bookings INT DEFAULT 0,
    bonus_awarded BOOLEAN DEFAULT FALSE,
    date_referred DATE NOT NULL,
    date_completed DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Payouts table
CREATE TABLE payouts (
    id VARCHAR(36) PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    gross_amount DECIMAL(10,2) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_fee DECIMAL(10,2) NOT NULL,
    net_payout DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Paid Out', 'Failed') DEFAULT 'Pending',
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activities log table
CREATE TABLE activities (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    user_name VARCHAR(255) NOT NULL,
    user_role ENUM('Player', 'Owner', 'Admin') NOT NULL,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Withdrawals table
CREATE TABLE withdrawals (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    bank_name VARCHAR(255),
    account_number VARCHAR(20),
    account_name VARCHAR(255),
    status ENUM('Pending', 'Processing', 'Completed', 'Failed') DEFAULT 'Pending',
    reference VARCHAR(100),
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_pitch_id ON bookings(pitch_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_payouts_owner_id ON payouts(owner_id);
