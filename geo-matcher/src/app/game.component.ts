import {
  Component,
  Input,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  template: `
    <div class="grid place-items-center h-screen">
      @if(completed()){
      <span class="text-lg text-blue-300 self-center">
        Congratulations you won
      </span>
      } @else {
      <div class="grid grid-cols-3 gap-2 ">
        @for( element of remainingCountriesAndCapitals(); track element ) {
        <button
          class="rounded p-2 border border-gray-300"
          [class.bg-blue-200]="
            selectedCountryOrCapital()?.countryOrCapital ===
            element.countryOrCapital
          "
          [class.bg-red-200]="
            wrongMatchedCountriesOrCapitals().includes(element)
          "
          (click)="onSelectCountryOrCapital(element)"
        >
          {{ element.countryOrCapital }}
        </button>
        }
      </div>
      }
    </div>
  `,
})
export class GameComponent {
  protected selectedCountryOrCapital: WritableSignal<CountryOrCapital | null> =
    signal(null);
  protected matchedCountriesAndCapitals: WritableSignal<
    Array<CountryOrCapital>
  > = signal([]);
  protected countriesAndCapitals: WritableSignal<Array<CountryOrCapital>> =
    signal([]);
  protected remainingCountriesAndCapitals = computed<Array<CountryOrCapital>>(
    () =>
      this.countriesAndCapitals().filter(
        (c) => !this.matchedCountriesAndCapitals().includes(c)
      )
  );
  protected wrongMatchedCountriesOrCapitals = signal<Array<CountryOrCapital>>(
    []
  );
  protected completed = computed(
    () => this.remainingCountriesAndCapitals().length === 0
  );
  @Input({ required: true })
  set countriesWithCapitals(value: { [key: string]: string }) {
    const countriesAndCapitals = Object.entries(value)
      .flatMap<CountryOrCapital>(([country, capital]) => [
        {
          countryOrCapital: country,
          matchesWith: capital,
        },
        {
          countryOrCapital: capital,
          matchesWith: country,
        },
      ])
      .sort(() => Math.random() - 0.5);

    this.countriesAndCapitals.set(countriesAndCapitals);
  }

  onSelectCountryOrCapital(element: CountryOrCapital) {
    const selected = this.selectedCountryOrCapital();
    if (!selected) {
      this.selectedCountryOrCapital.set(element);
      this.wrongMatchedCountriesOrCapitals.set([]);
      return;
    }
    if (selected.matchesWith == element.countryOrCapital) {
      this.matchedCountriesAndCapitals.update((c) => [...c, element, selected]);
    } else {
      this.wrongMatchedCountriesOrCapitals.set([element, selected]);
    }
    this.selectedCountryOrCapital.set(null);
  }
}

type CountryOrCapital = {
  countryOrCapital: string;
  matchesWith: string;
};
