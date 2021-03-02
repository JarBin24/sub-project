package com.jarbin.bootexample.simplebootdemo.test.loader;

public class TestClassLoader {

    public static void main(String[] args){
        System.out.println(String.class.getClassLoader());
        System.out.println(TestClassLoader.class.getClassLoader());
        System.out.println(String.class.getClassLoader());
        System.out.println(String.class.getClassLoader());
        System.out.println(String.class.getClassLoader());
    }
}
