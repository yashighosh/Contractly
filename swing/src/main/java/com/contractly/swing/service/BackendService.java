package com.contractly.swing.service;

import com.contractly.swing.dto.ApiResponse;
import com.contractly.swing.dto.AuthResponse;
import com.contractly.swing.dto.LoginRequest;
import com.contractly.swing.dto.ContractResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import okhttp3.*;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;

public class BackendService {
    private static final String BASE_URL = "http://localhost:8082/api/v1";
    private final OkHttpClient client;
    private final ObjectMapper mapper;
    private String token;

    public BackendService() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(10, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build();
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ApiResponse<AuthResponse> login(String email, String password) throws IOException {
        LoginRequest request = LoginRequest.builder()
                .email(email)
                .password(password)
                .build();

        String json = mapper.writeValueAsString(request);
        RequestBody body = RequestBody.create(json, MediaType.parse("application/json"));

        Request httpRequest = new Request.Builder()
                .url(BASE_URL + "/auth/login")
                .post(body)
                .build();

        try (Response response = client.newCall(httpRequest).execute()) {
            ApiResponse<AuthResponse> apiResponse = mapper.readValue(response.body().string(), 
                new TypeReference<ApiResponse<AuthResponse>>() {});
            if (apiResponse.isSuccess() && apiResponse.getData() != null) {
                this.token = apiResponse.getData().getAccessToken();
            }
            return apiResponse;
        }
    }

    public List<ContractResponse> getContracts() throws IOException {
        Request httpRequest = new Request.Builder()
                .url(BASE_URL + "/contracts")
                .addHeader("Authorization", "Bearer " + token)
                .get()
                .build();

        try (Response response = client.newCall(httpRequest).execute()) {
            if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
            
            ApiResponse<List<ContractResponse>> apiResponse = mapper.readValue(response.body().string(),
                new TypeReference<ApiResponse<List<ContractResponse>>>() {});
            return apiResponse.getData();
        }
    }

    // Add more methods as needed
}
