'use client'

import { useState, useEffect } from 'react'
import ResumeUpload from '@/components/ResumeUpload'
import AdditionalInfoPanel from '@/components/AdditionalInfoPanel'
import OutputPanel from '@/components/OutputPanel'
import type { AdditionalInfo } from '@/lib/user-message'

const EMPTY_ADDITIONAL: AdditionalInfo = {
  extraBullets: [],
  projects: '',
  skills: '',
  bio: '',
}

interface ModelInfo {
  model: string
  env: string
  meta: { label: string; description: string }
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo>(EMPTY_ADDITIONAL)
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelUsed, setModelUsed] = useState('')
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)

  useEffect(() => {
    fetch('/api/model-info')
      .then((r) => r.json())
      .then(setModelInfo)
      .catch(() => null)
  }, [])

  const handleGenerate = async () => {
    if (!file) {
      setError('Please upload your resume (.docx)')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description')
      return
    }

    setError(null)
    setOutput('')
    setIsLoading(true)
    setModelUsed('')

    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDescription)
      formData.append('additionalInfo', JSON.stringify(additionalInfo))

      const res = await fetch('/api/tailor-resume', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Request failed (${res.status})`)
      }

      const usedModel = res.headers.get('X-Model-Used') ?? ''
      setModelUsed(usedModel)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setOutput((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const canGenerate = !!file && jobDescription.trim().length > 0 && !isLoading

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Resume Tailor</h1>
            <p className="text-xs text-gray-400">AI-powered resume customization with Claude</p>
          </div>
          {modelInfo && (
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                modelInfo.env === 'prod'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
              title={modelInfo.meta.description}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              {modelInfo.env === 'prod' ? 'Production' : 'Development'} · {modelInfo.model}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left column — inputs */}
          <div className="flex flex-col gap-5">
            {/* Resume upload */}
            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Resume <span className="font-normal text-gray-400">.docx</span>
              </label>
              <ResumeUpload
                file={file}
                onFileSelect={setFile}
                onFileRemove={() => setFile(null)}
              />
            </section>

            {/* Job description */}
            <section className="flex flex-col">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here — title, responsibilities, requirements, preferred qualifications…"
                rows={10}
                className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </section>

            {/* Additional info */}
            <section>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Additional Information{' '}
                <span className="font-normal text-gray-400">optional</span>
              </label>
              <AdditionalInfoPanel value={additionalInfo} onChange={setAdditionalInfo} />
            </section>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Tailored Resume
                </>
              )}
            </button>
          </div>

          {/* Right column — output */}
          <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-7rem)]">
            <OutputPanel content={output} isLoading={isLoading} modelUsed={modelUsed} />
          </div>
        </div>
      </main>
    </div>
  )
}
