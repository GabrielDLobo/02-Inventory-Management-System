import { apiClient } from './client'

// Fábrica de serviço REST para os recursos com CRUD completo (products,
// categories, brands, suppliers). O backend não pagina nem filtra essas
// listas (generics.ListCreateAPIView/RetrieveUpdateDestroyAPIView puros,
// sem filter_backends), então GET list devolve um array simples.
export function createCrudResource<TEntity, TInput>(basePath: string) {
  return {
    async list(): Promise<TEntity[]> {
      const { data } = await apiClient.get<TEntity[]>(`${basePath}/`)
      return data
    },
    async get(id: number): Promise<TEntity> {
      const { data } = await apiClient.get<TEntity>(`${basePath}/${id}/`)
      return data
    },
    async create(input: TInput): Promise<TEntity> {
      const { data } = await apiClient.post<TEntity>(`${basePath}/`, input)
      return data
    },
    async update(id: number, input: Partial<TInput>): Promise<TEntity> {
      const { data } = await apiClient.patch<TEntity>(`${basePath}/${id}/`, input)
      return data
    },
    async remove(id: number): Promise<void> {
      await apiClient.delete(`${basePath}/${id}/`)
    },
  }
}

// Fábrica para inflows/outflows: registros imutáveis (sem update/delete na
// API nem permissão do usuário demo para isso).
export function createLogResource<TEntity, TInput>(basePath: string) {
  return {
    async list(): Promise<TEntity[]> {
      const { data } = await apiClient.get<TEntity[]>(`${basePath}/`)
      return data
    },
    async get(id: number): Promise<TEntity> {
      const { data } = await apiClient.get<TEntity>(`${basePath}/${id}/`)
      return data
    },
    async create(input: TInput): Promise<TEntity> {
      const { data } = await apiClient.post<TEntity>(`${basePath}/`, input)
      return data
    },
  }
}
