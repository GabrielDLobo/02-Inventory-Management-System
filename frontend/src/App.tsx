import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { AuthProvider } from '@/app/AuthProvider'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import { AppShell } from '@/app/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { PAGE_TITLES } from '@/app/navGroups'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            {Object.entries(PAGE_TITLES)
              .filter(([href]) => href !== '/')
              .map(([href, title]) => (
                <Route key={href} path={href} element={<ComingSoonPage title={title} />} />
              ))}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
