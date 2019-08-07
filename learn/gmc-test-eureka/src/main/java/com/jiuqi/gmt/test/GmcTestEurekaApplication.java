package com.jiuqi.gmt.test;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class GmcTestEurekaApplication {

	public static void main(String[] args) {
		SpringApplication.run(GmcTestEurekaApplication.class, args);
	}

}
