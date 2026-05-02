export interface ExtraBullet {
  id: string
  company: string
  bullets: string
}

export interface AdditionalInfo {
  extraBullets: ExtraBullet[]
  projects: string
  skills: string
  bio: string
}

export function buildUserMessage(
  resumeText: string,
  jobDescription: string,
  additionalInfo: AdditionalInfo,
): string {
  const parts: string[] = []

  parts.push(`# CANDIDATE'S CURRENT RESUME\n\n${resumeText.trim()}`)
  parts.push(`# TARGET JOB DESCRIPTION\n\n${jobDescription.trim()}`)

  const extras: string[] = []

  const validBullets = additionalInfo.extraBullets.filter(
    (b) => b.company.trim() || b.bullets.trim(),
  )
  if (validBullets.length > 0) {
    let section =
      '## Additional Bullet Points\nThe candidate wants these accomplishments woven into the appropriate roles:\n\n'
    for (const item of validBullets) {
      section += `**${item.company.trim() || 'Unspecified Role'}:**\n${item.bullets.trim()}\n\n`
    }
    extras.push(section.trim())
  }

  if (additionalInfo.projects.trim()) {
    extras.push(`## Additional Projects\n${additionalInfo.projects.trim()}`)
  }

  if (additionalInfo.skills.trim()) {
    extras.push(`## Additional Skills / Technologies\n${additionalInfo.skills.trim()}`)
  }

  if (additionalInfo.bio.trim()) {
    extras.push(`## Additional Background / Context\n${additionalInfo.bio.trim()}`)
  }

  if (extras.length > 0) {
    parts.push(`# ADDITIONAL EXPERIENCE & CONTEXT\n\n${extras.join('\n\n')}`)
  }

  parts.push(
    'Please tailor my resume for this position. ' +
      'Return the complete tailored resume in markdown format followed by the Tailoring Notes section.',
  )

  return parts.join('\n\n---\n\n')
}
