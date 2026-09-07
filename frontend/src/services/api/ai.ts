import { apiClient } from './client'
import type { AIResult } from './types'

// Endpoint próprio (ver ai/views.py no backend): não existia antes da Fase 3
// — o app "ai" só era acionado pelo management command sge_agent_invoke.
export const aiService = {
  async latest(): Promise<AIResult | null> {
    const { data } = await apiClient.get<AIResult | null>('/ai/latest/')
    return data
  },
  async invoke(): Promise<AIResult> {
    const { data } = await apiClient.post<AIResult>('/ai/invoke/')
    return data
  },
}
