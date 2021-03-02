package com.jarbin.bootexample.simplebootdemo.test.loader;

public class TestDynamicLoad {

    static{
        System.out.println("********************static code***************************");
    }

    public static void main(String[] args){
        new A();
        System.out.println("********************load test***************************");
        new B();
    }
}

class A{
    A(){
        System.out.println("********************init A***************************");
    }
}

class B{
    B(){
        System.out.println("********************init B***************************");
    }
}