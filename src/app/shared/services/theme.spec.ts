import { ApplicationRef, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme';

const mockRenderer = {
  setAttribute: jest.fn(),
};

const mockRendererFactory = {
  createRenderer: jest.fn().mockReturnValue(mockRenderer),
};

describe('ThemeService', () => {
  let service: ThemeService;
  let appRef: ApplicationRef;
  let localStorageGetSpy: jest.SpyInstance;
  let localStorageSetSpy: jest.SpyInstance;
  let windowAddEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: mockRendererFactory },
      ],
    });

    localStorageGetSpy = jest.spyOn(Storage.prototype, 'getItem');
    localStorageSetSpy = jest.spyOn(Storage.prototype, 'setItem');
    windowAddEventListenerSpy = jest.spyOn(window, 'addEventListener');

    appRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  describe('Constructor Initialization', () => {
    it('should apply the initial theme to the document and localStorage via effect', async () => {
      service = TestBed.inject(ThemeService);
      appRef.tick();

      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        document.documentElement,
        'data-theme',
        'light',
      );
      expect(localStorageSetSpy).toHaveBeenCalledWith('theme', 'light');
    });

    it('should initialize with the theme from localStorage when it exists', () => {
      localStorageGetSpy.mockReturnValue('sunset');

      service = TestBed.inject(ThemeService);

      expect(localStorageGetSpy).toHaveBeenCalledWith('theme');
      expect(service.currentTheme()).toBe('sunset');
    });
  });

  describe('Theme Manipulation', () => {
    beforeEach(() => {
      appRef.tick();
      jest.clearAllMocks();
    });

    it('should set the theme when setTheme() is called', async () => {
      service = TestBed.inject(ThemeService);
      service.setTheme('sunset');
      appRef.tick();

      expect(service.currentTheme()).toBe('sunset');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        document.documentElement,
        'data-theme',
        'sunset',
      );
      expect(localStorageSetSpy).toHaveBeenCalledWith('theme', 'sunset');
    });

    it('should toggle theme from "light" to "sunset" when toggleTheme() is called', async () => {
      service = TestBed.inject(ThemeService);
      expect(service.currentTheme()).toBe('light');

      service.toggleTheme();
      appRef.tick();

      expect(service.currentTheme()).toBe('sunset');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        document.documentElement,
        'data-theme',
        'sunset',
      );
      expect(localStorageSetSpy).toHaveBeenCalledWith('theme', 'sunset');
    });

    it('should toggle theme from "sunset" to "light" when toggleTheme() is called', async () => {
      service = TestBed.inject(ThemeService);
      service.setTheme('sunset');
      appRef.tick();

      jest.clearAllMocks();

      expect(service.currentTheme()).toBe('sunset');

      service.toggleTheme();
      appRef.tick();

      expect(service.currentTheme()).toBe('light');
      expect(mockRenderer.setAttribute).toHaveBeenCalledWith(
        document.documentElement,
        'data-theme',
        'light',
      );
      expect(localStorageSetSpy).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('Cross-Tab Synchronization (Storage Event)', () => {
    it('should update theme when a valid "storage" event occurs', () => {
      service = TestBed.inject(ThemeService);
      const storageEventHandler = windowAddEventListenerSpy.mock.calls[0][1];

      const fakeEvent = new StorageEvent('storage', {
        key: 'theme',
        newValue: 'sunset',
      });
      storageEventHandler(fakeEvent);

      expect(service.currentTheme()).toBe('sunset');
    });

    it('should NOT update theme if the storage event key is not "theme"', () => {
      service = TestBed.inject(ThemeService);
      const storageEventHandler = windowAddEventListenerSpy.mock.calls[0][1];

      const fakeEvent = new StorageEvent('storage', {
        key: 'other-key',
        newValue: 'dark',
      });
      storageEventHandler(fakeEvent);

      expect(service.currentTheme()).toBe('light');
    });
  });
});
