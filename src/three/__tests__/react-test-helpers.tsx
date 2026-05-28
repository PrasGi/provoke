import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

export function renderReact(node: React.ReactNode) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<>{node}</>);
  });

  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

export function renderHookValue<T>(
  hook: () => T,
  wrapper?: React.ComponentType<{ children: React.ReactNode }>,
) {
  const result: { current?: T } = {};

  function Probe() {
    result.current = hook();
    return null;
  }

  const element = wrapper
    ? React.createElement(wrapper, null, React.createElement(Probe))
    : React.createElement(Probe);

  const rendered = renderReact(element);

  return {
    result: result as { current: T },
    rerender: () => {
      act(() => {
        createRoot(rendered.container).render(element);
      });
    },
    unmount: rendered.unmount,
  };
}
