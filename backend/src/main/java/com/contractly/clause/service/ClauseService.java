package com.contractly.clause.service;

import com.contractly.clause.dto.ClauseRequest;
import com.contractly.clause.dto.ClauseResponse;
import com.contractly.clause.model.Clause;
import com.contractly.clause.repository.ClauseRepository;
import com.contractly.common.exception.ResourceNotFoundException;
import com.contractly.common.exception.UnauthorizedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClauseService {

    private final ClauseRepository clauseRepository;

    public ClauseService(ClauseRepository clauseRepository) {
        this.clauseRepository = clauseRepository;
    }

    public ClauseResponse create(Long userId, ClauseRequest request) {
        Clause clause = Clause.builder()
                .userId(userId)
                .title(request.getTitle())
                .category(request.getCategory())
                .content(request.getContent())
                .build();
        clause = clauseRepository.save(clause);
        return toResponse(clause);
    }

    public List<ClauseResponse> listByUser(Long userId, String category) {
        return clauseRepository.findByUserId(userId, category)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ClauseResponse getById(Long id, Long userId) {
        Clause clause = findAndAuthorize(id, userId);
        return toResponse(clause);
    }

    public ClauseResponse update(Long id, Long userId, ClauseRequest request) {
        Clause clause = findAndAuthorize(id, userId);
        clause.setTitle(request.getTitle());
        clause.setCategory(request.getCategory());
        clause.setContent(request.getContent());
        clauseRepository.update(clause);
        return toResponse(clause);
    }

    public void delete(Long id, Long userId) {
        findAndAuthorize(id, userId);
        clauseRepository.deleteByIdAndUserId(id, userId);
    }

    private Clause findAndAuthorize(Long id, Long userId) {
        Clause clause = clauseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clause", id));
        if (!clause.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have access to this clause");
        }
        return clause;
    }

    private ClauseResponse toResponse(Clause c) {
        return ClauseResponse.builder()
                .id(c.getId())
                .title(c.getTitle())
                .category(c.getCategory())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
