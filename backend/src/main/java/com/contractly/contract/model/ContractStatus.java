package com.contractly.contract.model;

/**
 * Contract lifecycle statuses.
 * Flow: DRAFT → SENT → VIEWED → SIGNED → EXPIRED
 */
public enum ContractStatus {
    DRAFT,
    SENT,
    VIEWED,
    SIGNED,
    EXPIRED
}
