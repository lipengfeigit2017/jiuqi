package com.jiuqi.va.manage.client.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller("vmcLoginController")
public class MainController {
	
	@GetMapping("/")
	@ResponseBody
	String welcome() {
		return "Working...";
	}
	
	@RequestMapping("/loginTimeout")
	String loginTimeout() {
		return "error/loginTimeout";
	}

}
