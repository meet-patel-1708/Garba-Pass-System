package com.example.DandiyaDesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
		"config",
		"security",
		"controller",
		"service",
		"repository",
		"model",
		"com.example.DandiyaDesk"
})
@EnableJpaRepositories(basePackages = "repository")
@EntityScan(basePackages = "model")
public class DandiyaDeskApplication {
	public static void main(String[] args) {
		SpringApplication.run(DandiyaDeskApplication.class, args);
	}
}