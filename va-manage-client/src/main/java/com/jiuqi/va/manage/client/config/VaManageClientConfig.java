package com.jiuqi.va.manage.client.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import at.pollux.thymeleaf.shiro.dialect.ShiroDialect;

@Configuration
@ComponentScan(basePackages = "com.jiuqi.va.manage.client")
@EnableDiscoveryClient
public class VaManageClientConfig {

	/**
	 * ShiroDialect，为了在thymeleaf里使用shiro的标签的bean
	 *
	 * @return
	 */
	@Bean
	@ConditionalOnMissingBean
	public ShiroDialect shiroDialect() {
		return new ShiroDialect();
	}
}
