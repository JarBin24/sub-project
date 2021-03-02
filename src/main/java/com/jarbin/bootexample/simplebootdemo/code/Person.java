package com.jarbin.bootexample.simplebootdemo.code;

@Deprecated
public class Person extends  IronMan implements SuperMan{

    private String eyes;
    private String mouse;
    public Long hands;
    protected Integer foots;
    Short head;

    public static final String body = "color";
    public Person(String eyes){
        this.eyes = eyes;
    }
     private Long getHands(Integer type){
         return this.hands;
     }

     @Override
     public void stronger(){
        System.out.println("STRONGER");
     }

    @Override
    public void fly(){
        System.out.println("I can fly");
    }

    class SmallPerson{
        public String son;
    }
}
