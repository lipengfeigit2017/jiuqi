package com.jiuqi.gmt.test.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

	@GetMapping("gmc/user/get")
	public String getUser() {
		
		return "lipengfei";
	}
}
