import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameComponent } from './game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GameComponent],
  template: `<app-game [countriesWithCapitals]="countriesWithCapitals" />`,
})
export class AppComponent {
  protected countriesWithCapitals: { [key: string]: string } = {
    'United Kingdom': 'London',
    France: 'Paris',
    Germany: 'Berlin',
    Italy: 'Rome',
    Belgium: 'Brussels',
    Vatican: 'Vatican City',
    Spain: 'Madrid',
  };
}
