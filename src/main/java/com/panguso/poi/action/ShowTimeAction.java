package com.panguso.poi.action;

import com.panguso.poi.service.MTimeService;
import com.panguso.poi.utils.MovieParams;
import com.panguso.poi.utils.OutPutCommon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 *
 * @author: saint
 * date: 13-3-26
 */
@Controller
@RequestMapping("/showtime")
public class ShowTimeAction {

    @Autowired
    MTimeService mTimeService;

    @RequestMapping(value = "/movies")
    public void movies(MovieParams movieParams, HttpServletRequest request, HttpServletResponse response) {
        try {
            OutPutCommon.outputJSONResult(mTimeService.getCinemaMovies(movieParams.getCity_id(), movieParams.getCinema_id()), response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e, response);
        }
    }

    @RequestMapping(value = "/cinemas")
    public void cinemas(MovieParams movieParams, HttpServletRequest request, HttpServletResponse response) {
        try {
            OutPutCommon.outputJSONResult(mTimeService.getShowTimeCinemas(movieParams.getCity_id()), response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e, response);
        }
    }

    @RequestMapping(value = "/movie")
    public void movie(MovieParams movieParams, HttpServletRequest request, HttpServletResponse response) {
        try {
            OutPutCommon.outputJSONResult(mTimeService.getShowTime(movieParams.getId()), response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e, response);
        }
    }

    //    URI: /showtime/showTimesByCinemaMovieDate/1763/115128/2013-03-27/
    @RequestMapping(value = "/showTimesByCinemaMovieDate")
    public void showTimesByCinemaMovieDate(MovieParams movieParams, HttpServletRequest request, HttpServletResponse response) {
        try {
            OutPutCommon.outputJSONResult(mTimeService.showTimesByCinemaMovieDate(movieParams.getCinema_id(),
                    movieParams.getMovie_id(), movieParams.getDate()), response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e, response);
        }
    }
}
