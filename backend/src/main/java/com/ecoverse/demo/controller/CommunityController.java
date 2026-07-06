package com.ecoverse.demo.controller;

import com.ecoverse.demo.entity.*;
import com.ecoverse.demo.repository.*;
import com.ecoverse.demo.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/community")
public class CommunityController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/posts")
    public ResponseEntity<List<Map<String, Object>>> getPosts(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        
        List<Map<String, Object>> response = posts.stream().map(post -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", post.getId());
            map.put("author", post.getAuthor());
            map.put("role", post.getRole());
            map.put("avatar", post.getAvatar());
            map.put("time", getRelativeTime(post.getCreatedAt()));
            map.put("content", post.getContent());
            map.put("likes", post.getLikedByUsers().size());
            map.put("liked", post.getLikedByUsers().stream().anyMatch(u -> u.getId().equals(user.getId())));
            
            List<Map<String, Object>> commentMaps = post.getComments().stream().map(c -> {
                Map<String, Object> cmap = new HashMap<>();
                cmap.put("author", c.getAuthor());
                cmap.put("text", c.getText());
                return cmap;
            }).collect(Collectors.toList());
            map.put("comments", commentMaps);
            
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/posts")
    public ResponseEntity<?> createPost(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Content cannot be empty");
        }

        Post post = Post.builder()
                .author(user.getFullName())
                .role(getCommunityRole(user.getLevel()))
                .avatar(user.getFullName().substring(0, 1).toUpperCase())
                .content(content)
                .createdAt(LocalDateTime.now())
                .build();

        postRepository.save(post);
        return ResponseEntity.ok(Map.of("message", "Post created successfully!"));
    }

    @PostMapping("/posts/{id}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found!"));

        boolean alreadyLiked = post.getLikedByUsers().stream().anyMatch(u -> u.getId().equals(user.getId()));
        if (alreadyLiked) {
            post.getLikedByUsers().removeIf(u -> u.getId().equals(user.getId()));
        } else {
            post.getLikedByUsers().add(user);
        }

        postRepository.save(post);
        return ResponseEntity.ok(Map.of("message", "Like status updated successfully!"));
    }

    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<?> addComment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> body) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found!"));
        
        String text = body.get("text");
        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Comment text cannot be empty");
        }

        Comment comment = Comment.builder()
                .author(user.getFullName())
                .text(text)
                .createdAt(LocalDateTime.now())
                .post(post)
                .build();

        commentRepository.save(comment);
        return ResponseEntity.ok(Map.of("message", "Comment added successfully!"));
    }

    private String getRelativeTime(LocalDateTime dateTime) {
        if (dateTime == null) return "Unknown";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long seconds = duration.getSeconds();
        if (seconds < 60) return "Just now";
        long minutes = seconds / 60;
        if (minutes < 60) return minutes + "m ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + "h ago";
        long days = hours / 24;
        return days + "d ago";
    }

    private String getCommunityRole(int level) {
        if (level <= 1) return "Green Cadet";
        if (level <= 3) return "Eco Active";
        if (level <= 5) return "Forest Guardian";
        return "Eco Warrior";
    }
}
