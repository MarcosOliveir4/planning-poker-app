import {
  effect,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
  signal,
} from '@angular/core';

export type Theme = 'light' | 'business';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly rendererFactory = inject(RendererFactory2);
  private readonly renderer!: Renderer2;
  currentTheme = signal<Theme>('light');

  private handleStorageChange(event: StorageEvent) {
    if (event.key === 'theme' && event.newValue) {
      this.currentTheme.set(event.newValue as Theme);
    }
  }

  constructor() {
    this.renderer = this.rendererFactory.createRenderer(null, null);

    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    }

    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem('theme', theme);
      this.renderer.setAttribute(document.documentElement, 'data-theme', theme);
    });

    window.addEventListener('storage', (event) => {
      this.handleStorageChange(event);
    });
  }

  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  toggleTheme(): void {
    this.currentTheme.update((current) =>
      current === 'light' ? 'business' : 'light',
    );
  }
}
