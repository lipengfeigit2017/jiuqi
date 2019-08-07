package com.jiuqi.gmt.test.feign.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient("gmc-service")
public interface UserFeignClient {

	@GetMapping("/user/get")
	public String getUser();
}
