import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { AuthProvider } from '@/app/AuthProvider'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import { AppShell } from '@/app/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ProductsPage } from '@/pages/ProductsPage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { BrandsPage } from '@/pages/BrandsPage'
import { SuppliersPage } from '@/pages/SuppliersPage'
import { InflowsPage } from '@/pages/InflowsPage'
import { OutflowsPage } from '@/pages/OutflowsPage'
import { AssistantPage } from '@/pages/AssistantPage'
import { ReportsPage } from '@/pages/ReportsPage'

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
            <Route path="/produtos" element={<ProductsPage />} />
            <Route path="/categorias" element={<CategoriesPage />} />
            <Route path="/marcas" element={<BrandsPage />} />
            <Route path="/fornecedores" element={<SuppliersPage />} />
            <Route path="/entradas" element={<InflowsPage />} />
            <Route path="/saidas" element={<OutflowsPage />} />
            <Route path="/assistente" element={<AssistantPage />} />
            <Route path="/relatorios" element={<ReportsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
