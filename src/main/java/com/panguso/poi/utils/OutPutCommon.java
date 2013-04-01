package com.panguso.poi.utils;

import com.alibaba.fastjson.JSONObject;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created with IntelliJ IDEA.
 * User: saint
 * Date: 12-11-15
 * Time: 上午12:17
 * To change this template use File | Settings | File Templates.
 */
public class OutPutCommon {

    public static void outputJSONResult(String result,
                                        HttpServletResponse response) {

        try {
            response.setHeader("Content-Type", "application/json;charset=UTF-8");
            response.setHeader("Cache-Control", "no-cache");
            response.setCharacterEncoding("utf-8");
            PrintWriter pw = response.getWriter();

            pw.write(result);
            pw.flush();
            pw.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    public static void outputErrorJSONResult( Exception ex, HttpServletResponse response) {

        try {
            response.setHeader("ContentType", "text/json;charset=UTF-8");
            response.setHeader("Cache-Control", "no-cache");
            response.setCharacterEncoding("utf-8");
            PrintWriter pw = response.getWriter();
            JSONObject ob = new JSONObject();
            ob.put("errorCode", "100000");
            ob.put("errorMsg", ex.getMessage());

            pw.write(ob.toJSONString());
            pw.flush();
            pw.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
