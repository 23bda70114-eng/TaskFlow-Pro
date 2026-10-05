package com.taskflow.backend.service;

import com.taskflow.backend.entity.Activity;
import com.taskflow.backend.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    private final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public Activity addActivity(Long taskId, String action) {

        Activity activity = new Activity();

        activity.setTaskId(taskId);
        activity.setAction(action);
        activity.setAuthor("Javed");
        activity.setCreatedAt(
                LocalDateTime.now().format(formatter)
        );

        return activityRepository.save(activity);
    }

    public List<Activity> getActivitiesByTaskId(Long taskId) {
        return activityRepository.findByTaskIdOrderByIdDesc(taskId);
    }
}