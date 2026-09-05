import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  Bars3Icon,
  ChartBarIcon,
  CubeIcon,
  SparklesIcon,
  Squares2X2Icon,
  TagIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import type { NavGroup } from '@/components/ui/Sidebar'

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Estoque',
    items: [
      { key: 'dashboard', label: 'Dashboard', href: '/', icon: Squares2X2Icon },
      { key: 'products', label: 'Produtos', href: '/produtos', icon: CubeIcon },
      { key: 'categories', label: 'Categorias', href: '/categorias', icon: Bars3Icon },
      { key: 'brands', label: 'Marcas', href: '/marcas', icon: TagIcon },
      { key: 'suppliers', label: 'Fornecedores', href: '/fornecedores', icon: TruckIcon },
    ],
  },
  {
    label: 'Movimentações',
    items: [
      { key: 'inflows', label: 'Entradas', href: '/entradas', icon: ArrowDownTrayIcon },
      { key: 'outflows', label: 'Saídas', href: '/saidas', icon: ArrowUpTrayIcon },
    ],
  },
  {
    label: 'Inteligência',
    items: [
      { key: 'ai', label: 'Assistente IA', href: '/assistente', icon: SparklesIcon, badge: 'IA' },
      { key: 'reports', label: 'Relatórios', href: '/relatorios', icon: ChartBarIcon },
    ],
  },
]

export const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/produtos': 'Produtos',
  '/categorias': 'Categorias',
  '/marcas': 'Marcas',
  '/fornecedores': 'Fornecedores',
  '/entradas': 'Entradas',
  '/saidas': 'Saídas',
  '/assistente': 'Assistente IA',
  '/relatorios': 'Relatórios',
}
