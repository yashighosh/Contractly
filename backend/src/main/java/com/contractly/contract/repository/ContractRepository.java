package com.contractly.contract.repository;

import com.contractly.contract.model.Contract;
import com.contractly.contract.model.ContractStatus;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * JDBC repository for contract CRUD and query operations.
 */
@Repository
public class ContractRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public ContractRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Contract> ROW_MAPPER = (ResultSet rs, int rowNum) -> {
        Contract c = new Contract();
        c.setId(rs.getLong("id"));
        c.setUserId(rs.getLong("user_id"));

        long templateId = rs.getLong("template_id");
        c.setTemplateId(rs.wasNull() ? null : templateId);

        long clientId = rs.getLong("client_id");
        c.setClientId(rs.wasNull() ? null : clientId);

        c.setTitle(rs.getString("title"));
        c.setContent(rs.getString("content"));
        c.setVariablesData(rs.getString("variables_data"));
        c.setStatus(ContractStatus.valueOf(rs.getString("status")));
        c.setRecipientName(rs.getString("recipient_name"));
        c.setRecipientEmail(rs.getString("recipient_email"));
        c.setAmount(rs.getBigDecimal("amount"));
        c.setCurrency(rs.getString("currency"));

        java.sql.Date startDate = rs.getDate("start_date");
        c.setStartDate(startDate != null ? startDate.toLocalDate() : null);
        java.sql.Date endDate = rs.getDate("end_date");
        c.setEndDate(endDate != null ? endDate.toLocalDate() : null);

        c.setRecurring(rs.getBoolean("is_recurring"));
        c.setRenewalPeriodDays(rs.getObject("renewal_period_days", Integer.class));
        c.setAutoRenew(rs.getBoolean("auto_renew"));
        c.setSignToken(rs.getString("sign_token"));

        c.setSignTokenExpiry(toLocalDateTime(rs.getTimestamp("sign_token_expiry")));
        c.setSignedPdfKey(rs.getString("signed_pdf_key"));
        c.setSentAt(toLocalDateTime(rs.getTimestamp("sent_at")));
        c.setViewedAt(toLocalDateTime(rs.getTimestamp("viewed_at")));
        c.setSignedAt(toLocalDateTime(rs.getTimestamp("signed_at")));
        c.setExpiredAt(toLocalDateTime(rs.getTimestamp("expired_at")));
        c.setCreatedAt(toLocalDateTime(rs.getTimestamp("created_at")));
        c.setUpdatedAt(toLocalDateTime(rs.getTimestamp("updated_at")));

