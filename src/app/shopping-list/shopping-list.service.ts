import { Injectable } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  // evento usado para informar que um item foi adicionado à lista
  // trocado por Subject (é melhor)
  // ingredientChanged = new EventEmitter<Ingredient[]>();
  ingredientChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient [] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 10)
  ];

  constructor() { }

  getIngredients() {
    // passa somente a cópia da lista
    return [...this.ingredients];
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // informa que um item foi adicionado à lista
    // this.ingredientChanged.emit([...this.ingredients]);
    this.ingredientChanged.next([...this.ingredients]);
  }

  addIngredients(ingredients: Ingredient[]) {
    // for (ingredient of ingredients)  usamos o código abaixo
    this.ingredients.push(...ingredients);  // transforma um array de elementos em uma lista de elementos
    // this.ingredientChanged.emit([...ingredients]);
    this.ingredientChanged.next([...this.ingredients]);
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientChanged.next([...this.ingredients]);
    // ou
    // this.ingredientChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientChanged.next([...this.ingredients]);
  }
}
