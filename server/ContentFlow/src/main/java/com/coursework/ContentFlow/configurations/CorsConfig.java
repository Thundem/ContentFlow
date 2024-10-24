package com.coursework.ContentFlow.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Дозволяє доступ до всіх маршрутів
                .allowedOrigins("*") // Дозволяє запити з усіх доменів
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Дозволяє зазначені HTTP методи
                .allowedHeaders("*"); // Дозволяє всі заголовки
    }
}
