package com.jiuqi.gmt.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class GmcFeignClientApplication {

	public static void main(String[] args) {
		SpringApplication.run(GmcFeignClientApplication.class, args);
	}

}
