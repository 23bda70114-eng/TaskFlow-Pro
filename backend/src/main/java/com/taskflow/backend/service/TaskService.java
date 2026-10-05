package com.taskflow.backend.service;

import com.taskflow.backend.entity.Task;
import com.taskflow.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ActivityService activityService;

    private final DateTimeFormatter dateFormatter =
            DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public Task addTask(Task task) {

        Task savedTask = taskRepository.save(task);

        activityService.addActivity(
                savedTask.getId(),
                "Task created: " + savedTask.getTitle()
        );

        return savedTask;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow();
    }

    public Task updateTask(Long id, Task updatedTask) {

        Task task = taskRepository.findById(id).orElseThrow();

        String oldStatus = task.getStatus();
        String oldPriority = task.getPriority();
        String oldTitle = task.getTitle();

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setPriority(updatedTask.getPriority());
        task.setDueDate(updatedTask.getDueDate());
        task.setCategory(updatedTask.getCategory());
        task.setTags(updatedTask.getTags());
        task.setRecurrence(updatedTask.getRecurrence());

        Task savedTask = taskRepository.save(task);

        if (!oldTitle.equals(savedTask.getTitle())) {
            activityService.addActivity(
                    savedTask.getId(),
                    "Task title changed to: " + savedTask.getTitle()
            );
        }

        if (
                oldStatus != null &&
                savedTask.getStatus() != null &&
                !oldStatus.equals(savedTask.getStatus())
        ) {
            activityService.addActivity(
                    savedTask.getId(),
                    "Status changed from " +
                            oldStatus +
                            " to " +
                            savedTask.getStatus()
            );
        }

        if (
                oldPriority != null &&
                savedTask.getPriority() != null &&
                !oldPriority.equals(savedTask.getPriority())
        ) {
            activityService.addActivity(
                    savedTask.getId(),
                    "Priority changed from " +
                            oldPriority +
                            " to " +
                            savedTask.getPriority()
            );
        }

        if (
                !"Completed".equals(oldStatus) &&
                "Completed".equals(savedTask.getStatus()) &&
                savedTask.getRecurrence() != null &&
                !savedTask.getRecurrence().equals("None") &&
                savedTask.getDueDate() != null &&
                !savedTask.getDueDate().isEmpty()
        ) {
            createNextRecurringTask(savedTask);
        }

        return savedTask;
    }

    private void createNextRecurringTask(Task completedTask) {

        LocalDate currentDueDate =
                LocalDate.parse(
                        completedTask.getDueDate(),
                        dateFormatter
                );

        LocalDate nextDueDate = currentDueDate;

        if ("Daily".equals(completedTask.getRecurrence())) {
            nextDueDate = currentDueDate.plusDays(1);
        } else if ("Weekly".equals(completedTask.getRecurrence())) {
            nextDueDate = currentDueDate.plusWeeks(1);
        } else if ("Monthly".equals(completedTask.getRecurrence())) {
            nextDueDate = currentDueDate.plusMonths(1);
        }

        Task nextTask = new Task();

        nextTask.setTitle(completedTask.getTitle());
        nextTask.setDescription(completedTask.getDescription());
        nextTask.setStatus("Pending");
        nextTask.setPriority(completedTask.getPriority());
        nextTask.setDueDate(nextDueDate.format(dateFormatter));
        nextTask.setCategory(completedTask.getCategory());
        nextTask.setTags(completedTask.getTags());
        nextTask.setRecurrence(completedTask.getRecurrence());

        Task savedNextTask = taskRepository.save(nextTask);

        activityService.addActivity(
                savedNextTask.getId(),
                "Recurring task created automatically"
        );
    }

    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id).orElseThrow();

        activityService.addActivity(
                task.getId(),
                "Task deleted: " + task.getTitle()
        );

        taskRepository.deleteById(id);
    }
}