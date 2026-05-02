package com.contractly.clause.repository;

import com.contractly.clause.model.Clause;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ClauseRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public ClauseRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Clause> ROW_MAPPER = (rs, rowNum) -> Clause.builder()
            .id(rs.getLong("id"))
            .userId(rs.getLong("user_id"))
            .title(rs.getString("title"))
            .category(rs.getString("category"))
            .content(rs.getString("content"))
            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
            .updatedAt(rs.getTimestamp("updated_at").toLocalDateTime())
            .build();

    public Clause save(Clause clause) {
        String sql = """
                INSERT INTO clauses (user_id, title, category, content)
                VALUES (:userId, :title, :category, :content)
                """;
        var params = new MapSqlParameterSource()
                .addValue("userId", clause.getUserId())
                .addValue("title", clause.getTitle())
                .addValue("category", clause.getCategory())
                .addValue("content", clause.getContent());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(sql, params, keyHolder);
        clause.setId(keyHolder.getKey().longValue());
        return clause;
    }

    public void update(Clause clause) {
        String sql = """
                UPDATE clauses SET title = :title, category = :category, content = :content
                WHERE id = :id AND user_id = :userId
                """;
        var params = new MapSqlParameterSource()
                .addValue("id", clause.getId())
                .addValue("userId", clause.getUserId())
                .addValue("title", clause.getTitle())
                .addValue("category", clause.getCategory())
                .addValue("content", clause.getContent());
        jdbc.update(sql, params);
    }

    public Optional<Clause> findById(Long id) {
        var results = jdbc.query("SELECT * FROM clauses WHERE id = :id",
                new MapSqlParameterSource("id", id), ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Clause> findByUserId(Long userId, String category) {
        StringBuilder sql = new StringBuilder("SELECT * FROM clauses WHERE user_id = :userId");
        var params = new MapSqlParameterSource("userId", userId);

        if (category != null && !category.isBlank()) {
            sql.append(" AND category = :category");
            params.addValue("category", category);
        }

        sql.append(" ORDER BY updated_at DESC");
        return jdbc.query(sql.toString(), params, ROW_MAPPER);
    }

    public void deleteByIdAndUserId(Long id, Long userId) {
        jdbc.update("DELETE FROM clauses WHERE id = :id AND user_id = :userId",
                new MapSqlParameterSource().addValue("id", id).addValue("userId", userId));
    }

    public void attachClauseToContract(Long contractId, Long clauseId, int sortOrder) {
        String sql = """
                INSERT INTO contract_clauses (contract_id, clause_id, sort_order)
                VALUES (:contractId, :clauseId, :sortOrder)
                """;
        var params = new MapSqlParameterSource()
                .addValue("contractId", contractId)
                .addValue("clauseId", clauseId)
                .addValue("sortOrder", sortOrder);
        jdbc.update(sql, params);
    }

    public boolean isClauseAttached(Long contractId, Long clauseId) {
        String sql = "SELECT COUNT(1) FROM contract_clauses WHERE contract_id = :contractId AND clause_id = :clauseId";
        var params = new MapSqlParameterSource()
                .addValue("contractId", contractId)
                .addValue("clauseId", clauseId);
        Integer count = jdbc.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public List<Clause> findByContractId(Long contractId) {
        String sql = """
                SELECT c.* FROM clauses c
                JOIN contract_clauses cc ON c.id = cc.clause_id
                WHERE cc.contract_id = :contractId
                ORDER BY cc.sort_order ASC
                """;
        return jdbc.query(sql, new MapSqlParameterSource("contractId", contractId), ROW_MAPPER);
    }
}
