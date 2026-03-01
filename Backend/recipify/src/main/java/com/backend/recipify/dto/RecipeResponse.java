package com.backend.recipify.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class RecipeResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private List<IngredientDto> ingredients;
    private Double estimatedCost;
    private List<String> instructions;
    private Integer prepTime;
    private String difficulty;
    private String category;
    private Integer servings;
    private LocalDateTime createdAt;
    private String authorName;
    private List<ReviewDto> reviews;
    private Integer likesCount;
    private List<String> suggestions;
    private Boolean isFavorite;

    @Data
    @Builder
    public static class IngredientDto {
        private String name;
        private String quantity;
        private Double cost;
    }

    @Data
    @Builder
    public static class ReviewDto {
        private Long id;
        private String username;
        private String comment;
        private Integer rating;
        private LocalDateTime createdAt;
    }
}
