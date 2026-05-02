'use client'

import { useState } from 'react'
import type { AdditionalInfo, ExtraBullet } from '@/lib/user-message'

interface Props {
  value: AdditionalInfo
  onChange: (value: AdditionalInfo) => void
}

type Tab = 'bullets' | 'projects' | 'skills' | 'bio'

const TABS: { id: Tab; label: string; hint: string }[] = [
  {
    id: 'bullets',
    label: 'Extra Bullets',
    hint: 'Add accomplishments for specific roles that aren\'t fully captured on your resume.',
  },
  {
    id: 'projects',
    label: 'Projects',
    hint: 'Describe additional projects — especially ones using technologies from the job description.',
  },
  {
    id: 'skills',
    label: 'Skills',
    hint: 'List additional skills or technologies not on your resume (comma-separated or one per line).',
  },
  {
    id: 'bio',
    label: 'About Me',
    hint: 'Share any background context, achievements, or information that could strengthen your candidacy.',
  },
]

export default function AdditionalInfoPanel({ value, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('bullets')

  const addBulletEntry = () => {
    onChange({
      ...value,
      extraBullets: [
        ...value.extraBullets,
        { id: Date.now().toString(), company: '', bullets: '' },
      ],
    })
  }

  const updateBullet = (id: string, field: keyof ExtraBullet, text: string) => {
    onChange({
      ...value,
      extraBullets: value.extraBullets.map((b) =>
        b.id === id ? { ...b, [field]: text } : b,
      ),
    })
  }

  const removeBullet = (id: string) => {
    onChange({ ...value, extraBullets: value.extraBullets.filter((b) => b.id !== id) })
  }

  const activeTabMeta = TABS.find((t) => t.id === activeTab)!

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <p className="mb-3 text-xs text-gray-400">{activeTabMeta.hint}</p>

        {/* Extra Bullets tab */}
        {activeTab === 'bullets' && (
          <div className="space-y-3">
            {value.extraBullets.map((entry) => (
              <div key={entry.id} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Company or role name"
                    value={entry.company}
                    onChange={(e) => updateBullet(entry.id, 'company', e.target.value)}
                    className="flex-1 rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                  />
                  <button
                    onClick={() => removeBullet(entry.id)}
                    className="text-gray-400 hover:text-red-500"
                    title="Remove"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <textarea
                  placeholder="• Built X that improved Y by Z%&#10;• Led team of N to deliver..."
                  value={entry.bullets}
                  onChange={(e) => updateBullet(entry.id, 'bullets', e.target.value)}
                  rows={3}
                  className="w-full rounded border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
            ))}
            <button
              onClick={addBulletEntry}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-300 py-2 text-xs text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add role
            </button>
          </div>
        )}

        {/* Projects tab */}
        {activeTab === 'projects' && (
          <textarea
            placeholder={`Project Name | React.js, Node.js, PostgreSQL\nBuilt a full-stack task management app with real-time updates serving 500+ users. Reduced load time by 40% through caching.\n\nProject Name | Python, TensorFlow\n...`}
            value={value.projects}
            onChange={(e) => onChange({ ...value, projects: e.target.value })}
            rows={8}
            className="w-full rounded border border-gray-200 px-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          />
        )}

        {/* Skills tab */}
        {activeTab === 'skills' && (
          <textarea
            placeholder={`TypeScript, GraphQL, Docker, Kubernetes, AWS Lambda, Redis\nCertified Scrum Master, Google Analytics`}
            value={value.skills}
            onChange={(e) => onChange({ ...value, skills: e.target.value })}
            rows={5}
            className="w-full rounded border border-gray-200 px-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          />
        )}

        {/* Bio tab */}
        {activeTab === 'bio' && (
          <textarea
            placeholder={`I'm a software engineer with 5 years of experience focused on data pipelines. I led the migration of our ETL system from Spark to dbt, which cut data latency from 6 hours to 15 minutes. I'm particularly interested in this role because...`}
            value={value.bio}
            onChange={(e) => onChange({ ...value, bio: e.target.value })}
            rows={8}
            className="w-full rounded border border-gray-200 px-3 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          />
        )}
      </div>
    </div>
  )
}
