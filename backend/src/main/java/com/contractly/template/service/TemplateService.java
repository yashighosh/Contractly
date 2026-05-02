package com.contractly.template.service;

import com.contractly.common.exception.ResourceNotFoundException;
import com.contractly.common.exception.UnauthorizedException;
import com.contractly.template.dto.TemplateRequest;
import com.contractly.template.dto.TemplateResponse;
import com.contractly.template.model.Template;
import com.contractly.template.repository.TemplateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TemplateService {

    private final TemplateRepository templateRepository;

    public TemplateService(TemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    public TemplateResponse create(Long userId, TemplateRequest request) {
        Template template = Template.builder()
                .userId(userId)
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .variables(request.getVariables())
                .isPublic(request.isPublic())
                .build();
        template = templateRepository.save(template);
        return toResponse(template);
    }

    public List<TemplateResponse> listByUser(Long userId) {
        return templateRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TemplateResponse getById(Long id, Long userId) {
        Template template = findAndAuthorize(id, userId);
        return toResponse(template);
    }

    public TemplateResponse update(Long id, Long userId, TemplateRequest request) {
        Template template = findAndAuthorize(id, userId);
        template.setTitle(request.getTitle());
        template.setDescription(request.getDescription());
        template.setContent(request.getContent());
        template.setVariables(request.getVariables());
        template.setPublic(request.isPublic());
        templateRepository.update(template);
        return toResponse(template);
    }

    public void delete(Long id, Long userId) {
        findAndAuthorize(id, userId);
        templateRepository.deleteByIdAndUserId(id, userId);
    }

    private Template findAndAuthorize(Long id, Long userId) {
        Template template = templateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template", id));
        if (!template.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have access to this template");
        }
        return template;
    }

    private TemplateResponse toResponse(Template t) {
        return TemplateResponse.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .content(t.getContent())
                .variables(t.getVariables())
                .isPublic(t.isPublic())
                .createdAt(t.getCreatedAt())
                .updatedAt(t.getUpdatedAt())
                .build();
    }
}
