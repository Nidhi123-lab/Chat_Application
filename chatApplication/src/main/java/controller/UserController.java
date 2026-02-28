/*package controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import entity.User;
import jakarta.servlet.http.HttpServletRequest;
import service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.findById(userId);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @GetMapping("/online")
    public ResponseEntity<List<User>> getOnlineUsers() {
        return ResponseEntity.ok(userService.getOnlineUsers());
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<User> updateUserStatus(
        @PathVariable String userId,
        @RequestParam boolean online) {
        User user = userService.updateUserStatus(userId, online);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }
    
 // Add to UserController.java
    @PostMapping("/{userId}/friends/{friendId}")
    public ResponseEntity<?> addFriend(@PathVariable String userId, @PathVariable String friendId, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).body("You can only manage your own friends");
        }
        boolean success = userService.addFriend(userId, friendId);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Failed to add friend");
    }

    @DeleteMapping("/{userId}/friends/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable String userId, @PathVariable String friendId, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).body("You can only manage your own friends");
        }
        boolean success = userService.removeFriend(userId, friendId);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Failed to remove friend");
    }

    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<User>> getFriends(@PathVariable String userId, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.getFriends(userId));
    }
}*/

package controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import entity.User;
import jakarta.servlet.http.HttpServletRequest;
import service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userService.findById(userId);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @GetMapping("/online")
    public ResponseEntity<List<User>> getOnlineUsers() {
        return ResponseEntity.ok(userService.getOnlineUsers());
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<User> updateUserStatus(
        @PathVariable String userId,
        @RequestParam boolean online) {
        User user = userService.updateUserStatus(userId, online);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }
    
 // Add to UserController.java
    @PostMapping("/{userId}/friends/{friendId}")
    public ResponseEntity<?> addFriend(@PathVariable String userId, @PathVariable String friendId, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).body("You can only manage your own friends");
        }
        boolean success = userService.addFriend(userId, friendId);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Failed to add friend");
    }

    @DeleteMapping("/{userId}/friends/{friendId}")
    public ResponseEntity<?> removeFriend(@PathVariable String userId, @PathVariable String friendId, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).body("You can only manage your own friends");
        }
        boolean success = userService.removeFriend(userId, friendId);
        return success ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Failed to remove friend");
    }

    @GetMapping("/{userId}/friends")
    public ResponseEntity<List<User>> getFriends(@PathVariable String userId, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (!currentUserId.equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(userService.getFriends(userId));
    }
}