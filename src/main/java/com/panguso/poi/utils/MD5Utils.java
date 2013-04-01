package com.panguso.poi.utils;

import org.apache.log4j.Logger;

import java.security.MessageDigest;


/**
 * Created with IntelliJ IDEA.
 *
 * @author: saint
 * date: 12-12-6
 */
public class MD5Utils {
    private static Logger logger = Logger.getLogger(MD5Utils.class.getName());
    public static String md5(String source) {

        StringBuilder sb = new StringBuilder(32);

        try {
            MessageDigest md 	= MessageDigest.getInstance("MD5");
            byte[] array 		= md.digest(source.getBytes("utf-8"));

            for (byte anArray : array) {
                sb.append(Integer.toHexString((anArray & 0xFF) | 0x100).toUpperCase().substring(1, 3));
            }
        } catch (Exception e) {
            logger.error("Can not encode the string '" + source + "' to MD5!", e);
            return null;
        }
        return sb.toString().toLowerCase();
    }
}


