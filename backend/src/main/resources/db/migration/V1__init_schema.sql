-- ============================================================
-- Contractly — Database Schema v1
-- MySQL | JDBC (no JPA)
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255),
    role            VARCHAR(50) NOT NULL DEFAULT 'USER',
    avatar_url      VARCHAR(512),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX idx_users_email ON users(email);

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    token           VARCHAR(512) NOT NULL UNIQUE,
    expires_at      TIMESTAMP NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Templates
CREATE TABLE IF NOT EXISTS templates (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    content         LONGTEXT NOT NULL,
    variables       JSON,
    is_public       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_templates_user ON templates(user_id);

-- Clauses (Clause Library)
CREATE TABLE IF NOT EXISTS clauses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    category        VARCHAR(100),
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_clauses_user ON clauses(user_id);
CREATE INDEX idx_clauses_category ON clauses(category);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT NOT NULL,
    template_id         BIGINT,
    client_id           BIGINT,
    title               VARCHAR(255) NOT NULL,
    content             LONGTEXT NOT NULL,
    variables_data      JSON,
    status              VARCHAR(50) DEFAULT 'DRAFT',
    recipient_name      VARCHAR(255),
    recipient_email     VARCHAR(255),
    amount              DECIMAL(15,2),
    currency            VARCHAR(10) DEFAULT 'INR',
    start_date          DATE,
    end_date            DATE,
    is_recurring        BOOLEAN DEFAULT FALSE,
    renewal_period_days INT,
    auto_renew          BOOLEAN DEFAULT FALSE,
    sign_token          VARCHAR(512) UNIQUE,
    sign_token_expiry   TIMESTAMP NULL,
    signed_pdf_key      VARCHAR(512),
    sent_at             TIMESTAMP NULL,
    viewed_at           TIMESTAMP NULL,
    signed_at           TIMESTAMP NULL,
    expired_at          TIMESTAMP NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (template_id) REFERENCES templates(id)
);
CREATE INDEX idx_contracts_user ON contracts(user_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_sign_token ON contracts(sign_token);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);

-- Contract ↔ Clause join table
CREATE TABLE IF NOT EXISTS contract_clauses (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id     BIGINT NOT NULL,
    clause_id       BIGINT NOT NULL,
    sort_order      INT DEFAULT 0,
    FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    FOREIGN KEY (clause_id) REFERENCES clauses(id)
);
CREATE INDEX idx_cc_contract ON contract_clauses(contract_id);

-- Signature Records
CREATE TABLE IF NOT EXISTS signature_records (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id     BIGINT NOT NULL,
    signer_name     VARCHAR(255),
    signer_email    VARCHAR(255),
    signature_data  LONGTEXT,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    signed_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
);
CREATE INDEX idx_sig_contract ON signature_records(contract_id);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id     BIGINT,
    user_id         BIGINT,
    action          VARCHAR(100) NOT NULL,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    metadata        JSON,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX idx_audit_contract ON audit_logs(contract_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
