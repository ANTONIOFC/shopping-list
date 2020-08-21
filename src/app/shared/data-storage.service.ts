import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  url = 'https://ng-course-recipe-book-28438.firebaseio.com/recipes.json';

  recipesSored = new BehaviorSubject<boolean>(null);

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService) { }

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
        this.recipesSored.next(true);
      });
  }

  fetchRecipes() {

    // exhaustMap => aguarda o primeiro Observable (user) ser completado
    // então ele passa o retorno para o novo Observable (http.get)

    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http
          .get<Recipe[]>(
            this.url
            // ,
            // {
            //   params: new HttpParams().set('auth', user.token)
            // }
          );
      }),
      // o 1o map é do rxjs
      // o 2o é um método do array
      map(recipes => {
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
  }
}
