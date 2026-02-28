/*package service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import entity.Group;

@Service
public class GroupService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    public Group createGroup(Group group) {
        group.setCreatedAt(LocalDateTime.now());
        return mongoTemplate.save(group);
    }
    
    public Group addMember(String groupId, String userId) {
        return mongoTemplate.findAndModify(
            Query.query(Criteria.where("id").is(groupId)), 
            new Update().addToSet("members", userId),
            Group.class
        );
    }
    
    public List<Group> getUserGroups(String userId) {
        return mongoTemplate.find(Query.query(Criteria.where("members").in(userId)), Group.class);
    }
    
    public Group getGroupById(String groupId) {
        return mongoTemplate.findById(groupId, Group.class);
    }
}*/

package service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import entity.Group;

@Service
public class GroupService {

    @Autowired
    private MongoTemplate mongoTemplate;
    
    public Group createGroup(Group group) {
        group.setCreatedAt(LocalDateTime.now());
        return mongoTemplate.save(group);
    }
    
    public Group addMember(String groupId, String userId) {
        return mongoTemplate.findAndModify(
            Query.query(Criteria.where("id").is(groupId)), 
            new Update().addToSet("members", userId),
            Group.class
        );
    }
    
    public List<Group> getUserGroups(String userId) {
        return mongoTemplate.find(Query.query(Criteria.where("members").in(userId)), Group.class);
    }
    
    public Group getGroupById(String groupId) {
        return mongoTemplate.findById(groupId, Group.class);
    }
}