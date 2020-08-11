import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  url = 'https://ng-course-recipe-book-28438.firebaseio.com/recipes.json';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();

    // neste caso o Subscribe() é no método chamador (no componente)
    // return this.http.put(this.url, recipes);
    // ou
    this.http
      .put(
        this.url,
        recipes
      )
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    // o 1o map é do rxjs
    // o 2o é um método do array
    return this.http
        .get<Recipe[]>(this.url)
        .pipe(map(recipes => {
          return recipes.map( recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }),
          tap(recipes => {
            this.recipeService.setRecipes(recipes);
          })
        );
        // .subscribe(recipes => {
        //   this.recipeService.setRecipes(recipes);
        // });
  }
}
