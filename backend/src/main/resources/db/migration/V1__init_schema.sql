-- ============================================================
-- Contractly — Database Schema v1
-- PostgreSQL | JDBC (no JPA)
-- ============================================================

-- Users
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    company_name    VARCHAR(255),
    role            VARCHAR(50) NOT NULL DEFAULT 'USER',
    avatar_url      VARCHAR(512),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           VARCHAR(512) NOT NULL UNIQUE,
    expires_at      TIMESTAMP NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

-- Templates
CREATE TABLE IF NOT EXISTS templates (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    content         TEXT NOT NULL,
    variables       JSONB,
    is_public       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_templates_user ON templates(user_id);

-- Clauses (Clause Library)
CREATE TABLE IF NOT EXISTS clauses (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    title           VARCHAR(255) NOT NULL,
    category        VARCHAR(100),
    content         TEXT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_clauses_user ON clauses(user_id);
CREATE INDEX IF NOT EXISTS idx_clauses_category ON clauses(category);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id),
    template_id         BIGINT REFERENCES templates(id),
    title               VARCHAR(255) NOT NULL,
    content             TEXT NOT NULL,
    variables_data      JSONB,
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
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_contracts_user ON contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_sign_token ON contracts(sign_token);
CREATE INDEX IF NOT EXISTS idx_contracts_end_date ON contracts(end_date);

-- Contract ↔ Clause join table
CREATE TABLE IF NOT EXISTS contract_clauses (
    id              BIGSERIAL PRIMARY KEY,
    contract_id     BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    clause_id       BIGINT NOT NULL REFERENCES clauses(id),
    sort_order      INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_cc_contract ON contract_clauses(contract_id);

-- Signature Records
CREATE TABLE IF NOT EXISTS signature_records (
    id              BIGSERIAL PRIMARY KEY,
    contract_id     BIGINT NOT NULL REFERENCES contracts(id),
    signer_name     VARCHAR(255),
    signer_email    VARCHAR(255),
    signature_data  TEXT,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    signed_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sig_contract ON signature_records(contract_id);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id              BIGSERIAL PRIMARY KEY,
    contract_id     BIGINT REFERENCES contracts(id),
    user_id         BIGINT REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    metadata        JSONB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_contract ON audit_logs(contract_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
