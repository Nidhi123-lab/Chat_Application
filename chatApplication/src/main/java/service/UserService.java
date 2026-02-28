/*package service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import entity.User;
import repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getOnlineUsers() {
        return userRepository.findByOnlineTrue();
    }

    public User updateUserStatus(String userId, boolean online) {
        User user = findById(userId);
        if (user != null) {
            user.setOnline(online);
            return userRepository.save(user);
        }
        return null;
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameRegex(query);
    }
    
 // Add to UserService.java
    public boolean addFriend(String userId, String friendId) {
        if (userId.equals(friendId)) return false; // Can't friend yourself
        User user = findById(userId);
        User friend = findById(friendId);
        if (user == null || friend == null) return false;
        user.getFriends().add(friendId);
        friend.getFriends().add(userId); // Mutual
        userRepository.save(user);
        userRepository.save(friend);
        return true;
    }

    public boolean removeFriend(String userId, String friendId) {
        User user = findById(userId);
        User friend = findById(friendId);
        if (user == null || friend == null) return false;
        user.getFriends().remove(friendId);
        friend.getFriends().remove(userId); // Mutual
        userRepository.save(user);
        userRepository.save(friend);
        return true;
    }

    public List<User> getFriends(String userId) {
        User user = findById(userId);
        if (user == null || user.getFriends().isEmpty()) return List.of();
        return userRepository.findAllById(user.getFriends());
    }
}*/

package service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import entity.User;
import repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User findById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getOnlineUsers() {
        return userRepository.findByOnlineTrue();
    }

    public User updateUserStatus(String userId, boolean online) {
        User user = findById(userId);
        if (user != null) {
            user.setOnline(online);
            return userRepository.save(user);
        }
        return null;
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameRegex(query);
    }
    
 // Add to UserService.java
    public boolean addFriend(String userId, String friendId) {
        if (userId.equals(friendId)) return false; // Can't friend yourself
        User user = findById(userId);
        User friend = findById(friendId);
        if (user == null || friend == null) return false;
        user.getFriends().add(friendId);
        friend.getFriends().add(userId); // Mutual
        userRepository.save(user);
        userRepository.save(friend);
        return true;
    }

    public boolean removeFriend(String userId, String friendId) {
        User user = findById(userId);
        User friend = findById(friendId);
        if (user == null || friend == null) return false;
        user.getFriends().remove(friendId);
        friend.getFriends().remove(userId); // Mutual
        userRepository.save(user);
        userRepository.save(friend);
        return true;
    }

    public List<User> getFriends(String userId) {
        User user = findById(userId);
        if (user == null || user.getFriends().isEmpty()) return List.of();
        return userRepository.findAllById(user.getFriends());
    }
}