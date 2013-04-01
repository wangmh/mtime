package com.panguso.poi.utils;


import org.apache.http.HttpVersion;
import org.apache.http.client.HttpClient;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.PoolingClientConnectionManager;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.CoreConnectionPNames;
import org.apache.http.params.HttpParams;
import org.apache.http.params.HttpProtocolParamBean;
import org.apache.log4j.Logger;


/**
 * Created with IntelliJ IDEA.
 *
 * @author: saint
 * date: 12-12-6
 */
public class HttpClientFactory {

    Logger logger = Logger.getLogger(HttpClientFactory.class.getName());
    private static HttpClient httpClient;


    public static  HttpClient getInstance(){
        if(httpClient == null){
            HttpParams params = new BasicHttpParams();
            HttpProtocolParamBean paramsBean = new HttpProtocolParamBean(params);
            paramsBean.setVersion(HttpVersion.HTTP_1_1);
            paramsBean.setContentCharset("UTF-8");
            paramsBean.setUserAgent("Linux; Android 2.2.1;zh-CN; Mtime_Android_weibo");
            paramsBean.setUseExpectContinue(true);
            params.setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 10000);
            params.setParameter(CoreConnectionPNames.SO_TIMEOUT, 10000);
            SchemeRegistry schemeRegistry = new SchemeRegistry();
            schemeRegistry.register(
                    new Scheme("http", 80, PlainSocketFactory.getSocketFactory()));
            PoolingClientConnectionManager cm = new PoolingClientConnectionManager(schemeRegistry);
            cm.setMaxTotal(200);
            cm.setDefaultMaxPerRoute(20);
            httpClient = new DefaultHttpClient(cm, params) ;
        }
        return httpClient;
    }





}
