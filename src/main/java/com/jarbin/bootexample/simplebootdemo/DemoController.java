package com.jarbin.bootexample.simplebootdemo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class DemoController {

    @RequestMapping("/index")
    public String bootDemo(){
        return "index";
    }
}
