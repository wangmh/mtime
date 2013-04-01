package com.panguso.poi.action;

import com.panguso.poi.service.MTimeService;
import com.panguso.poi.utils.LandMarkParams;
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
 * date: 12-12-4
 */
@Controller
@RequestMapping("/cinema")
public class CinemaAction {

    @Autowired
    MTimeService mTimeService;
    @RequestMapping(value="/show")
    public void show(LandMarkParams clusterParams,HttpServletRequest request, HttpServletResponse response){
        String id = clusterParams.getId();
        try {
            OutPutCommon.outputJSONResult(mTimeService.getCinema(id), response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e,response);
        }
    }

    @RequestMapping(value="/movie")
    public void movie(MovieParams movieParams,HttpServletRequest request, HttpServletResponse response){
        try {
            OutPutCommon.outputJSONResult(mTimeService.getCinemaMovies(movieParams.getCity_id(), movieParams.getCinema_id()), response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e,response);
        }
    }
}
