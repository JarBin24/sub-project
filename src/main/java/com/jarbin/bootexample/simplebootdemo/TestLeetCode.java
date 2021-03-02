/*
package com.jarbin.bootexample.simplebootdemo;

import java.util.Stack;

public class TestLeetCode {

    public static void main(String[] args){
        int[] nums = {2,7,11,15};
        int target = 9;
        int[] num2 = twoSum(nums, target);
        System.out.println(num2);
    }

    public static int[] twoSum(int[] nums, int target) {
        for(int i=0;i<nums.length-1;i++){
            for(int j=1;j<nums.length;j++){
                if((nums[i] + nums[j]) == target){
                    return new int[]{i,j};
                }
            }
        }
        return new int[]{};
    }

    public static boolean isValid(String s) {
        String str = "(){}[]";

        if(s == null || "".equals(s)){
            return false;
        }
        if(s.length()%2 != 0){
            return false;
        }

        s =  s.replace("(","(,").replace(")","),").replace("{","{,").replace("}","},").replace("[","[,").replace("]","],");
        s =  s.substring(0, s.length()-1);
        String[] str2 = s.split(",");
        String twoStr = "";
        Stack<String> stack = new Stack();
        stack.push("s");
        for(int  i=0;i<str2.length;i++){
            boolean doubleNum = i/2 == 0;
            if(doubleNum){
                twoStr = str2[i];
            }else{
                twoStr += str2[i];
                if(str.indexOf(twoStr) < 0){
                    return false;
                }
            }
        }
        return true;
    }
}
*/
