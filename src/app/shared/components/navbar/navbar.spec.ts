import { signal, WritableSignal } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import { Theme, ThemeService } from '../../services/theme';
import { Navbar } from './navbar';

interface MockThemeService {
  currentTheme: WritableSignal<Theme>;
  toggleTheme: jest.Mock;
}

describe('Navbar Component', () => {
  let mockThemeService: MockThemeService;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(async () => {
    user = userEvent.setup();
    const themeSignal = signal<Theme>('light');

    mockThemeService = {
      currentTheme: themeSignal,
      toggleTheme: jest.fn().mockImplementation(() => {
        themeSignal.update((current) =>
          current === 'light' ? 'business' : 'light',
        );
      }),
    };

    await render(Navbar, {
      providers: [{ provide: ThemeService, useValue: mockThemeService }],
    });
  });

  afterEach(() => jest.clearAllMocks());

  it('should render the component', async () => {
    const navbar = screen.getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
  });

  it('should call toggleTheme method when button is clicked', async () => {
    const toggleThemeButton = screen.getByTestId('toggle-theme-button');
    await user.click(toggleThemeButton);
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
    expect(mockThemeService.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should render icon based on current theme', async () => {
    const matModeNightIcon = screen.getByTestId('mat-mode-night');
    expect(matModeNightIcon).toBeInTheDocument();

    const toggleThemeButton = screen.getByTestId('toggle-theme-button');
    await user.click(toggleThemeButton);

    const matLightModeIcon = screen.getByTestId('mat-light-mode');
    expect(matLightModeIcon).toBeInTheDocument();
  });
});
