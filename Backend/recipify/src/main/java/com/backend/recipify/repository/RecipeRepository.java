package com.backend.recipify.repository;

import com.backend.recipify.model.Recipe;
import com.backend.recipify.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByAuthor(User author);

    @Query("SELECT DISTINCT r FROM Recipe r LEFT JOIN r.ingredients i WHERE " +
           "LOWER(r.name) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(i.name) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(r.category) LIKE LOWER(CONCAT('%', :term, '%'))")
    Page<Recipe> searchAll(@Param("term") String term, Pageable pageable);

    @Query("SELECT r FROM Recipe r JOIN r.ingredients i WHERE LOWER(i.name) LIKE LOWER(CONCAT('%', :ingredientName, '%'))")
    List<Recipe> findByIngredientName(@Param("ingredientName") String ingredientName);

    List<Recipe> findTop10ByOrderByLikesCountDesc();
}
