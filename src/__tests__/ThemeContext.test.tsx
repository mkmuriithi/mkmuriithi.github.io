import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useThemeContext } from '@/contexts/ThemeContext'; // Adjust the import path as necessary

// Mocking localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mocking window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false, // You can change this to true to simulate dark mode
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('ThemeProvider', () => {
beforeEach(() => {
    (window.matchMedia as jest.Mock).mockClear();
    window.localStorage.clear();
});

  it('provides the darkMode value based on system preference', () => {
    // Remove the unnecessary import statement for jest
    // import { jest } from '@jest/globals';

    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
        matches: true, // Simulating system preference for dark mode
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    }));

    const TestComponent = () => {
        const { darkMode } = useThemeContext();
        return <div>{darkMode ? 'Dark mode' : 'Light mode'}</div>;
    };

    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByText('Dark mode')).toBeInTheDocument();
  });

  it('allows toggling the theme', () => {
    const TestComponent = () => {
      const { darkMode, toggleTheme } = useThemeContext();
      return (
        <div>
          <div>{darkMode ? 'Dark mode' : 'Light mode'}</div>
          <button onClick={() => toggleTheme()}>Toggle Theme</button>
        </div>
      );
    };

    const { getByText } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByText('Light mode')).toBeInTheDocument();
    act(() => {
      getByText('Toggle Theme').click();
    });
    expect(getByText('Dark mode')).toBeInTheDocument();
  });
});