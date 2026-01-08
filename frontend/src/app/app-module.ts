import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token-interceptor';
import { RouterModule } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { GerenciamentoClientesModule } from './pages/gerenciamento-clientes/gerenciamento-clientes-module';
import { RegistroClientes } from './pages/gerenciamento-clientes/components/registro-clientes/registro-clientes';
import { MasksPipe } from './pipes/masks-pipe';

@NgModule({
  declarations: [
    App,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    Navbar,
    GerenciamentoClientesModule
],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([tokenInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule { }
