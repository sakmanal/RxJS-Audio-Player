import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PlayerComponent } from './pages/player/player.component';
import { ContainerComponent } from './pages/container/container.component';
import { HeaderComponent } from './pages/header/header.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    ContainerComponent,
    HeaderComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
