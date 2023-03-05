import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipe/recipe.service";
import {map, tap} from "rxjs";
import {Recipe} from "../recipe/recipe.model";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipesService: RecipeService,
              private authService: AuthService
  ) { }

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put<{ name: string }>(
      'https://ng-course-recipe-book-fd06e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
      recipes
    ).subscribe(responseData => {
      console.log(responseData);
    });
  }

  fetchRecipes() {
      return this.http.get<Recipe[]>(
        'https://ng-course-recipe-book-fd06e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
        ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          }
        })
      }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes);
      }));
    }

}
