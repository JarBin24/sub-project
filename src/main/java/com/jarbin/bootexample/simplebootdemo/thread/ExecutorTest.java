package com.jarbin.bootexample.simplebootdemo.thread;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class ExecutorTest {

    public static void main(String[] args) {

        Executor executor = Executors.newFixedThreadPool(2);

        for(int i=0;i<10;i++){
            executor.execute(() -> {
                System.out.println("currentThread:" + Thread.currentThread().getName());
                try{
                    Thread.sleep(10000);
                }catch (Exception e){
                    System.out.println("currentThread error:" + Thread.currentThread().getName());
                    e.printStackTrace();
                }
                System.out.println("currentThread sleep end:" + Thread.currentThread().getName());
            });
        }

    }



}
