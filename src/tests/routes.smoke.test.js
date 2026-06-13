import React from 'react';
import { cleanup, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../App';
import store from '../redux/store';

const ROUTES_TO_SMOKE_TEST = [
  '/',
  '/search',
  '/collection',
  '/any-idea',
  '/how-we-built-it',
  '/movie/tt0133093',
  '/person/nm0000206',
  '/booking/tt0133093',
  '/booking-confirmation/CPH-DEMO-1234',
  '/bookings',
  '/profile',
  '/cinephile-ai',
];

describe('route smoke tests', () => {
  afterEach(() => {
    cleanup();
  });

  test.each(ROUTES_TO_SMOKE_TEST)('renders route %s without crashing', async (route) => {
    window.history.pushState({}, `Route: ${route}`, route);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      const main = document.querySelector('main#main-content');
      expect(main).not.toBeNull();
    });
  });
});
