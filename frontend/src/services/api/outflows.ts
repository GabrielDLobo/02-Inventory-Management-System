import { createLogResource } from './resource'
import type { Outflow, OutflowInput } from './types'

// Só list/create/retrieve: outflows/urls.py não expõe update nem delete, e o
// usuário demo só tem view_outflow/add_outflow (seed_demo.py). A criação
// falha no backend se a quantidade exceder o estoque disponível.
export const outflowsService = createLogResource<Outflow, OutflowInput>('/outflows')
