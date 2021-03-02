package com.jarbin.bootexample.simplebootdemo.ProductionTest.bean;

public class SynchronizedThread implements Runnable{

    public static int count = 0;

    private void add(){
        synchronized(SynchronizedThread.class){
            count++;
        }
    }

    @Override
    public void run() {
        for(int i=0;i<1000000;i++){
            add();
        }
    }
}
