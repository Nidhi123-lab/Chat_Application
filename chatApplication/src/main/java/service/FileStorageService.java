/*package service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import entity.FileInfo;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

@Service
public class FileStorageService {
    
    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileInfo store(MultipartFile file) throws Exception {
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), root.resolve(filename));
        
        FileInfo fileInfo = new FileInfo();
        fileInfo.setFilename(filename);
        fileInfo.setUrl("/uploads/" + filename);
        fileInfo.setFileType(file.getContentType());
        fileInfo.setSize(file.getSize());
        
        return fileInfo;
    }
}*/

package service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import entity.FileInfo;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

@Service
public class FileStorageService {
    
    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileInfo store(MultipartFile file) throws Exception {
        Path root = Paths.get(uploadDir);
        if (!Files.exists(root)) {
            Files.createDirectories(root);
        }

        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(), root.resolve(filename));
        
        FileInfo fileInfo = new FileInfo();
        fileInfo.setFilename(filename);
        fileInfo.setUrl("/uploads/" + filename);
        fileInfo.setFileType(file.getContentType());
        fileInfo.setSize(file.getSize());
        
        return fileInfo;
    }
}