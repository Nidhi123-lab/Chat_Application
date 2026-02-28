/*package service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import entity.Status;
import entity.User;

@Service
public class StatusService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private UserService userService; // Ensure this is injected
    
    public Status createStatus(Status status) {
        status.setCreatedAt(LocalDateTime.now());
        status.setExpiresAt(LocalDateTime.now().plusHours(24));
        return mongoTemplate.save(status);
    }
    
    public List<Status> getFriendStatusesForUser(String userId) {
        User user = userService.findById(userId);
        if (user == null || user.getFriends().isEmpty()) {
            return List.of();
        }
        List<Status> statuses = mongoTemplate.find(
            Query.query(Criteria.where("userId").in(user.getFriends())
                .and("expiresAt").gt(LocalDateTime.now())),
            Status.class
        );
        // New: Populate username and profilePhotoUrl for each status
        return statuses.stream().map(status -> {
            User statusUser = userService.findById(status.getUserId());
            if (statusUser != null) {
                status.setUsername(statusUser.getUsername());
                status.setProfilePhotoUrl(statusUser.getProfilePhotoUrl());
            }
            return status;
        }).collect(Collectors.toList());
    }
    
    public void markStatusViewed(String statusId, String userId) {
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("id").is(statusId)), 
            new Update().inc("viewCount", 1).addToSet("viewedBy", userId), 
            Status.class
        );
    }
}*/

package service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import entity.Status;
import entity.User;

@Service
public class StatusService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private UserService userService; // Ensure this is injected
    
    public Status createStatus(Status status) {
        status.setCreatedAt(LocalDateTime.now());
        status.setExpiresAt(LocalDateTime.now().plusHours(24));
        return mongoTemplate.save(status);
    }
    
    public List<Status> getFriendStatusesForUser(String userId) {
        User user = userService.findById(userId);
        if (user == null || user.getFriends().isEmpty()) {
            return List.of();
        }
        List<Status> statuses = mongoTemplate.find(
            Query.query(Criteria.where("userId").in(user.getFriends())
                .and("expiresAt").gt(LocalDateTime.now())),
            Status.class
        );
        // New: Populate username and profilePhotoUrl for each status
        return statuses.stream().map(status -> {
            User statusUser = userService.findById(status.getUserId());
            if (statusUser != null) {
                status.setUsername(statusUser.getUsername());
                status.setProfilePhotoUrl(statusUser.getProfilePhotoUrl());
            }
            return status;
        }).collect(Collectors.toList());
    }
    
    public void markStatusViewed(String statusId, String userId) {
        mongoTemplate.updateFirst(
            Query.query(Criteria.where("id").is(statusId)), 
            new Update().inc("viewCount", 1).addToSet("viewedBy", userId), 
            Status.class
        );
    }
}