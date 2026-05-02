package com.contractly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ContractlyApplication {

    public static void main(String[] args) {
        SpringApplication.run(ContractlyApplication.class, args);
    }
}
