import { Reflector } from '@nestjs/core';

export const Private = Reflector.createDecorator<boolean>({ transform: (value) => value ?? true });

export const PrivateNoClientRequired = Reflector.createDecorator<boolean>({ transform: (value) => value ?? true });
