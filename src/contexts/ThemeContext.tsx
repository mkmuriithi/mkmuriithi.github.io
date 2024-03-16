

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';

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

    // get default theme from the system

    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    const defaultDarkMode = savedTheme ? savedTheme === 'dark' : systemTheme;


    const [darkMode, setDarkMode] = useState<boolean>(defaultDarkMode);

    const toggleTheme = (darkThemeContext?: boolean) => {
        const isDarkMode = darkThemeContext != undefined ? darkThemeContext : !darkMode;
        setDarkMode(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    };

    // memoize the context value to avoid unnecessary re-renders
    const value = useMemo(() => ({ darkMode, toggleTheme }), [darkMode]);


    useEffect(() => {
        document.body.classList.toggle('dark', darkMode);
    }, [darkMode]);



    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider, useThemeContext };