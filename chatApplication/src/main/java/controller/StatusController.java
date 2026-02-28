/*package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import entity.Status;
import service.StatusService;
import java.util.List;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    @Autowired
    private StatusService statusService;

    @PostMapping("/")
    public ResponseEntity<Status> createStatus(@RequestBody @Validated Status status) {
        return ResponseEntity.ok(statusService.createStatus(status));
    }

    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<Status>> getFriendStatuses(@PathVariable String userId) {
        return ResponseEntity.ok(statusService.getFriendStatusesForUser(userId));
    }

    @PostMapping("/{statusId}/view")
    public ResponseEntity<Void> markStatusViewed(
        @PathVariable String statusId,
        @RequestParam String userId) {
        statusService.markStatusViewed(statusId, userId);
        return ResponseEntity.ok().build();
    }
}*/

package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import entity.Status;
import service.StatusService;
import java.util.List;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    @Autowired
    private StatusService statusService;

    @PostMapping("/")
    public ResponseEntity<Status> createStatus(@RequestBody @Validated Status status) {
        return ResponseEntity.ok(statusService.createStatus(status));
    }

    @GetMapping("/friends/{userId}")
    public ResponseEntity<List<Status>> getFriendStatuses(@PathVariable String userId) {
        return ResponseEntity.ok(statusService.getFriendStatusesForUser(userId));
    }

    @PostMapping("/{statusId}/view")
    public ResponseEntity<Void> markStatusViewed(
        @PathVariable String statusId,
        @RequestParam String userId) {
        statusService.markStatusViewed(statusId, userId);
        return ResponseEntity.ok().build();
    }
}