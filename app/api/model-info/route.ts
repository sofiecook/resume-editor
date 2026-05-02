import { getModel, getModelEnv, MODEL_META } from '@/lib/models'

export async function GET() {
  const env = getModelEnv()
  return Response.json({
    model: getModel(),
    env,
    meta: MODEL_META[env],
  })
}
