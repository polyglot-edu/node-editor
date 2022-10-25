import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@fluentui/react';
import { Toaster } from 'react-hot-toast';
import AppFlowProvider from '../AppFlowProvider/AppFlowProvider';
import { API } from '../../data/api';
import { useEffect } from 'react';
import UploadForm from '../UploadForm/UploadForm';

const App = () => {

    useEffect(() => {
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, []);

    return (
        <ThemeProvider>
            < BrowserRouter >
                <Toaster
                    position='bottom-center'
                    toastOptions={{
                        className: "bg-white dark:bg-[#333] text-white dark:text-[#363636]",
                        // style: {
                        //     background: theme === "dark" ? "#333" : "#fff",
                        //     color: theme === "dark" ? '#fff' : "#363636",
                        // }
                    }}
                />
                <Routes>
                <Route path="/upload" element={<UploadForm fetchFunction={API.createNewFlow}/>} />
                    <Route path="/id/:flowId" element={<AppFlowProvider fetchFunction={API.loadFlowElementsAsync} />} />
                    <Route path="/example/:flowId" element={<AppFlowProvider fetchFunction={API.loadExampleFlowElementsAsync} canSaveFlow={false} />} />
                    <Route index element={<Navigate to="/example/1" replace />} />
                </Routes>
            </BrowserRouter >
        </ThemeProvider >
    );
}

export default App;