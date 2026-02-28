/*package repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
    List<User> findByOnlineTrue();
    
    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    List<User> findByUsernameRegex(String query);
}*/

package repository;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import entity.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
    List<User> findByOnlineTrue();
    
    @Query("{ 'username': { $regex: ?0, $options: 'i' } }")
    List<User> findByUsernameRegex(String query);
}

