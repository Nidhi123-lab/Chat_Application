/*package service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import entity.ChatMessage;
import entity.Group;

@Service
public class ChatService {

    @Autowired
    private SimpMessagingTemplate messageTemplate;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private GroupService groupService;
    
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    public ChatMessage sendMessage(ChatMessage message, String currentUserId) {
        logger.info("Received message: chatId={}, isGroupMessage={}, senderId={}", 
                    message.getChatId(), message.isGroupMessage(), message.getSenderId());
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }
        
        if (message.getSenderId() == null) {
            message.setSenderId(currentUserId);
        }
        
        if (!message.getSenderId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only send messages as yourself");
        }
        
        if (!message.isGroupMessage()) {
            // Private chat validation
            if (message.getChatId() == null || !message.getChatId().contains("_")) {
                throw new IllegalArgumentException("Invalid private chat ID: Must be in format user1_user2");
            }
            String[] participants = message.getChatId().split("_");
            if (participants.length != 2) {
                throw new IllegalArgumentException("Invalid private chat ID: Must have exactly two participants");
            }
            if (!currentUserId.equals(participants[0]) && !currentUserId.equals(participants[1])) {
                throw new AccessDeniedException("You are not a participant in this private chat");
            }
            message.setDelivered(true);
        } else {
            // Group validation
            logger.info("Checking group: chatId={}, currentUserId={}", message.getChatId(), currentUserId);
            Group group = groupService.getGroupById(message.getChatId());
            if (group == null) {
                logger.error("Group not found: {}", message.getChatId());
                throw new AccessDeniedException("Group not found");
            }
            if (!group.getMembers().contains(currentUserId)) {
                logger.error("User not in group: user={}, group={}", currentUserId, message.getChatId());
                throw new AccessDeniedException("You are not a member of this group");
            }
            message.setDelivered(true);
        }
        
        // Save once
        message = mongoTemplate.save(message);
        logger.info("Message saved: {}", message.getId());
        
        // Broadcast via WebSocket (add this)
        try {
        	if (message.isGroupMessage()) {
        	    messageTemplate.convertAndSend("/topic/group/" + message.getChatId(), message);
        	} else {
        	    String[] ids = message.getChatId().split("_");
        	    messageTemplate.convertAndSendToUser(ids[0], "/queue/private", message);
        	    messageTemplate.convertAndSendToUser(ids[1], "/queue/private", message);
        	}
        } catch (Exception e) {
            logger.error("Failed to broadcast message: {}", e.getMessage());
        }
        
        return message;
    }
    
    public List<ChatMessage> getChatHistory(String chatId, boolean isGroup, String currentUserId) {
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.ASC, "timestamp"));
        return getChatHistory(chatId, isGroup, currentUserId, pageable);
    }
    
    
    
    public List<ChatMessage> getChatHistory(String chatId, boolean isGroup, String currentUserId, Pageable pageable) {
        if (!isGroup) {
            if (chatId == null || !chatId.contains("_")) {
                throw new AccessDeniedException("Invalid private chat ID");
            }
            String[] participants = chatId.split("_");
            if (participants.length != 2 || (!currentUserId.equals(participants[0]) && !currentUserId.equals(participants[1]))) {
                throw new AccessDeniedException("You are not a participant in this private chat");
            }
        }
        
        Query query = Query.query(Criteria.where("chatId").is(chatId));
        if (isGroup) {
            query.addCriteria(Criteria.where("isGroupMessage").is(true));
        }
        
        if (pageable != null) {
            Sort sort = pageable.getSort();
            if (sort != null && sort.isSorted()) {
                query.with(sort);
            } else {
                query.with(Sort.by(Sort.Direction.ASC, "timestamp"));
            }
            query.limit(pageable.getPageSize());
            query.skip(pageable.getOffset());
        }
        
        return mongoTemplate.find(query, ChatMessage.class);
    }
    
    public ChatMessage getLastMessage(String chatId, boolean isGroup, String currentUserId) {
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "timestamp"));
        List<ChatMessage> messages = getChatHistory(chatId, isGroup, currentUserId, pageable);
        return messages.isEmpty() ? null : messages.get(0);
    }
    
    public String generatePrivateChatId(String userId1, String userId2) {
        if (userId1 == null || userId2 == null || userId1.equals(userId2)) {
            throw new IllegalArgumentException("Invalid users: Cannot chat with yourself or missing IDs");
        }
        String id1 = userId1.compareTo(userId2) < 0 ? userId1 : userId2;
        String id2 = userId1.compareTo(userId2) < 0 ? userId2 : userId1;
        return id1 + "_" + id2;
    }
}*/

package service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import entity.ChatMessage;
import entity.Group;

