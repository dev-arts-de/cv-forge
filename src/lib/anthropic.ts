import Anthropic from '@anthropic-ai/sdk'
import { type CVAnalysisResult, type JobMatchResult, type CoverLetterResult, type FitScoreResult } from '@/types'
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildJobMatchPrompt,
  buildCoverLetterPrompt,
  buildFitScorePrompt,
} from './prompts'
import type { Locale } from '@/types'

let _client: Anthropic | null = null
function getClient() {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  return _client
}

export class NotACVError extends Error {
  constructor() {
    super('not_a_cv')
    this.name = 'NotACVError'
  }
}

function parseJSON<T>(text: string): T {
  let jsonText = text.trim()
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }
  return JSON.parse(jsonText) as T
}

async function callAI(system: string, user: string, maxTokens = 4096): Promise<string> {
  const message = await getClient().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: user }],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI')
  }
  return content.text
}

export async function analyzeCVWithAI(cvText: string, locale: Locale): Promise<CVAnalysisResult> {
  const systemPrompt = buildSystemPrompt()
  const userPrompt = buildUserPrompt(cvText, locale)

  const text = await callAI(systemPrompt, userPrompt)
  const result = parseJSON<CVAnalysisResult & { is_cv?: boolean }>(text)

  if (result.is_cv === false) {
    throw new NotACVError()
  }

  if (
    typeof result.overall_score !== 'number' ||
    !result.grade ||
    !Array.isArray(result.top_quick_wins) ||
    !result.categories
  ) {
    throw new Error('Invalid AI response structure')
  }

  return result
}

export async function analyzeJobMatchWithAI(
  cvText: string,
  jobText: string,
  locale: Locale
): Promise<JobMatchResult> {
  const { system, user } = buildJobMatchPrompt(cvText, jobText, locale)
  const text = await callAI(system, user, 2048)
  const result = parseJSON<JobMatchResult>(text)

  if (typeof result.overall_match_score !== 'number' || !result.grade) {
    throw new Error('Invalid job match response structure')
  }

  return result
}

export async function analyzeCoverLetterWithAI(
  coverLetterText: string,
  jobText: string,
  locale: Locale
): Promise<CoverLetterResult> {
  const { system, user } = buildCoverLetterPrompt(coverLetterText, jobText, locale)
  const text = await callAI(system, user, 4096)
  const result = parseJSON<CoverLetterResult>(text)

  if (typeof result.overall_score !== 'number' || !result.grade || !result.categories) {
    throw new Error('Invalid cover letter response structure')
  }

  return result
}

export async function analyzeFitScoreWithAI(
  cvText: string,
  jobText: string,
  coverLetterText: string | null,
  locale: Locale
): Promise<FitScoreResult> {
  const { system, user } = buildFitScorePrompt(cvText, jobText, coverLetterText, locale)
  const text = await callAI(system, user, 2048)
  const result = parseJSON<FitScoreResult>(text)

  if (typeof result.overall_fit !== 'number' || !result.grade || !Array.isArray(result.skills_match)) {
    throw new Error('Invalid fit score response structure')
  }

  return result
}
