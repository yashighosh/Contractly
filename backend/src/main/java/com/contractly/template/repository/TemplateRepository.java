package com.contractly.template.repository;

import com.contractly.template.model.Template;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TemplateRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public TemplateRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<Template> ROW_MAPPER = (rs, rowNum) -> Template.builder()
            .id(rs.getLong("id"))
            .userId(rs.getLong("user_id"))
            .title(rs.getString("title"))
            .description(rs.getString("description"))
            .content(rs.getString("content"))
            .variables(rs.getString("variables"))
            .isPublic(rs.getBoolean("is_public"))
            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
            .updatedAt(rs.getTimestamp("updated_at").toLocalDateTime())
            .build();

    public Template save(Template template) {
        String sql = """
                INSERT INTO templates (user_id, title, description, content, variables, is_public)
                VALUES (:userId, :title, :description, :content, :variables, :isPublic)
                """;
        var params = new MapSqlParameterSource()
                .addValue("userId", template.getUserId())
                .addValue("title", template.getTitle())
                .addValue("description", template.getDescription())
                .addValue("content", template.getContent())
                .addValue("variables", template.getVariables())
                .addValue("isPublic", template.isPublic());

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(sql, params, keyHolder);
        template.setId(keyHolder.getKey().longValue());
        return template;
    }

    public void update(Template template) {
        String sql = """
                UPDATE templates
                SET title = :title, description = :description, content = :content,
                    variables = :variables, is_public = :isPublic
                WHERE id = :id AND user_id = :userId
                """;
        var params = new MapSqlParameterSource()
                .addValue("id", template.getId())
                .addValue("userId", template.getUserId())
                .addValue("title", template.getTitle())
                .addValue("description", template.getDescription())
                .addValue("content", template.getContent())
                .addValue("variables", template.getVariables())
                .addValue("isPublic", template.isPublic());
        jdbc.update(sql, params);
    }

    public Optional<Template> findById(Long id) {
        var results = jdbc.query("SELECT * FROM templates WHERE id = :id",
                new MapSqlParameterSource("id", id), ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public List<Template> findByUserId(Long userId) {
        return jdbc.query("SELECT * FROM templates WHERE user_id = :userId ORDER BY updated_at DESC",
                new MapSqlParameterSource("userId", userId), ROW_MAPPER);
    }

    public void deleteByIdAndUserId(Long id, Long userId) {
        jdbc.update("DELETE FROM templates WHERE id = :id AND user_id = :userId",
                new MapSqlParameterSource().addValue("id", id).addValue("userId", userId));
    }
}
