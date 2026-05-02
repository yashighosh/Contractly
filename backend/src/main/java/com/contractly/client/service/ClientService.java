package com.contractly.client.service;

import com.contractly.client.dto.ClientMetricsResponse;
import com.contractly.client.dto.ClientRequest;
import com.contractly.client.dto.ClientResponse;
import com.contractly.client.model.Client;
import com.contractly.client.repository.ClientRepository;
import com.contractly.common.exception.BadRequestException;
import com.contractly.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public ClientResponse create(Long userId, ClientRequest request) {
        if (clientRepository.existsByEmailAndUserId(request.getEmail(), userId)) {
            throw new BadRequestException("A client with this email already exists.");
        }

        Client client = Client.builder()
                .userId(userId)
                .fullName(request.getFullName())
                .companyName(request.getCompanyName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .notes(request.getNotes())
                .build();

        client = clientRepository.save(client);
        return toResponse(client);
    }

    public List<ClientResponse> listByUser(Long userId) {
        return clientRepository.findAllByUserId(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ClientResponse getById(Long id, Long userId) {
        Client client = clientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));
        return toResponse(client);
    }

    public ClientResponse update(Long id, Long userId, ClientRequest request) {
        Client client = clientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));

        if (!client.getEmail().equalsIgnoreCase(request.getEmail()) &&
                clientRepository.existsByEmailAndUserId(request.getEmail(), userId)) {
            throw new BadRequestException("A client with this email already exists.");
        }

        client.setFullName(request.getFullName());
        client.setCompanyName(request.getCompanyName());
        client.setEmail(request.getEmail());
        client.setPhoneNumber(request.getPhoneNumber());
        client.setAddress(request.getAddress());
        client.setNotes(request.getNotes());

        clientRepository.update(client);
        return toResponse(client);
    }

    public void delete(Long id, Long userId) {
        clientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));

        if (clientRepository.isClientLinkedToContracts(id, userId)) {
            throw new BadRequestException("Cannot delete client because they are linked to existing contracts.");
        }

        clientRepository.delete(id, userId);
    }

    public ClientMetricsResponse getMetrics(Long id, Long userId) {
        // Ensure client exists and belongs to user
        clientRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Client", id));

        return clientRepository.getClientMetrics(id, userId);
    }

    private ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .companyName(client.getCompanyName())
                .email(client.getEmail())
                .phoneNumber(client.getPhoneNumber())
                .address(client.getAddress())
                .notes(client.getNotes())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .build();
    }
}
