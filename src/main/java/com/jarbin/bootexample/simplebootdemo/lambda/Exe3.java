package com.jarbin.bootexample.simplebootdemo.lambda;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Exe3 {
    /*public static void main(String[] args) {
        ArrayList<Item> list = new ArrayList<>();
        int i = args.length;
        Collections.addAll(list,
                new Item(1, "1", 1),
                new Item(2, "2", 2),
                new Item(3, "3", 3),
                new Item(3, "4", 4),
                new Item(3, "55", 5)
        );

        //lambda表达式 方法引用
        //list.forEach((a) -> System.out.println(a));
        //list.forEach(System.out::println);
        //list.forEach(Exe3::ss);

        *//*list.forEach(element -> {
            if (element != null) {
                System.out.println(element.name);
            }
        });*//*

        Map<Integer, Item> map =  list.stream()
                .filter(e -> e.id > 2)
                .collect(Collectors.toMap((b) -> b.getId(), (a) -> a, (k1, k2) -> {
                    System.out.println("k1:"+k1+";k2:"+k2);
                    return new Item();
                }));

        map.forEach((k,v) -> {
            System.out.println("k=" + k + ";v="+v);
        });
    }

    public static int ss (Item a){
        System.out.println(a.id + "_" +  a.name);

        String s = "111";
        s.length();

        return 1;
    }*/
}
