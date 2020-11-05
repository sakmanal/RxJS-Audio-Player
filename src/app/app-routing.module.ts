import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerComponent } from './pages/container/container.component';

const routes: Routes = [
    { path: '', component: ContainerComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
