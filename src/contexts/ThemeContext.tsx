// create a theme context that will accept 'children' as a prop
// and a state that will be used to toggle between themes

import React, { createContext, useState, useMemo, useContext } from 'react';



// interfaces for the context and the provider
interface IThemeContext {
    darkMode: boolean;
    toggleTheme: (darkThemeContext?: boolean) => void;
    
}
interface IThemeProvider {
    children: React.ReactNode;
}


const ThemeContext = createContext<IThemeContext>({
    darkMode: false,
    toggleTheme: () => {},
});

const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
}

const ThemeProvider = ({ children }: IThemeProvider) => {
    const [darkMode, setDarkMode] = useState(false);
    const toggleTheme = (darkThemeContext?: boolean) => {
        setDarkMode(darkThemeContext ?? !darkMode);
    };
    // memoize the context value to avoid unnecessary re-renders
    const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);

    // change what we give the body tag depending on theme
    const applyTheme = (darkMode: boolean) => { // figure out how to cache this value to visitors of site
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider, useThemeContext };