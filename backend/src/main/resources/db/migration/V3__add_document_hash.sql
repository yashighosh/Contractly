-- ============================================================
-- Contractly — Database Schema v3
-- Add document_hash to signature_records
-- ============================================================

ALTER TABLE signature_records ADD COLUMN IF NOT EXISTS document_hash VARCHAR(64);
