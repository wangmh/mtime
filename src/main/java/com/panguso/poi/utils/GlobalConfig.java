package com.panguso.poi.utils;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: saint
 * date: 12-12-6
 */
/**
 * GlobalConfig
 *
 * @author saint
 * @date 2013-1-18
 */
public final class GlobalConfig {

    /**
     * scheme
     */
    public static final String SCHEME = "http";

    /**
     * mtime api host
     */
    public static final  String HOST =  "api.m.mtime.cn";

    /**
     * appKey
     */
    public static final  String APPKEY = "6";

    /**
     * secretKey
     */
    public static final String SECKRETKEY = "1B295AF8C7F14469ADEBF5E87D7408B4";

    /**
     * mtimeSpecial
     */
    public static final String MTIME_SPECIAL_HEADER = "X-Mtime-Mobile-CheckValue";

    /**
     * beigjingId
     */
    public static final String BEIJINGCITYID = "290";

    /**
     * factory
     *
     * @author saint
     * @date 2013-1-18
     */
    static class GlobalConfigHolder {
        private static GlobalConfig globalConfig = new GlobalConfig();

        public static GlobalConfig globalConfig() {
            return globalConfig;
        }
    }

    /**
     * getInstance
     *
     * @return
     * @author saint
     * @date 2013-1-18
     */
    public static GlobalConfig getInstance() {
        return  GlobalConfigHolder.globalConfig();
    }

    private GlobalConfig() {

    }


}