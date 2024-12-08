import { RenderMode, ServerRoute } from '@angular/ssr';
import { Server } from 'http';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'trip/:tripId',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
