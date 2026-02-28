/*package controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import entity.Group;
import service.GroupService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/")
    public ResponseEntity<Group> createGroup(@RequestBody @Validated Group group) {
        return ResponseEntity.ok(groupService.createGroup(group));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getUserGroups(@PathVariable String userId) {
        return ResponseEntity.ok(groupService.getUserGroups(userId));
    }

    @PutMapping("/{groupId}/members")
    public ResponseEntity<Group> addMembers(@PathVariable String groupId, @RequestParam String userId) {
        return ResponseEntity.ok(groupService.addMember(groupId, userId));
    }
}*/

package controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import entity.Group;
import service.GroupService;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @PostMapping("/")
    public ResponseEntity<Group> createGroup(@RequestBody @Validated Group group) {
        return ResponseEntity.ok(groupService.createGroup(group));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getUserGroups(@PathVariable String userId) {
        return ResponseEntity.ok(groupService.getUserGroups(userId));
    }

    @PutMapping("/{groupId}/members")
    public ResponseEntity<Group> addMembers(@PathVariable String groupId, @RequestParam String userId) {
        return ResponseEntity.ok(groupService.addMember(groupId, userId));
    }
}