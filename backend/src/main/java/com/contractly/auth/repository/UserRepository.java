package com.contractly.auth.repository;

import com.contractly.auth.model.User;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.Optional;

/**
 * JDBC-based repository for user operations.
 */
@Repository
public class UserRepository {

    private final NamedParameterJdbcTemplate jdbc;

    public UserRepository(NamedParameterJdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<User> ROW_MAPPER = (ResultSet rs, int rowNum) -> User.builder()
            .id(rs.getLong("id"))
            .email(rs.getString("email"))
            .passwordHash(rs.getString("password_hash"))
            .fullName(rs.getString("full_name"))
            .companyName(rs.getString("company_name"))
            .role(rs.getString("role"))
            .avatarUrl(rs.getString("avatar_url"))
            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
            .updatedAt(rs.getTimestamp("updated_at").toLocalDateTime())
            .build();

    /**
     * Find user by email.
     */
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = :email";
        var params = new MapSqlParameterSource("email", email);
        var results = jdbc.query(sql, params, ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Find user by ID.
     */
    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = :id";
        var params = new MapSqlParameterSource("id", id);
        var results = jdbc.query(sql, params, ROW_MAPPER);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    /**
     * Check if email already exists.
     */
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = :email";
        var params = new MapSqlParameterSource("email", email);
        Integer count = jdbc.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    /**
     * Insert a new user. Returns the created user with generated ID.
     */
    public User save(User user) {
        String sql = """
                INSERT INTO users (email, password_hash, full_name, company_name, role)
                VALUES (:email, :passwordHash, :fullName, :companyName, :role)
                """;

        var params = new MapSqlParameterSource()
                .addValue("email", user.getEmail())
                .addValue("passwordHash", user.getPasswordHash())
                .addValue("fullName", user.getFullName())
                .addValue("companyName", user.getCompanyName())
                .addValue("role", user.getRole() != null ? user.getRole() : "USER");

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbc.update(sql, params, keyHolder);

        user.setId(keyHolder.getKey().longValue());
        return user;
    }

    /**
     * Update user profile.
     */
    public void update(User user) {
        String sql = """
                UPDATE users
                SET full_name = :fullName,
                    company_name = :companyName,
                    avatar_url = :avatarUrl
                WHERE id = :id
                """;

        var params = new MapSqlParameterSource()
                .addValue("id", user.getId())
                .addValue("fullName", user.getFullName())
                .addValue("companyName", user.getCompanyName())
                .addValue("avatarUrl", user.getAvatarUrl());

        jdbc.update(sql, params);
    }
}