        return c;
    };

    private static LocalDateTime toLocalDateTime(Timestamp ts) {
        return ts != null ? ts.toLocalDateTime() : null;
    }

    /**
     * Insert a new contract.
     */
    public Contract save(Contract contract) {
        String sql = """
                INSERT INTO contracts (user_id, template_id, client_id, title, content, variables_data, status,
                    recipient_name, recipient_email, amount, currency, start_date, end_date,
                    is_recurring, renewal_period_days, auto_renew)
                VALUES (:userId, :templateId, :clientId, :title, :content, :variablesData, :status,
                    :recipientName, :recipientEmail, :amount, :currency, :startDate, :endDate,
                    :isRecurring, :renewalPeriodDays, :autoRenew)
                """;

        var params = buildContractParams(contract);
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(sql, params, keyHolder);

        contract.setId(keyHolder.getKey().longValue());
        return contract;
    }

    /**
     * Update an existing contract.
     */
    public void update(Contract contract) {
        String sql = """
                UPDATE contracts
                SET title = :title, content = :content, variables_data = :variablesData,
                    client_id = :clientId, recipient_name = :recipientName, recipient_email = :recipientEmail,
                    amount = :amount, currency = :currency, start_date = :startDate, end_date = :endDate,
                    is_recurring = :isRecurring, renewal_period_days = :renewalPeriodDays, auto_renew = :autoRenew
                WHERE id = :id AND user_id = :userId
                """;

        var params = buildContractParams(contract);
        params.addValue("id", contract.getId());
        jdbc.update(sql, params);
    }

    /**
     * Find contract by ID.
     */
    public Optional<Contract> findById(Long id) {
        String sql = "SELECT * FROM contracts WHERE id = :id";
        var results = jdbc.query(sql, new MapSqlParameterSource("id", id), ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find contract by sign token.
     */
    public Optional<Contract> findBySignToken(String token) {
        String sql = "SELECT * FROM contracts WHERE sign_token = :token";
        var results = jdbc.query(sql, new MapSqlParameterSource("token", token), ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * List contracts for a user, optionally filtered by status.
     */
    public List<Contract> findByUserId(Long userId, ContractStatus status) {
        StringBuilder sql = new StringBuilder("SELECT * FROM contracts WHERE user_id = :userId");
        var params = new MapSqlParameterSource("userId", userId);

        if (status != null) {
            sql.append(" AND status = :status");
            params.addValue("status", status.name());
        }

        sql.append(" ORDER BY updated_at DESC");
        return jdbc.query(sql.toString(), params, ROW_MAPPER);
    }

    /**
     * Update contract status and related timestamp.
     */
    public void updateStatus(Long id, ContractStatus status, String timestampColumn) {
        String sql = "UPDATE contracts SET status = :status, " + timestampColumn + " = NOW() WHERE id = :id";
        var params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("status", status.name());
        jdbc.update(sql, params);
    }

    /**
     * Set the sign token for a contract.
     */
    public void setSignToken(Long id, String token, LocalDateTime expiry) {
        String sql = "UPDATE contracts SET sign_token = :token, sign_token_expiry = :expiry WHERE id = :id";
        var params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("token", token)
                .addValue("expiry", expiry);
        jdbc.update(sql, params);
    }

    /**
     * Set the signed PDF key after signing.
     */
    public void setSignedPdfKey(Long id, String key) {
        String sql = "UPDATE contracts SET signed_pdf_key = :key WHERE id = :id";
        jdbc.update(sql, new MapSqlParameterSource().addValue("id", id).addValue("key", key));
    }

    /**
     * Find contracts eligible for auto-renewal.
     */
    public List<Contract> findAutoRenewable(LocalDate threshold) {
        String sql = """
                SELECT * FROM contracts
                WHERE auto_renew = TRUE
                  AND status = 'SIGNED'
                  AND end_date <= :threshold
                  AND end_date >= CURDATE()
                ORDER BY end_date ASC
                """;
        return jdbc.query(sql, new MapSqlParameterSource("threshold", threshold), ROW_MAPPER);
    }

    /**
     * Count contracts by status for a user (for dashboard).
     */
    public int countByUserAndStatus(Long userId, ContractStatus status) {
        String sql = "SELECT COUNT(*) FROM contracts WHERE user_id = :userId AND status = :status";
        var params = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("status", status.name());
        Integer count = jdbc.queryForObject(sql, params, Integer.class);
        return count != null ? count : 0;
    }

    /**
     * Delete contract by ID (only if owned by user).
     */
    public void deleteByIdAndUserId(Long id, Long userId) {
        String sql = "DELETE FROM contracts WHERE id = :id AND user_id = :userId";
        jdbc.update(sql, new MapSqlParameterSource().addValue("id", id).addValue("userId", userId));
    }

    private MapSqlParameterSource buildContractParams(Contract c) {
        return new MapSqlParameterSource()
                .addValue("userId", c.getUserId())
                .addValue("templateId", c.getTemplateId())
                .addValue("clientId", c.getClientId())
                .addValue("title", c.getTitle())
                .addValue("content", c.getContent())
                .addValue("variablesData", c.getVariablesData())
                .addValue("status", c.getStatus() != null ? c.getStatus().name() : ContractStatus.DRAFT.name())
                .addValue("recipientName", c.getRecipientName())
                .addValue("recipientEmail", c.getRecipientEmail())
                .addValue("amount", c.getAmount())
                .addValue("currency", c.getCurrency())
                .addValue("startDate", c.getStartDate())
                .addValue("endDate", c.getEndDate())
                .addValue("isRecurring", c.isRecurring())
                .addValue("renewalPeriodDays", c.getRenewalPeriodDays())
                .addValue("autoRenew", c.isAutoRenew());
    }
}
