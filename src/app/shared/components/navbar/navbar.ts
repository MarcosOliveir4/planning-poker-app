import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { matLightMode, matModeNight } from '@ng-icons/material-icons/baseline';
import { ThemeService } from '../../services';

@Component({
  selector: 'app-navbar',
  imports: [NgIcon],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  viewProviders: [
    provideIcons({
      matLightMode,
      matModeNight,
    }),
  ],
})
export class Navbar {
  private readonly themeService = inject(ThemeService);
  currentTheme = this.themeService.currentTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
