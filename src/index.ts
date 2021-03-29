import dotenv from 'dotenv';
import StartupUseCase from './use-case/startup-use-case';

dotenv.config();

new StartupUseCase().execute();
