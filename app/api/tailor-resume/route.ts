import OpenAI from 'openai'
import mammoth from 'mammoth'
import { getModel } from '@/lib/models'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import { buildUserMessage, type AdditionalInfo } from '@/lib/user-message'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(req: Request) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return new Response('Invalid request body', { status: 400 })
  }

  const resumeFile = formData.get('resume') as File | null
  const jobDescription = (formData.get('jobDescription') as string) ?? ''
  const additionalInfoStr = (formData.get('additionalInfo') as string) ?? '{}'

  if (!resumeFile) {
    return new Response('No resume file provided', { status: 400 })
  }
  if (!jobDescription.trim()) {
    return new Response('No job description provided', { status: 400 })
  }

  // Parse docx on the server
  let resumeText: string
  try {
    const buffer = Buffer.from(await resumeFile.arrayBuffer())
    const result = await mammoth.extractRawText({ buffer })
    resumeText = result.value.trim()
  } catch {
    return new Response(
      'Failed to parse resume. Please make sure you uploaded a valid .docx file.',
      { status: 400 },
    )
  }

  if (!resumeText) {
    return new Response('Could not extract text from the resume file.', { status: 400 })
  }

  let additionalInfo: AdditionalInfo
  try {
    additionalInfo = JSON.parse(additionalInfoStr)
  } catch {
    additionalInfo = { extraBullets: [], projects: '', skills: '', bio: '' }
  }

  const userMessage = buildUserMessage(resumeText, jobDescription, additionalInfo)
  const model = getModel()
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const openaiStream = await client.chat.completions.create({
    model,
    max_tokens: 8192,
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
  })

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of openaiStream) {
          const text = chunk.choices[0]?.delta?.content
          if (text) {
            controller.enqueue(new TextEncoder().encode(text))
          }
        }
      } catch (err) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
    cancel() {
      openaiStream.controller.abort()
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Model-Used': model,
    },
  })
}
