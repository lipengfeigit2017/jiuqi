package com.jiuqi.gmc.test.feign.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "${feignClient.gmc.name}", path = "${feignClient.gmc.path}")
public interface UserFeignClient {

	@GetMapping("/user/get")
	public String getUser();
}
