-- ============================================================
-- Contractly — Database Schema v4
-- Add clients table and client_id to contracts
-- ============================================================

CREATE TABLE IF NOT EXISTS clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    company_name VARCHAR(150),
    email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(50),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_email (user_id, email)
);

ALTER TABLE contracts
    ADD COLUMN client_id BIGINT DEFAULT NULL,
    ADD CONSTRAINT fk_contract_client FOREIGN KEY (client_id) REFERENCES clients(id);
