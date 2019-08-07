package com.jiuqi.gmc.test.feign.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;


@Configuration
@EnableFeignClients(basePackages = "com.jiuqi.gmc.test.feign.client")
@ComponentScan(basePackages = "com.jiuqi.gmc.test.feign")
@PropertySource(value = "classpath:gmc-feign-client.properties")
public class FeignClientConfig {
	@Bean(name="lbcRestTemplate")
	RestTemplate lbcRestTemplate() {
		RestTemplate lbcRestTemplate = new RestTemplate();
		lbcRestTemplate.getMessageConverters().add(new WxMappingJackson2HttpMessageConverter());
		return lbcRestTemplate;
	}
	
	public class WxMappingJackson2HttpMessageConverter extends MappingJackson2HttpMessageConverter {
	    public WxMappingJackson2HttpMessageConverter(){
	        List<MediaType> mediaTypes = new ArrayList<>();
	        mediaTypes.add(MediaType.APPLICATION_JSON);
	        mediaTypes.add(MediaType.APPLICATION_OCTET_STREAM);
	        mediaTypes.add(MediaType.TEXT_HTML);
	        mediaTypes.add(MediaType.TEXT_PLAIN);
	        mediaTypes.add(MediaType.TEXT_XML);
	        mediaTypes.add(MediaType.APPLICATION_STREAM_JSON);
	        mediaTypes.add(MediaType.APPLICATION_ATOM_XML);
	        mediaTypes.add(MediaType.APPLICATION_FORM_URLENCODED);
	        mediaTypes.add(MediaType.APPLICATION_JSON_UTF8);
	        mediaTypes.add(MediaType.APPLICATION_PDF);
	        setSupportedMediaTypes(mediaTypes);
	    }
	}
}
