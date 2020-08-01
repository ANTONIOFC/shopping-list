import { Injectable, EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './../shopping-list/shopping-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('French Fries', 20),
        new Ingredient('Buns', 3)
      ]),
    new Recipe(
      'A Second Recipe',
      'This is the second test',
      'https://upload.wikimedia.org/wikipedia/commons/3/39/Recipe.jpg',
      [
        new Ingredient('Shrimp', 2),
        new Ingredient('Potatoes', 20)
      ]),
    new Recipe(
      'The Third Recipe',
      'This is the third test',
      'https://live.staticflickr.com/5496/31479301445_cb53c0f4e9_b.jpg',
      [
        new Ingredient('Meat', 3),
        new Ingredient('Rice', 1),
        new Ingredient('Bean', 1)
      ])
  ];

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    // return this.recipes.slice();  // slice garante que pegamos uma cópia do array
    // ou
    return [...this.recipes];
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
