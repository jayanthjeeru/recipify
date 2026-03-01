package com.backend.recipify.repository;

import com.backend.recipify.model.Favorite;
import com.backend.recipify.model.Recipe;
import com.backend.recipify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    Optional<Favorite> findByUserAndRecipe(User user, Recipe recipe);
    Boolean existsByUserAndRecipe(User user, Recipe recipe);
}
