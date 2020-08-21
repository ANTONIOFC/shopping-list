import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { DataStorageService } from './shared/data-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'shopping-list';
/*   loadedFeature = 'recipe';


  onNavigate(feature: string) {
    this.loadedFeature = feature;
  } */

  constructor(
    private authService: AuthService,
    private dataStorageService: DataStorageService) {}

  ngOnInit() {
    this.authService.autoLogin();

    this.dataStorageService.recipesSored.subscribe(
       stored => {
         if (stored) {
           console.log('Data stored !!!');
         }
       }
    );

  }
}
