package com.caseApp_backend.repository;

import com.caseApp_backend.entity.Model;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModelRepository extends MongoRepository<Model, ObjectId> {
}
