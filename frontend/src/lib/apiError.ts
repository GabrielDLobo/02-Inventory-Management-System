import { isAxiosError } from 'axios'
import type { ApiValidationError } from '@/services/api/types'

// Erros de validação do DRF vêm como { campo: ["mensagem"] } no corpo da
// resposta 400/403; qualquer outro erro (rede, 500) não tem esse formato.
export function extractValidationErrors(error: unknown): ApiValidationError {
  if (isAxiosError<ApiValidationError>(error) && error.response?.data) {
    return error.response.data
  }
  return { detail: 'Não foi possível salvar. Tente novamente.' }
}

// DRF manda erro de campo como lista (["mensagem"]) e erro geral (detail)
// como string simples: normaliza os dois formatos pra exibir num só lugar.
export function fieldError(value: string[] | string | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}
