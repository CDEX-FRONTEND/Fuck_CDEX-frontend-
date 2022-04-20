import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import View from '.';

let container: Element | null = null;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  if (container !== null) {
    unmountComponentAtNode(container);
    container.remove();
  }

  container = null;
});

it('test view component', () => {
  act(() => {
    render(<View>test</View>, container);
  });

  expect(container?.textContent).toBe('test');
});
