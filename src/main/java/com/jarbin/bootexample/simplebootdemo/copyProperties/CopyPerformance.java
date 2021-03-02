package com.jarbin.bootexample.simplebootdemo.copyProperties;

import org.apache.commons.beanutils.PropertyUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.cglib.beans.BeanCopier;
import org.springframework.util.StopWatch;

import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

public class CopyPerformance {

    private static StopWatch stopwatch = new StopWatch("CopyPerformance");

    public static void main(String[] args) throws Exception{

        OriginObject origin = new OriginObject();
        origin.setId(1111L);
        origin.setName("name");
        origin.setSex(1);
        origin.setAge(30);
        origin.setAddress("hanghzou");
        origin.setLike("dota");

        //testCglibBeanCopier(origin, 1000000);
        //testApacheBeanUtils(origin, 10000);
        //testSpringFramework(origin, 1000000);
        //setCopy(origin, 1000000);
        //clone(origin, 1000000);
        //testApacheBeanUtilsPropertyUtils(origin, 100000);

        testSpringFrameworkThread(origin, 10000);
        //System.out.println("total 耗时: " + stopwatch.prettyPrint());
    }

    private static void testCglibBeanCopier(OriginObject origin, int len) {
        System.out.println();
        System.out.println("================cglib BeanCopier执行" + len + "次================");
        DestinationObject destination3 = new DestinationObject();

        stopwatch.start("testCglibBeanCopier");
        for (int i = 0; i < len; i++) {
            BeanCopier copier = BeanCopier.create(OriginObject.class, DestinationObject.class, false);
            copier.copy(origin, destination3, null);
        }
        stopwatch.stop();
    }

    /*private static void testApacheBeanUtils(OriginObject origin, int len)
            throws IllegalAccessException, InvocationTargetException {
        System.out.println();
        System.out.println("================apache BeanUtils执行" + len + "次================");
        DestinationObject destination2 = new DestinationObject();

        stopwatch.start("testApacheBeanUtils");
        for (int i = 0; i < len; i++) {
            org.apache.commons.beanutils.BeanUtils.copyProperties(destination2, origin);
        }
        stopwatch.stop();
    }*/

    private static void testSpringFramework(OriginObject origin, int len) {
        System.out.println("================springframework执行" + len + "次================");
        DestinationObject destination = new DestinationObject();

        stopwatch.start("testSpringFramework");
        for (int i = 0; i < len; i++) {
            org.springframework.beans.BeanUtils.copyProperties(origin, destination);
        }
        stopwatch.stop();
    }

    private static void testSpringFrameworkThread(OriginObject origin, int len) {
        System.out.println("================springframework执行" + len + "次================");
        DestinationObject destination = new DestinationObject();
        CountDownLatch countDownLatch = new CountDownLatch(1);
        for(int j=0;j<10;j++) {
            new Thread(() -> {
                try {
                    System.out.println("Thread ready:" + Thread.currentThread().getName());
                    countDownLatch.await();
                    for (int i = 0; i < len / 10; i++) {
                        //org.springframework.beans.BeanUtils.copyProperties(origin, destination);
                        //springFrameworkCopyProperties(origin, destination);
                        setCopyProperties(origin, destination);
                    }
                }catch (Exception e){
                    e.printStackTrace();
                }finally {
                    System.out.println("Thread ready:" + Thread.currentThread().getName() + " => " + System.currentTimeMillis());
                }
            }).start();
        }
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        //System.out.println("Thread main => " + System.currentTimeMillis());
        countDownLatch.countDown();
        System.out.println("Thread countDown => " + System.currentTimeMillis());
    }

    private static void springFrameworkCopyProperties(OriginObject origin, DestinationObject destination){
        synchronized (origin){
            org.springframework.beans.BeanUtils.copyProperties(origin, destination);
        }
    }

    /*private static void testApacheBeanUtilsPropertyUtils(OriginObject origin, int len)
            throws IllegalAccessException, InvocationTargetException, NoSuchMethodException {
        System.out.println();
        System.out.println("================apache BeanUtils PropertyUtils执行" + len + "次================");
        DestinationObject destination2 = new DestinationObject();

        stopwatch.start("testApacheBeanUtilsPropertyUtils");
        for (int i = 0; i < len; i++) {
            PropertyUtils.copyProperties(destination2, origin);
        }
        stopwatch.stop();
    }*/

    private static void setCopy(OriginObject origin, int len) {
        System.out.println();
        System.out.println("================setCopy执行" + len + "次================");
        DestinationObject destination3 = new DestinationObject();

        stopwatch.start("setCopy");
        for (int i = 0; i < len; i++) {
            destination3.setId(origin.getId());
            destination3.setName(origin.getName());
            destination3.setSex(origin.getSex());
            destination3.setAge(origin.getAge());
            destination3.setAddress(origin.getAddress());
            destination3.setLike(origin.getLike());
        }
        stopwatch.stop();
    }

    private static void setCopyProperties(OriginObject origin, DestinationObject destination){
        //synchronized (origin){
            destination.setId(origin.getId());
            destination.setName(origin.getName());
            destination.setSex(origin.getSex());
            destination.setAge(origin.getAge());
            destination.setAddress(origin.getAddress());
            destination.setLike(origin.getLike());
        //}
    }

    private static void clone(OriginObject origin, int len) throws Exception{
        System.out.println();
        System.out.println("================clone执行" + len + "次================");
        OriginObject destination3 = new OriginObject();

        stopwatch.start("clone");
        for (int i = 0; i < len; i++) {
            destination3 = (OriginObject)origin.clone();
        }
        stopwatch.stop();
    }
}
