import React from 'react';
import TestRenderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import store from '../redux/store';
import MovieList from '../components/movieList/MovieList';

it('renders correctly', () => {
  const tree = TestRenderer.create(
    <Provider store={store}>
      <MemoryRouter>
        <MovieList />
      </MemoryRouter>
    </Provider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
