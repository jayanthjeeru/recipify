package com.backend.recipify.controller;

import com.backend.recipify.dto.RecipeRequest;
import com.backend.recipify.dto.RecipeResponse;
import com.backend.recipify.dto.ReviewRequest;
import com.backend.recipify.model.User;
import com.backend.recipify.repository.UserRepository;
import com.backend.recipify.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {
    @Autowired
    private RecipeService recipeService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<RecipeResponse>> getAllRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        User user = getCurrentUser();
        // Standardize to use the new paged service method
        return ResponseEntity.ok(recipeService.getAllRecipesPaged(page, size, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(@PathVariable Long id) {
        User user = getCurrentUser();
        return ResponseEntity.ok(recipeService.getRecipeById(id, user));
    }

    @PostMapping
    @PreAuthorize("hasRole('PRIVILEGED_USER') or hasRole('ADMIN')")
    public ResponseEntity<RecipeResponse> createRecipe(@RequestBody RecipeRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(recipeService.createRecipe(request, username));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeResponse>> searchRecipes(
            @RequestParam(required = false) String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        User user = getCurrentUser();
        return ResponseEntity.ok(recipeService.searchRecipesPaged(term, page, size, user));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long id) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        recipeService.toggleFavorite(id, user);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        recipeService.toggleLike(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<?> addReview(@PathVariable Long id, @RequestBody ReviewRequest request) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(401).build();
        recipeService.addReview(id, request, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecipeResponse>> getRecommendations() {
        User user = getCurrentUser();
        return ResponseEntity.ok(recipeService.getRecommendations(user));
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(username)) return null;
        return userRepository.findByUsername(username).orElse(null);
    }
}
