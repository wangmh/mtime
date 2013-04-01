package com.panguso.poi.utils;

import org.junit.Test;

import java.util.Calendar;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: saint
 * date: 12-12-7
 */
public class CommonUtils {
    private static Calendar calendar = null;
    static {
        calendar = Calendar.getInstance();
    }

    @Test
    public void test() {
        System.out.println("111".substring(1,4));
    }


    public static String getCurrentDate(){
        int year = calendar.get(Calendar.YEAR);
        int month = calendar.get(Calendar.MONTH) + 1;
        int day = calendar.get(Calendar.DAY_OF_MONTH);
        return "" + year + "-" +  month + "-" + day;
    }

}
