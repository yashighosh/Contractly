package com.contractly.dashboard.service;

import com.contractly.contract.model.ContractStatus;
import com.contractly.contract.repository.ContractRepository;
import com.contractly.dashboard.dto.DashboardStats;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class DashboardService {

    private final ContractRepository contractRepository;
    private final NamedParameterJdbcTemplate jdbc;

    public DashboardService(ContractRepository contractRepository,
                            NamedParameterJdbcTemplate jdbc) {
        this.contractRepository = contractRepository;
        this.jdbc = jdbc;
    }

    public DashboardStats getStats(Long userId) {
        int draft = contractRepository.countByUserAndStatus(userId, ContractStatus.DRAFT);
        int sent = contractRepository.countByUserAndStatus(userId, ContractStatus.SENT);
        int viewed = contractRepository.countByUserAndStatus(userId, ContractStatus.VIEWED);
        int signed = contractRepository.countByUserAndStatus(userId, ContractStatus.SIGNED);
        int expired = contractRepository.countByUserAndStatus(userId, ContractStatus.EXPIRED);

        // Total revenue from signed contracts
        BigDecimal revenue = getSignedRevenue(userId);

        // Contracts expiring in next 7 days
        int expiringSoon = getExpiringSoonCount(userId);

        return DashboardStats.builder()
                .totalContracts(draft + sent + viewed + signed + expired)
                .draftCount(draft)
                .sentCount(sent)
                .viewedCount(viewed)
                .signedCount(signed)
                .expiredCount(expired)
                .totalRevenue(revenue)
                .expiringSoonCount(expiringSoon)
                .build();
    }

    private BigDecimal getSignedRevenue(Long userId) {
        String sql = """
                SELECT COALESCE(SUM(amount), 0)
                FROM contracts
                WHERE user_id = :userId AND status = 'SIGNED'
                """;
        return jdbc.queryForObject(sql, new MapSqlParameterSource("userId", userId), BigDecimal.class);
    }

    private int getExpiringSoonCount(Long userId) {
        String sql = """
                SELECT COUNT(*)
                FROM contracts
                WHERE user_id = :userId
                  AND status IN ('SIGNED', 'SENT', 'VIEWED')
                  AND end_date BETWEEN CURDATE() AND :threshold
                """;
        var params = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("threshold", LocalDate.now().plusDays(7));
        Integer count = jdbc.queryForObject(sql, params, Integer.class);
        return count != null ? count : 0;
    }
}
