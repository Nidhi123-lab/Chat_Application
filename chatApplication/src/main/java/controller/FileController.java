/*package controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import entity.FileInfo;
import service.FileStorageService;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileInfo> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        if (file.isEmpty() || file.getSize() > 10 * 1024 * 1024) {  // 10MB limit
            return ResponseEntity.badRequest().build();
        }
        try {
            return ResponseEntity.ok(fileStorageService.store(file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}*/

package controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import entity.FileInfo;
import service.FileStorageService;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileInfo> uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
        if (file.isEmpty() || file.getSize() > 10 * 1024 * 1024) {  // 10MB limit
            return ResponseEntity.badRequest().build();
        }
        try {
            return ResponseEntity.ok(fileStorageService.store(file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}