@Service
public class ChatService {

    @Autowired
    private SimpMessagingTemplate messageTemplate;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private GroupService groupService;
    
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    public ChatMessage sendMessage(ChatMessage message, String currentUserId) {
        logger.info("Received message: chatId={}, isGroupMessage={}, senderId={}", 
                    message.getChatId(), message.isGroupMessage(), message.getSenderId());
        if (message.getTimestamp() == null) {
            message.setTimestamp(LocalDateTime.now());
        }
        
        if (message.getSenderId() == null) {
            message.setSenderId(currentUserId);
        }
        
        if (!message.getSenderId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only send messages as yourself");
        }
        
        if (!message.isGroupMessage()) {
            // Private chat validation
            if (message.getChatId() == null || !message.getChatId().contains("_")) {
                throw new IllegalArgumentException("Invalid private chat ID: Must be in format user1_user2");
            }
            String[] participants = message.getChatId().split("_");
            if (participants.length != 2) {
                throw new IllegalArgumentException("Invalid private chat ID: Must have exactly two participants");
            }
            if (!currentUserId.equals(participants[0]) && !currentUserId.equals(participants[1])) {
                throw new AccessDeniedException("You are not a participant in this private chat");
            }
            message.setDelivered(true);
        } else {
            // Group validation
            logger.info("Checking group: chatId={}, currentUserId={}", message.getChatId(), currentUserId);
            Group group = groupService.getGroupById(message.getChatId());
            if (group == null) {
                logger.error("Group not found: {}", message.getChatId());
                throw new AccessDeniedException("Group not found");
            }
            if (!group.getMembers().contains(currentUserId)) {
                logger.error("User not in group: user={}, group={}", currentUserId, message.getChatId());
                throw new AccessDeniedException("You are not a member of this group");
            }
            message.setDelivered(true);
        }
        
        // Save once
        message = mongoTemplate.save(message);
        logger.info("Message saved: {}", message.getId());
        
        // Broadcast via WebSocket (add this)
        try {
        	if (message.isGroupMessage()) {
        	    messageTemplate.convertAndSend("/topic/group/" + message.getChatId(), message);
        	} else {
        	    String[] ids = message.getChatId().split("_");
        	    messageTemplate.convertAndSendToUser(ids[0], "/queue/private", message);
        	    messageTemplate.convertAndSendToUser(ids[1], "/queue/private", message);
        	}
        } catch (Exception e) {
            logger.error("Failed to broadcast message: {}", e.getMessage());
        }
        
        return message;
    }
    
    public List<ChatMessage> getChatHistory(String chatId, boolean isGroup, String currentUserId) {
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.ASC, "timestamp"));
        return getChatHistory(chatId, isGroup, currentUserId, pageable);
    }
    
    
    
    public List<ChatMessage> getChatHistory(String chatId, boolean isGroup, String currentUserId, Pageable pageable) {
        if (!isGroup) {
            if (chatId == null || !chatId.contains("_")) {
                throw new AccessDeniedException("Invalid private chat ID");
            }
            String[] participants = chatId.split("_");
            if (participants.length != 2 || (!currentUserId.equals(participants[0]) && !currentUserId.equals(participants[1]))) {
                throw new AccessDeniedException("You are not a participant in this private chat");
            }
        }
        
        Query query = Query.query(Criteria.where("chatId").is(chatId));
        if (isGroup) {
            query.addCriteria(Criteria.where("isGroupMessage").is(true));
        }
        
        if (pageable != null) {
            Sort sort = pageable.getSort();
            if (sort != null && sort.isSorted()) {
                query.with(sort);
            } else {
                query.with(Sort.by(Sort.Direction.ASC, "timestamp"));
            }
            query.limit(pageable.getPageSize());
            query.skip(pageable.getOffset());
        }
        
        return mongoTemplate.find(query, ChatMessage.class);
    }
    
    public ChatMessage getLastMessage(String chatId, boolean isGroup, String currentUserId) {
        Pageable pageable = PageRequest.of(0, 1, Sort.by(Sort.Direction.DESC, "timestamp"));
        List<ChatMessage> messages = getChatHistory(chatId, isGroup, currentUserId, pageable);
        return messages.isEmpty() ? null : messages.get(0);
    }
    
    public String generatePrivateChatId(String userId1, String userId2) {
        if (userId1 == null || userId2 == null || userId1.equals(userId2)) {
            throw new IllegalArgumentException("Invalid users: Cannot chat with yourself or missing IDs");
        }
        String id1 = userId1.compareTo(userId2) < 0 ? userId1 : userId2;
        String id2 = userId1.compareTo(userId2) < 0 ? userId2 : userId1;
        return id1 + "_" + id2;
    }
}