package com.taskflow.backend.repository;

import com.taskflow.backend.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByTaskIdOrderByIdDesc(Long taskId);
}