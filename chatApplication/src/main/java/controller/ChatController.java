/*package controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import entity.ChatMessage;
import jakarta.servlet.http.HttpServletRequest;
import service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> chatHistory(
            @RequestParam String chatId,
            @RequestParam(defaultValue = "false") boolean isGroup,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "asc") String sort,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Sort.Direction sortDir = Sort.Direction.fromString(sort.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, sortDir, "timestamp");
            return ResponseEntity.ok(chatService.getChatHistory(chatId, isGroup, currentUserId, pageable));
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/last-message")
    public ResponseEntity<ChatMessage> getLastMessage(
            @RequestParam String chatId,
            @RequestParam(defaultValue = "false") boolean isGroup,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            ChatMessage lastMsg = chatService.getLastMessage(chatId, isGroup, currentUserId);
            return lastMsg != null ? ResponseEntity.ok(lastMsg) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }
    
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody @Validated ChatMessage message, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Add this logging
        logger.info("Controller received message: chatId={}, isGroupMessage={}, senderId={}", 
                    message.getChatId(), message.isGroupMessage(), message.getSenderId());
        
        try {
            ChatMessage saved = chatService.sendMessage(message, currentUserId);
            return ResponseEntity.ok(saved);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        } catch (IllegalArgumentException e) {
            logger.error("IllegalArgumentException in sendMessage: {}", e.getMessage());  // Add this
            return ResponseEntity.status(400).build();  // For invalid chatId
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}*/

package controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import entity.ChatMessage;
import jakarta.servlet.http.HttpServletRequest;
import service.ChatService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;
    
    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> chatHistory(
            @RequestParam String chatId,
            @RequestParam(defaultValue = "false") boolean isGroup,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "asc") String sort,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            Sort.Direction sortDir = Sort.Direction.fromString(sort.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, sortDir, "timestamp");
            return ResponseEntity.ok(chatService.getChatHistory(chatId, isGroup, currentUserId, pageable));
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/last-message")
    public ResponseEntity<ChatMessage> getLastMessage(
            @RequestParam String chatId,
            @RequestParam(defaultValue = "false") boolean isGroup,
            HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            ChatMessage lastMsg = chatService.getLastMessage(chatId, isGroup, currentUserId);
            return lastMsg != null ? ResponseEntity.ok(lastMsg) : ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }
    
    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(@RequestBody @Validated ChatMessage message, HttpServletRequest request) {
        String currentUserId = (String) request.getAttribute("currentUserId");
        if (currentUserId == null) {
            return ResponseEntity.status(401).build();
        }
        
        // Add this logging
        logger.info("Controller received message: chatId={}, isGroupMessage={}, senderId={}", 
                    message.getChatId(), message.isGroupMessage(), message.getSenderId());
        
        try {
            ChatMessage saved = chatService.sendMessage(message, currentUserId);
            return ResponseEntity.ok(saved);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        } catch (IllegalArgumentException e) {
            logger.error("IllegalArgumentException in sendMessage: {}", e.getMessage());  // Add this
            return ResponseEntity.status(400).build();  // For invalid chatId
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
}