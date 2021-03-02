package com.jarbin.bootexample.simplebootdemo.outOfMemoryTest;

public class HeapDumpError {

    static class Person{
        private String name;
        private Integer age;
        private Integer sex;

        Person(String name, Integer age, Integer sex){
            this.name = name;
            this.age = age;
            this.sex = sex;
        }
    }

    public static void main(String[] args){
        int i=0;
        Person[] list = new Person[1000000];
        while(true){
            Person p = new Person("张三", 10, 1);
            list[i] = p;
            i++;
            System.out.println(i);
        }
    }
}
