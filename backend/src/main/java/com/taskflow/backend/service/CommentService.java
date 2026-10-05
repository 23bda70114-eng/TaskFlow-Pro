package com.taskflow.backend.service;

import com.taskflow.backend.entity.Comment;
import com.taskflow.backend.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTaskId(Long taskId) {
        return commentRepository.findByTaskIdOrderByIdAsc(taskId);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}