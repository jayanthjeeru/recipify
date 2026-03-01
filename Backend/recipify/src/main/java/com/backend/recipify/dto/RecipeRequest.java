package com.backend.recipify.dto;

import lombok.Data;

import java.util.List;

@Data
public class RecipeRequest {
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
    private List<String> suggestions;

    @Data
    public static class IngredientDto {
        private String name;
        private String quantity;
        private Double cost;
    }
}
