package com.jiuqi.gmt.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class GmcTest01Application {

	 @Bean
	 @LoadBalanced
	 public RestTemplate restTemplate() {
	   return new RestTemplate();
	 }
	
	public static void main(String[] args) {
		SpringApplication.run(GmcTest01Application.class, args);
	}

}
