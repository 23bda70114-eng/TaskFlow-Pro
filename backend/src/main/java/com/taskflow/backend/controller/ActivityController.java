package com.taskflow.backend.controller;

import com.taskflow.backend.entity.Activity;
import com.taskflow.backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin("*")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @PostMapping
    public Activity addActivity(
            @RequestParam Long taskId,
            @RequestParam String action
    ) {
        return activityService.addActivity(taskId, action);
    }

    @GetMapping("/task/{taskId}")
    public List<Activity> getActivitiesByTaskId(
            @PathVariable Long taskId
    ) {
        return activityService.getActivitiesByTaskId(taskId);
    }
}