package com.jarbin.bootexample.simplebootdemo.ProductionTest;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * java引用类型值变化测试类
 */
public class ReferenceTest {

    static class Person{
        String name;
        Integer age;
        Person(String name1, Integer age1){
            name = name1;
            age = age1;
        }
    }

    public static void main(String[] args){
        test4();
    }

    public static void test1(){
        String s1 = "123456";
        String s2 = s1;
        s2 = "1111";
        System.out.println(s1);
    }

    public static void test2(){
        Person p1 = new Person("123456789", 10);
        Person p2 = p1;
        p2.name = "2222";
        System.out.println(p1.name);
    }

    public static void method1(Person p){
        p.name = "3333";
    }

    public static void test3(){
        Person p1 = new Person("123456789", 10);
        method1(p1);
        System.out.println(p1.name);
    }


    public static void test4(){
        Map<Integer, Person> map = new ConcurrentHashMap<>();
        Person p1 = new Person("123456789", 10);
        map.put(1, p1);

        Person p2 = map.get(1);
        System.out.println(p2.name);

        Person p3 = map.get(1);
        p3.name = "4444";
        map.put(1, p3);

        System.out.println(p2.name);
    }

    public static void test5(){
        Map<Integer, Person> map = new HashMap<>();
        Person p1 = new Person("123456789", 10);
        map.put(1, p1);

        Person p2 = map.get(1);
        System.out.println(p2.name);

        Person p3 = new Person("123456789", 10);
        p3.name = "5555";
        map.put(1, p3);

        System.out.println(p2.name);
    }

}
