export const MODELS = {
  dev: 'gpt-4o-mini',
  prod: 'gpt-4o',
} as const

export type ModelEnv = keyof typeof MODELS

export function getModelEnv(): ModelEnv {
  return process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
}

export function getModel(): string {
  return MODELS[getModelEnv()]
}

export const MODEL_META: Record<ModelEnv, { label: string; description: string }> = {
  dev: {
    label: 'Dev',
    description: 'gpt-4o-mini · fast & cheap for testing',
  },
  prod: {
    label: 'Prod',
    description: 'gpt-4o · most capable',
  },
}
