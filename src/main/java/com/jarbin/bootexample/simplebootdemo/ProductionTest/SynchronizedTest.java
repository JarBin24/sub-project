package com.jarbin.bootexample.simplebootdemo.ProductionTest;

import com.jarbin.bootexample.simplebootdemo.ProductionTest.bean.SynchronizedThread;

public class SynchronizedTest {

    static class RingBuffer<T>{

    }

    static class Producer<T>{
        private final RingBuffer<T> ringBufffer;

        public Producer(RingBuffer<T> ringBufffer1){
            ringBufffer = ringBufffer1;
        }

        public void pushDate(T tradeBean){
            synchronized (Producer.class){
                tradeBean.hashCode();
            }
        }

    }

    public static void main1(String[] args){
        RingBuffer buffer = new RingBuffer();
        Producer<String> producer = new Producer<>(buffer);
        Long time1 = System.currentTimeMillis();
        int i=1;
        while(true){
            producer.pushDate("1111");
            i++;
            if(i<0){
                break;
            }
        }
        Long time2 = System.currentTimeMillis();
        System.out.println("time:"+(time2-time1));
    }


    public static void main(String[] args) throws InterruptedException{
        Thread thread1 = new Thread(new SynchronizedThread());
        Thread thread2 = new Thread(new SynchronizedThread());

        thread1.start();
        thread2.start();

        thread1.join();
        thread2.join();

        System.out.println(SynchronizedThread.count);
    }
}
