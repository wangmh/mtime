package com.panguso.poi.service;

import com.panguso.poi.utils.CommonUtils;
import com.panguso.poi.utils.GlobalConfig;
import com.panguso.poi.utils.HttpClientFactory;
import com.panguso.poi.utils.MD5Utils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;
import org.tuckey.web.filters.urlrewrite.utils.StringUtils;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: saint
 * date: 13-3-26
 */
@Service
public class MTimeService {
    static class MTimeServiceHolder{
        static  MTimeService mTimeService = new  MTimeService();
    }

    private MTimeService(){

    }

    public static MTimeService getInstance(){
        return MTimeServiceHolder.mTimeService;
    }


    public String getCinemaMovie(int id) throws URISyntaxException, IOException {
        String date = CommonUtils.getCurrentDate();
        return getCinemaMovie(id + "", date);
    }

    public String getCinemaMovie(String id) throws URISyntaxException, IOException {
        String date = CommonUtils.getCurrentDate();
        return getCinemaMovie(id, date);
    }

    public String getCinemaMovies(String cityId, String cinameId) throws IOException, URISyntaxException {
        return mtimeGet("/showtime/" + cityId + "/"+ cinameId + "/movies/");
    }

    public String getCinemaMovie(String id, String date) throws URISyntaxException, IOException {
        if (StringUtils.isBlank(date)) {
            return getCinemaMovie(id);
        }
        String path  =  "/cinema/movie/" + id +  "/" + date;
        return mtimeGet(path);
    }

    public String showtimeByOnlineMoviesByCity(String id) throws IOException, URISyntaxException {
        String path = "/showtime/OnlineMoviesByCity/" + id;
        return mtimeGet(path);
    }



    public String getComingMovie() throws IOException, URISyntaxException {
        String path = "/showtime/comingmovies/"  ;
        return mtimeGet(path);

    }
    public String showTimesByCinemaMovieDate(String cinemaId, String movieId, String date) throws URISyntaxException, IOException {

        String path  =  "/showtime/showTimesByCinemaMovieDate/" + cinemaId + "/" + movieId +"/" + date + "/";
        return mtimeGet(path);
    }



    public String getShowTime(String id) throws URISyntaxException, IOException {

        String path  =  "/showtime/" + id  ;
        return mtimeGet(path);
    }


    public String getShowTimeCinemas(String cityId) throws URISyntaxException, IOException {

        String path  =  "/showtime/" + cityId + "/cinemas" ;
        return mtimeGet(path);
    }


    public String getCinemas(String cityId) throws URISyntaxException, IOException {

        String path  =  "/OnlineLocationCinema/OnlineCinemasByCity/" + cityId ;
        return mtimeGet(path);
    }



    /**
     * @param path
     * @return
     * @throws URISyntaxException
     * @throws IOException
     * @throws
     * @author saint
     * @date 2013-1-18
     */
    public String mtimeGet(String path) throws URISyntaxException, IOException
    {
        URIBuilder builder = new URIBuilder();

        builder.setScheme(GlobalConfig.SCHEME).setHost(GlobalConfig.HOST).setPath(path) ;
        URI uri = builder.build();
        HttpGet httpGet = new HttpGet(uri);
        Long time = System.currentTimeMillis();
        String md5Params = MD5Utils.md5(GlobalConfig.APPKEY + GlobalConfig.SECKRETKEY + time +
                GlobalConfig.SCHEME + "://" + GlobalConfig.HOST + path);
        httpGet.setHeader(GlobalConfig.MTIME_SPECIAL_HEADER, GlobalConfig.APPKEY + "," + time + "," + md5Params + ",all");
        HttpClient httpClient = HttpClientFactory.getInstance();
        HttpResponse httpResponse =  httpClient.execute(httpGet);
        HttpEntity entity = httpResponse.getEntity();
        if(entity == null){
            return  null;
        }
        return EntityUtils.toString(entity);
    }


    /**
     * @param path
     * @return
     * @throws URISyntaxException
     * @throws IOException
     * @throws
     * @author saint
     * @date 2013-1-18
     */
    public String mtimePost(String path) throws URISyntaxException, IOException
    {
        URIBuilder builder = new URIBuilder();
        builder.setScheme(GlobalConfig.SCHEME).setHost(GlobalConfig.HOST).setPath(path) ;
        URI uri = builder.build();
        HttpPost httpPost = new HttpPost(uri);
        Long time = System.currentTimeMillis();
        String md5Params = MD5Utils.md5(GlobalConfig.APPKEY + GlobalConfig.SECKRETKEY + time +
                GlobalConfig.SCHEME + "://" + GlobalConfig.HOST + path);
        httpPost.setHeader(GlobalConfig.MTIME_SPECIAL_HEADER, GlobalConfig.APPKEY + "," + time + "," + md5Params + ",all");
        HttpClient httpClient = HttpClientFactory.getInstance();
        HttpResponse httpResponse =  httpClient.execute(httpPost);
        HttpEntity entity = httpResponse.getEntity();
        if(entity == null){
            return  null;
        }
        return EntityUtils.toString(entity);
    }

    public String getCinema(int cinemaId) throws URISyntaxException, IOException {
        return getCinema("" + cinemaId);
    }

    public String getCinema(String cinemaId) throws URISyntaxException, IOException {
        String path  =  "/cinema/" + cinemaId ;
        return mtimeGet(path);
    }
}
