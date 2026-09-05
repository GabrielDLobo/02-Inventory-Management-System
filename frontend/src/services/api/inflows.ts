import { createLogResource } from './resource'
import type { Inflow, InflowInput } from './types'

// Só list/create/retrieve: inflows/urls.py não expõe update nem delete, e o
// usuário demo só tem view_inflow/add_inflow (seed_demo.py).
export const inflowsService = createLogResource<Inflow, InflowInput>('/inflows')
