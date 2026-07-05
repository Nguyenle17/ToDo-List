import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'

import ToDoPage from '@/pages/ToDoPage/ToDoPage'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<ToDoPage />} />
            </Route>
        </Routes>
    )
}
