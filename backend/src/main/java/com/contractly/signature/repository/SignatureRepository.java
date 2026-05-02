package com.contractly.signature.repository;

import com.contractly.signature.model.SignatureRecord;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class SignatureRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public SignatureRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<SignatureRecord> ROW_MAPPER = (rs, rowNum) -> SignatureRecord.builder()
            .id(rs.getLong("id"))
            .contractId(rs.getLong("contract_id"))
            .signerName(rs.getString("signer_name"))
            .signerEmail(rs.getString("signer_email"))
            .signatureData(rs.getString("signature_data"))
            .ipAddress(rs.getString("ip_address"))
            .userAgent(rs.getString("user_agent"))
            .signedAt(rs.getTimestamp("signed_at").toLocalDateTime())
            .build();

    public SignatureRecord save(SignatureRecord record) {
        String sql = """
                INSERT INTO signature_records (contract_id, signer_name, signer_email, signature_data, ip_address, user_agent)
                VALUES (:contractId, :signerName, :signerEmail, :signatureData, :ipAddress, :userAgent)
                """;
        var params = new MapSqlParameterSource()
                .addValue("contractId", record.getContractId())
                .addValue("signerName", record.getSignerName())
                .addValue("signerEmail", record.getSignerEmail())
                .addValue("signatureData", record.getSignatureData())
                .addValue("ipAddress", record.getIpAddress())
                .addValue("userAgent", record.getUserAgent());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(sql, params, keyHolder);
        record.setId(keyHolder.getKey().longValue());
        return record;
    }

    public Optional<SignatureRecord> findByContractId(Long contractId) {
        String sql = "SELECT * FROM signature_records WHERE contract_id = :contractId ORDER BY signed_at DESC LIMIT 1";
        var results = jdbc.query(sql, new MapSqlParameterSource("contractId", contractId), ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<SignatureRecord> findAllByContractId(Long contractId) {
        String sql = "SELECT * FROM signature_records WHERE contract_id = :contractId ORDER BY signed_at ASC";
        return jdbc.query(sql, new MapSqlParameterSource("contractId", contractId), ROW_MAPPER);
    }
}
