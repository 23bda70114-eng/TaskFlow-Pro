package com.taskflow.backend.service;

import com.taskflow.backend.entity.Task;
import com.taskflow.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Add Task
    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    // Get All Tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get Task By Id
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow();
    }

    // Update Task
    public Task updateTask(Long id, Task updatedTask) {

        Task task = taskRepository.findById(id).orElseThrow();

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());

        return taskRepository.save(task);
    }

    // Delete Task
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}