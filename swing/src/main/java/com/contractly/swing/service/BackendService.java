package com.contractly.swing.service;

import com.contractly.swing.dto.ApiResponse;
import com.contractly.swing.dto.AuthResponse;
import com.contractly.swing.dto.LoginRequest;
import com.contractly.swing.dto.ContractResponse;
import com.contractly.swing.dto.ClientResponse;
import com.contractly.swing.dto.TemplateResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class BackendService {
    private static final String BASE_URL = "http://localhost:8082/api/v1";
    private final ObjectMapper mapper;
    private String token;

    public BackendService() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public void setToken(String token) {
        this.token = token;
    }

    private String readStream(InputStream is) throws IOException {
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length;
        while ((length = is.read(buffer)) != -1) {
            result.write(buffer, 0, length);
        }
        return result.toString(StandardCharsets.UTF_8.name());
    }

    public ApiResponse<AuthResponse> login(String email, String password) throws IOException {
        LoginRequest request = LoginRequest.builder()
                .email(email)
                .password(password)
                .build();

        String jsonBody = mapper.writeValueAsString(request);
        System.out.println("[DEBUG] Login request to: " + BASE_URL + "/auth/login");
        System.out.println("[DEBUG] Request body: " + jsonBody);

        URL url = new URL(BASE_URL + "/auth/login");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Accept", "application/json");
        conn.setDoOutput(true);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(30000);

        // Write request body
        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
        }

        int responseCode = conn.getResponseCode();
        System.out.println("[DEBUG] Response code: " + responseCode);

        String responseBody;
        if (responseCode >= 200 && responseCode < 300) {
            responseBody = readStream(conn.getInputStream());
        } else {
            InputStream errorStream = conn.getErrorStream();
            responseBody = errorStream != null ? readStream(errorStream) : "No error body";
        }
        System.out.println("[DEBUG] Response body: " + responseBody);

        conn.disconnect();

        if (responseCode == 403) {
            throw new IOException("Access denied (403). Check backend CORS/security config.");
        }

        ApiResponse<AuthResponse> apiResponse = mapper.readValue(responseBody,
                new TypeReference<ApiResponse<AuthResponse>>() {});

        if (apiResponse.isSuccess() && apiResponse.getData() != null) {
            this.token = apiResponse.getData().getAccessToken();
            System.out.println("[DEBUG] Login successful, token stored.");
        }
        return apiResponse;
    }

    private String authenticatedGet(String path) throws IOException {
        URL url = new URL(BASE_URL + path);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + token);
        conn.setRequestProperty("Accept", "application/json");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(30000);

        int responseCode = conn.getResponseCode();
        System.out.println("[DEBUG] GET " + path + " -> " + responseCode);

        String responseBody;
        if (responseCode >= 200 && responseCode < 300) {
            responseBody = readStream(conn.getInputStream());
        } else {
            InputStream errorStream = conn.getErrorStream();
            responseBody = errorStream != null ? readStream(errorStream) : "No error body";
            conn.disconnect();
            throw new IOException("HTTP " + responseCode + ": " + responseBody);
        }

        conn.disconnect();
        return responseBody;
    }

    public List<ContractResponse> getContracts() throws IOException {
        String body = authenticatedGet("/contracts");
        ApiResponse<List<ContractResponse>> apiResponse = mapper.readValue(body,
                new TypeReference<ApiResponse<List<ContractResponse>>>() {});
        return apiResponse.getData();
    }

    public List<ClientResponse> getClients() throws IOException {
        String body = authenticatedGet("/clients");
        ApiResponse<List<ClientResponse>> apiResponse = mapper.readValue(body,
                new TypeReference<ApiResponse<List<ClientResponse>>>() {});
        return apiResponse.getData();
    }

    public List<TemplateResponse> getTemplates() throws IOException {
        String body = authenticatedGet("/templates");
        ApiResponse<List<TemplateResponse>> apiResponse = mapper.readValue(body,
                new TypeReference<ApiResponse<List<TemplateResponse>>>() {});
        return apiResponse.getData();
    }
}
