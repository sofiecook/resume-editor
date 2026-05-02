'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
  isLoading: boolean
  modelUsed: string
}

export default function OutputPanel({ content, isLoading, modelUsed }: Props) {
  const [copied, setCopied] = useState(false)
  const [view, setView] = useState<'preview' | 'markdown'>('preview')

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tailored-resume.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const isEmpty = !content && !isLoading

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white">
      {/* Panel header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-800">Tailored Resume</span>
          {modelUsed && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                modelUsed.includes('opus')
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {modelUsed}
            </span>
          )}
        </div>

        {content && (
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-md border border-gray-200 text-xs">
              <button
                onClick={() => setView('preview')}
                className={`px-2.5 py-1 transition-colors ${
                  view === 'preview'
                    ? 'bg-gray-100 font-medium text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setView('markdown')}
                className={`px-2.5 py-1 transition-colors ${
                  view === 'markdown'
                    ? 'bg-gray-100 font-medium text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Markdown
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              .md
            </button>
          </div>
        )}
      </div>

      {/* Panel body */}
      <div className="flex-1 overflow-auto px-5 py-4">
        {isEmpty && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500">Your tailored resume will appear here</p>
            <p className="mt-1 text-xs text-gray-400">Upload your resume, paste the job description, then click Generate</p>
          </div>
        )}

        {isLoading && !content && (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <p className="text-sm text-gray-500">Claude is tailoring your resume…</p>
          </div>
        )}

        {content && (
          <>
            {view === 'preview' ? (
              <div className="resume-output">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap font-mono text-xs text-gray-700">{content}</pre>
            )}
          </>
        )}
      </div>
    </div>
  )
}
