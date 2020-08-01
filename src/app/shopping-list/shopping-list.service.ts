import { Injectable, EventEmitter } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  // evento usado para informar que um item foi adicionado à lista
  ingredientChanged = new EventEmitter<Ingredient[]>();

  private ingredients: Ingredient [] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 10)
  ];

  constructor() { }

  getIngredients() {
    // passa somente a cópia da lista
    return [...this.ingredients];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // informa que um item foi adicionado à lista
    this.ingredientChanged.emit([...this.ingredients]);
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (ingredient of ingredients)  usamos o código abaixo
    this.ingredients.push(...ingredients);  // transforma um array de elementos em uma lista de elementos
    this.ingredientChanged.emit([...ingredients]);
  }
}
