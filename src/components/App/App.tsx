import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@fluentui/react';
import { Toaster } from 'react-hot-toast';
import AppFlowProvider from '../AppFlowProvider/AppFlowProvider';
import { API } from '../../data/api';
import { useEffect, useState } from 'react';

const App = () => {
    const [theme, setTheme] = useState<"dark" | "light">("light");

    useEffect(() => {
        function mediaListener(e: MediaQueryListEvent) {
            setTheme(e.matches ? "dark" : "light");
        }

        // Setup dark/light mode for the first time
        setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")

        // Add listener to update styles
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", mediaListener);

        // Remove listener
        return () => window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", mediaListener);
    }, []);

    return (
        <ThemeProvider>
            < BrowserRouter >
                <Toaster
                    position='bottom-center'
                    toastOptions={{
                        style: {
                            background: theme === "dark" ? "#333" : "#fff",
                            color: theme === "dark" ? '#fff' : "#363636",
                        }
                    }}
                />
                <Routes>
                    <Route path="/id/:flowId" element={<AppFlowProvider fetchFunction={API.loadFlowElementsAsync} />} />
                    <Route path="/example/:flowId" element={<AppFlowProvider fetchFunction={API.loadExampleFlowElementsAsync} canSaveFlow={false} />} />
                    <Route index element={<Navigate to="/example/1" replace />} />
                </Routes>
            </BrowserRouter >
        </ThemeProvider >
    );
}

export default App;