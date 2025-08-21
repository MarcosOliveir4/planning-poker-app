import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewSessionForm } from './types';

@Component({
  selector: 'app-new-session',
  imports: [ReactiveFormsModule],
  templateUrl: './new-session.html',
  styleUrl: './new-session.scss',
})
export class NewSession {
  private readonly fb = inject(FormBuilder);

  private randomName(): string {
    const adjectives = [
      'Ágil',
      'Rápido',
      'Focado',
      'Produtivo',
      'Colaborativo',
      'Épico',
      'Lendário',
      'Mítico',
      'Secreto',
      'Quântico',
      'Atômico',
      'Dinâmico',
      'Estratégico',
      'Veloz',
      'Sinergico',
      'Incrível',
      'Fantástico',
      'Infalível',
      'Imbatível',
      'Invencível',
    ];

    const nouns = [
      'Planning',
      'Sprint',
      'Time',
      'Equipe',
      'Squad',
      'Projeto',
      'Backlog',
      'Refinamento',
      'Poker',
      'Sessão',
      'Missão',
      'Estimativa',
      'Revisão',
      'Retrospectiva',
      'Ciclo',
    ];

    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${randomNoun}`;
  }

  protected newSessionForm = signal(
    this.fb.group<NewSessionForm>({
      nameSession: new FormControl(this.randomName()),
      userName: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
    }),
  );

  protected isValidForm() {
    return this.newSessionForm().valid;
  }

  createSession() {
    console.log(this.newSessionForm().value);
  }
}
