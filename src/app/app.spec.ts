import { provideZonelessChangeDetection } from '@angular/core';
import { render } from '@testing-library/angular';
import { App } from './app';

const sut = async () => {
  return await render(App, {
    providers: [provideZonelessChangeDetection()],
  });
};

describe('App', () => {
  it('should create the app', async () => {
    const { fixture } = await sut();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const { fixture } = await sut();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'planning-poker-app',
    );
  });
});
