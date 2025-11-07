import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import 'chart.js/auto';


bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    provideAnimations(), // animações do Angular
  ]
}).catch(err => {
  console.error('Erro ao inicializar a aplicação:', err);
});
