import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from '@/components/ui/Layout'
import { NAV_GROUPS, PAGE_TITLES } from './navGroups'
import { useAuth } from './authContext'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  return (
    <Layout
      groups={NAV_GROUPS}
      activeHref={location.pathname}
      username={username ?? ''}
      title={PAGE_TITLES[location.pathname] ?? 'SGE'}
      onNavigate={(href) => navigate(href)}
      onLogout={() => {
        logout()
        navigate('/login', { replace: true })
      }}
    >
      <Outlet />
    </Layout>
  )
}
