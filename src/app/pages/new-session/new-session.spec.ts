import { ReactiveFormsModule } from '@angular/forms';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NewSession } from './new-session';

const user = userEvent.setup();

const sut = async () => {
  return render(NewSession, {
    imports: [ReactiveFormsModule],
  });
};

describe('NewSession', () => {
  it('should create', async () => {
    await sut();
    const newSession = screen.getByTestId('new-session');
    expect(newSession).toBeInTheDocument();
  });

  it('should NOT call createSession if form is invalid', async () => {
    const { fixture } = await sut();
    const createSessionSpy = jest.spyOn(
      fixture.componentInstance,
      'createSession',
    );
    const createButton = screen.getByTestId('new-session-button-create');
    expect(createButton).toBeDisabled();

    await user.click(createButton);
    expect(createSessionSpy).not.toHaveBeenCalled();
  });

  it('should call createSession when form is valid and button is clicked', async () => {
    const { fixture } = await sut();
    const createSessionSpy = jest.spyOn(
      fixture.componentInstance,
      'createSession',
    );
    const userNameInput = screen.getByTestId('new-session-input-username');
    const createButton = screen.getByTestId('new-session-button-create');

    await user.type(userNameInput, 'John wick');
    expect(createButton).toBeEnabled();

    await user.click(createButton);
    expect(createSessionSpy).toHaveBeenCalled();
    expect(createSessionSpy).toHaveBeenCalledTimes(1);
  });

  it('should call createSession with the correct form values', async () => {
    const { fixture } = await sut();
    jest.spyOn(fixture.componentInstance, 'createSession');
    const log = jest.spyOn(console, 'log');
    const userNameInput = screen.getByTestId(
      'new-session-input-username',
    ) as HTMLInputElement;
    const nameSessionInput = screen.getByTestId(
      'new-session-input-namesession',
    ) as HTMLInputElement;
    const createButton = screen.getByTestId('new-session-button-create');

    const typedUserName = 'Maria Silva';
    await user.type(userNameInput, typedUserName);

    await user.click(createButton);

    expect(log).toHaveBeenCalledWith({
      nameSession: nameSessionInput.value,
      userName: typedUserName,
    });
  });
});
