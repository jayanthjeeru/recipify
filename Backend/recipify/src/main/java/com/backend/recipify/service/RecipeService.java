package com.backend.recipify.service;

import com.backend.recipify.dto.RecipeRequest;
import com.backend.recipify.dto.RecipeResponse;
import com.backend.recipify.dto.ReviewRequest;
import com.backend.recipify.model.*;
import com.backend.recipify.repository.FavoriteRepository;
import com.backend.recipify.repository.RecipeRepository;
import com.backend.recipify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Transactional
    public RecipeResponse createRecipe(RecipeRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        Recipe recipe = Recipe.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .estimatedCost(request.getEstimatedCost())
                .instructions(request.getInstructions())
                .prepTime(request.getPrepTime())
                .difficulty(request.getDifficulty())
                .category(request.getCategory())
                .servings(request.getServings())
                .suggestions(request.getSuggestions())
                .author(user)
                .ingredients(request.getIngredients().stream()
                        .map(i -> Ingredient.builder()
                                .name(i.getName())
                                .quantity(i.getQuantity())
                                .cost(i.getCost())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        Recipe savedRecipe = recipeRepository.save(recipe);
        return mapToResponse(savedRecipe, user);
    }

    public List<RecipeResponse> getAllRecipes(User currentUser) {
        return recipeRepository.findAll().stream()
                .map(r -> mapToResponse(r, currentUser))
                .collect(Collectors.toList());
    }

    public List<RecipeResponse> getAllRecipesPaged(int page, int size, User currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return recipeRepository.findAll(pageable).stream()
                .map(r -> mapToResponse(r, currentUser))
                .collect(Collectors.toList());
    }

    public RecipeResponse getRecipeById(Long id, User currentUser) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        return mapToResponse(recipe, currentUser);
    }

    public List<RecipeResponse> searchRecipes(String term, User currentUser) {
        // Fallback for non-paged search if needed
        return recipeRepository.searchAll(term, PageRequest.of(0, 100)).stream()
                .map(r -> mapToResponse(r, currentUser))
                .collect(Collectors.toList());
    }

    public List<RecipeResponse> searchRecipesPaged(String term, int page, int size, User currentUser) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (term != null && !term.trim().isEmpty()) {
            return recipeRepository.searchAll(term.trim(), pageable).stream()
                    .map(r -> mapToResponse(r, currentUser))
                    .collect(Collectors.toList());
        }
        return getAllRecipesPaged(page, size, currentUser);
    }

    @Transactional
    public void toggleFavorite(Long recipeId, User user) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        java.util.Optional<Favorite> favorite = favoriteRepository.findByUserAndRecipe(user, recipe);
        if (favorite.isPresent()) {
            favoriteRepository.delete(favorite.get());
        } else {
            favoriteRepository.save(Favorite.builder().user(user).recipe(recipe).build());
        }
    }

    @Transactional
    public void toggleLike(Long recipeId) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        recipe.setLikesCount(recipe.getLikesCount() + 1);
        recipeRepository.save(recipe);
    }

    @Transactional
    public void addReview(Long recipeId, ReviewRequest request, User user) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        Review review = Review.builder()
                .comment(request.getComment())
                .rating(request.getRating())
                .user(user)
                .recipe(recipe)
                .build();

        recipe.getReviews().add(review);
        recipeRepository.save(recipe);
    }

    public List<RecipeResponse> getRecommendations(User user) {
        // Simple recommendation based on top liked recipes
        return recipeRepository.findTop10ByOrderByLikesCountDesc().stream()
                .map(r -> mapToResponse(r, user))
                .collect(Collectors.toList());
    }

    private RecipeResponse mapToResponse(Recipe recipe, User currentUser) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .name(recipe.getName())
                .description(recipe.getDescription())
                .imageUrl(recipe.getImageUrl())
                .estimatedCost(recipe.getEstimatedCost())
                .instructions(recipe.getInstructions())
                .prepTime(recipe.getPrepTime())
                .difficulty(recipe.getDifficulty())
                .category(recipe.getCategory())
                .servings(recipe.getServings())
                .createdAt(recipe.getCreatedAt())
                .authorName(recipe.getAuthor().getUsername())
                .likesCount(recipe.getLikesCount())
                .suggestions(recipe.getSuggestions())
                .isFavorite(currentUser != null && favoriteRepository.existsByUserAndRecipe(currentUser, recipe))
                .ingredients(recipe.getIngredients().stream()
                        .map(i -> RecipeResponse.IngredientDto.builder()
                                .name(i.getName())
                                .quantity(i.getQuantity())
                                .cost(i.getCost())
                                .build())
                        .collect(Collectors.toList()))
                .reviews(recipe.getReviews().stream()
                        .map(rev -> RecipeResponse.ReviewDto.builder()
                                .id(rev.getId())
                                .username(rev.getUser().getUsername())
                                .comment(rev.getComment())
                                .rating(rev.getRating())
                                .createdAt(rev.getCreatedAt())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
