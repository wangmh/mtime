package com.panguso.poi.action;

import com.panguso.poi.service.MTimeService;
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
@RequestMapping("/movies")
public class MovieAction {

    @Autowired
    MTimeService mTimeService;


    @RequestMapping(value="/show")
    public void show(String id, HttpServletRequest request, HttpServletResponse response) {
        try {
            OutPutCommon.outputJSONResult(MTimeService.getInstance().mtimePost("/showtime/" + id + "/movies/"), response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e, response);
        }
    }

    @RequestMapping(value="/coming")
    public void coming(String id, HttpServletRequest request, HttpServletResponse response) {
        try {
            OutPutCommon.outputJSONResult(MTimeService.getInstance().getComingMovie(),response);
        } catch (Exception e) {
            e.printStackTrace();
            OutPutCommon.outputErrorJSONResult(e, response);
        }
    }
}
