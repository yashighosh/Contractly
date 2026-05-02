package com.contractly.client.repository;

import com.contractly.client.dto.ClientMetricsResponse;
import com.contractly.client.model.Client;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Repository
public class ClientRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public ClientRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Client> ROW_MAPPER = (ResultSet rs, int rowNum) -> {
        return Client.builder()
                .id(rs.getLong("id"))
                .userId(rs.getLong("user_id"))
                .fullName(rs.getString("full_name"))
                .companyName(rs.getString("company_name"))
                .email(rs.getString("email"))
                .phoneNumber(rs.getString("phone_number"))
                .address(rs.getString("address"))
                .notes(rs.getString("notes"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
    };

    public Client save(Client client) {
        String sql = """
                INSERT INTO clients (user_id, full_name, company_name, email, phone_number, address, notes)
                VALUES (:userId, :fullName, :companyName, :email, :phoneNumber, :address, :notes)
                """;

        var params = new MapSqlParameterSource()
                .addValue("userId", client.getUserId())
                .addValue("fullName", client.getFullName())
                .addValue("companyName", client.getCompanyName())
                .addValue("email", client.getEmail())
                .addValue("phoneNumber", client.getPhoneNumber())
                .addValue("address", client.getAddress())
                .addValue("notes", client.getNotes());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(sql, params, keyHolder);
        client.setId(keyHolder.getKey().longValue());
        return client;
    }

    public Optional<Client> findByIdAndUserId(Long id, Long userId) {
        String sql = "SELECT * FROM clients WHERE id = :id AND user_id = :userId";
        var results = jdbc.query(sql, new MapSqlParameterSource().addValue("id", id).addValue("userId", userId), ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Client> findAllByUserId(Long userId) {
        String sql = "SELECT * FROM clients WHERE user_id = :userId ORDER BY full_name ASC";
        return jdbc.query(sql, new MapSqlParameterSource("userId", userId), ROW_MAPPER);
    }

    public void update(Client client) {
        String sql = """
                UPDATE clients
                SET full_name = :fullName, company_name = :companyName, email = :email,
                    phone_number = :phoneNumber, address = :address, notes = :notes
                WHERE id = :id AND user_id = :userId
                """;
        var params = new MapSqlParameterSource()
                .addValue("id", client.getId())
                .addValue("userId", client.getUserId())
                .addValue("fullName", client.getFullName())
                .addValue("companyName", client.getCompanyName())
                .addValue("email", client.getEmail())
                .addValue("phoneNumber", client.getPhoneNumber())
                .addValue("address", client.getAddress())
                .addValue("notes", client.getNotes());
        jdbc.update(sql, params);
    }

    public void delete(Long id, Long userId) {
        String sql = "DELETE FROM clients WHERE id = :id AND user_id = :userId";
        jdbc.update(sql, new MapSqlParameterSource().addValue("id", id).addValue("userId", userId));
    }

    public boolean existsByEmailAndUserId(String email, Long userId) {
        String sql = "SELECT COUNT(*) FROM clients WHERE email = :email AND user_id = :userId";
        Integer count = jdbc.queryForObject(sql, new MapSqlParameterSource().addValue("email", email).addValue("userId", userId), Integer.class);
        return count != null && count > 0;
    }

    public ClientMetricsResponse getClientMetrics(Long clientId, Long userId) {
        String sql = """
                SELECT COUNT(*) as total_contracts, SUM(amount) as total_revenue
                FROM contracts
                WHERE client_id = :clientId AND user_id = :userId AND status = 'SIGNED'
                """;
        
        try {
            return jdbc.queryForObject(sql, new MapSqlParameterSource().addValue("clientId", clientId).addValue("userId", userId),
                    (rs, rowNum) -> {
                        long totalContracts = rs.getLong("total_contracts");
                        BigDecimal totalRevenue = rs.getBigDecimal("total_revenue");
                        if (totalRevenue == null) {
                            totalRevenue = BigDecimal.ZERO;
                        }
                        return ClientMetricsResponse.builder()
                                .totalContractsSent(totalContracts)
                                .totalRevenue(totalRevenue)
                                .build();
                    });
        } catch (DataAccessException e) {
            return ClientMetricsResponse.builder()
                    .totalContractsSent(0L)
                    .totalRevenue(BigDecimal.ZERO)
                    .build();
        }
    }
    
    public boolean isClientLinkedToContracts(Long clientId, Long userId) {
        String sql = "SELECT COUNT(*) FROM contracts WHERE client_id = :clientId AND user_id = :userId";
        Integer count = jdbc.queryForObject(sql, new MapSqlParameterSource().addValue("clientId", clientId).addValue("userId", userId), Integer.class);
        return count != null && count > 0;
    }
}
