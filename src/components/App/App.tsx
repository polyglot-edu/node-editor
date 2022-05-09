import { Navigate, Route, Routes } from 'react-router-dom';
import AppFlowProvider from '../AppFlowProvider/AppFlowProvider';
import loadFlowElementsAsync, { loadExampleFlowElementsAsync } from '../../data/api';

const App = () => {
    return (
        <Routes>
            <Route path="/id/:flowId" element={<AppFlowProvider fetchFunction={loadFlowElementsAsync} />} />
            <Route path="/example/:flowId" element={<AppFlowProvider fetchFunction={loadExampleFlowElementsAsync} />} />
            <Route index element={<Navigate to="/example/1" replace />} />
        </Routes>
    );
}

export default App;