package com.contractly.audit.repository;

import com.contractly.audit.model.AuditLog;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class AuditRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public AuditRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<AuditLog> ROW_MAPPER = (rs, rowNum) -> {
        AuditLog log = new AuditLog();
        log.setId(rs.getLong("id"));

        long contractId = rs.getLong("contract_id");
        log.setContractId(rs.wasNull() ? null : contractId);

        long userId = rs.getLong("user_id");
        log.setUserId(rs.wasNull() ? null : userId);

        log.setAction(rs.getString("action"));
        log.setIpAddress(rs.getString("ip_address"));
        log.setUserAgent(rs.getString("user_agent"));
        log.setMetadata(rs.getString("metadata"));

        Timestamp ts = rs.getTimestamp("created_at");
        log.setCreatedAt(ts != null ? ts.toLocalDateTime() : null);

        return log;
    };

    /**
     * Insert a new audit log entry.
     */
    public void save(AuditLog auditLog) {
        String sql = """
                INSERT INTO audit_logs (contract_id, user_id, action, ip_address, user_agent, metadata)
                VALUES (:contractId, :userId, :action, :ipAddress, :userAgent, :metadata)
                """;
        var params = new MapSqlParameterSource()
                .addValue("contractId", auditLog.getContractId())
                .addValue("userId", auditLog.getUserId())
                .addValue("action", auditLog.getAction())
                .addValue("ipAddress", auditLog.getIpAddress())
                .addValue("userAgent", auditLog.getUserAgent())
                .addValue("metadata", auditLog.getMetadata());

        jdbc.update(sql, params);
    }

    /**
     * Get audit trail for a specific contract.
     */
    public List<AuditLog> findByContractId(Long contractId) {
        String sql = "SELECT * FROM audit_logs WHERE contract_id = :contractId ORDER BY created_at ASC";
        return jdbc.query(sql, new MapSqlParameterSource("contractId", contractId), ROW_MAPPER);
    }

    /**
     * Get recent audit logs (for dashboard).
     */
    public List<AuditLog> findRecentByUserId(Long userId, int limit) {
        String sql = """
                SELECT * FROM audit_logs
                WHERE user_id = :userId
                ORDER BY created_at DESC
                LIMIT :limit
                """;
        var params = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("limit", limit);
        return jdbc.query(sql, params, ROW_MAPPER);
    }
}
