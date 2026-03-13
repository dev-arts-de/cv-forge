import { LANGUAGE_NAMES, type Locale } from '@/types'

function currentDateLine(): string {
  const d = new Date()
  const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  return `Today's date: ${formatted}. Use this as the authoritative reference for all date and timeline evaluations — do NOT assume any year based on training data.`
}

export const CV_ANALYSIS_SCHEMA = `{
  "is_cv": <true if the submitted text is clearly a CV/resume, false if it is something else entirely>,
  "overall_score": <number 0-100>,
  "grade": <"A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F">,
  "top_quick_wins": [<string>, <string>, <string>],
  "categories": {
    "grundstruktur": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "klare_struktur", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "antichronologisch", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "zeitraeume", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "laenge", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    },
    "sprache": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "rechtschreibung", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "stichpunkte", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "aktive_verben", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "keine_floskeln", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    },
    "berufserfahrung": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "aufgaben_klar", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "messbare_ergebnisse", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "karriereentwicklung", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "relevanztipp", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    },
    "ausbildung": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "reihenfolge", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "vollstaendig", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "schwerpunkte", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    },
    "skills": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "hard_skills", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "soft_skills", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "einschaetzung", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    },
    "kontakt": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "kontaktdaten", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "email_professionell", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "linkedin", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    },
    "ats": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "format", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "keywords", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "sonderzeichen", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    },
    "gesamtwirkung": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "roter_faden", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "erfassbarkeit", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> },
        { "id": "individualitaet", "label": <string: translated label>, "status": <"pass"|"warn"|"fail">, "note": <string: max 8 words> }
      ]
    }
  }
}`

export function buildSystemPrompt(): string {
  return `You are an expert HR specialist and career consultant with 15+ years of experience in the DACH region.
${currentDateLine()}

FIRST: Determine if the submitted text is a CV/resume. Set "is_cv" to true only if it contains typical CV elements (name, contact info, work experience, education, or skills). If the submitted text is a recipe, article, code, random text, or anything clearly not a CV, set "is_cv" to false and you still MUST return the full JSON structure — but you can set all scores to 0 and use short placeholder feedback.

IF is_cv is true: Analyze the CV according to 8 categories, each with specific checklist items.

For each check item:
- "pass": criterion clearly met
- "warn": partially met or minor issue
- "fail": criterion not met or significant problem

Note field: max 8 words, specific observation (not generic).
Score thresholds: green=75-100, yellow=40-74, red=0-39. Status must match the score.
overall_score: weighted average (berufserfahrung 25%, gesamtwirkung 20%, sprache 15%, grundstruktur 15%, skills 10%, ausbildung 10%, kontakt 5%)
top_quick_wins: 3 most impactful, specific, actionable improvements.

The "label" field in each check item must be translated into the requested language.
All text fields (feedback, notes, labels, top_quick_wins) must be in the requested language.

Respond ONLY as valid JSON matching this exact schema. No markdown. No explanations outside JSON.

${CV_ANALYSIS_SCHEMA}`
}

export function buildUserPrompt(cvText: string, locale: Locale): string {
  const languageName = LANGUAGE_NAMES[locale]
  return `Analyze this CV. Respond in ${languageName}. All text fields — including check labels, notes, feedback, and quick wins — must be written in ${languageName}.

Here is the CV:

${cvText}`
}

// ─── Job Match ───────────────────────────────────────────────────────────────

const JOB_MATCH_SCHEMA = `{
  "overall_match_score": <number 0-100>,
  "grade": <"A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F">,
  "required_skills": [<string>, ...],
  "matching_skills": [<string>, ...],
  "missing_skills": [<string>, ...],
  "nice_to_have_skills": [<string>, ...],
  "company_culture": <string: 1-2 sentences>,
  "ats_keywords": [<string>, ...],
  "feedback": <string: 2-3 sentences overall assessment>,
  "top_improvements": [<string>, <string>, <string>]
}`

export function buildJobMatchPrompt(
  cvText: string,
  jobText: string,
  locale: Locale
): { system: string; user: string } {
  const languageName = LANGUAGE_NAMES[locale]

  const system = `You are an expert career consultant and talent acquisition specialist with 15+ years of experience matching candidates to job opportunities.
${currentDateLine()}

Your task: Analyze how well a candidate's CV matches a given job posting.

Extract required and nice-to-have skills from the job posting. Check which skills the CV demonstrates. Calculate an honest match score.

Score thresholds: green=75-100, yellow=40-74, red=0-39.
All text fields must be in ${languageName}.
Respond ONLY as valid JSON matching this exact schema. No markdown. No explanations outside JSON.

${JOB_MATCH_SCHEMA}`

  const user = `Analyze the match between this CV and job posting. Respond entirely in ${languageName}.

--- CV ---
${cvText}

--- JOB POSTING ---
${jobText}`

  return { system, user }
}

// ─── Cover Letter ─────────────────────────────────────────────────────────────

const COVER_LETTER_SCHEMA = `{
  "overall_score": <number 0-100>,
  "grade": <"A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F">,
  "humanness_score": <number 0-100: how human and authentic the letter sounds, 0=robot, 100=very personal>,
  "success_probability": <"Hoch" | "Mittel" | "Gering"> (in the requested language),
  "categories": {
    "grundstruktur": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "klare_gliederung", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "absatzstruktur", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "lesbarkeit", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "laenge", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "roter_faden", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "individuelle_anrede", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "formaler_aufbau", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "stellenbezug": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "bezug_stelle", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "bezug_unternehmen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "motivation_position", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "anforderungen_aufgegriffen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "mehrwert", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "keine_standardtexte", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "motivation": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "ehrliche_motivation", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "persoenliche_gruende", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "begeisterung", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "unternehmenskultur", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "authentisch", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "qualifikationen": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "relevante_erfahrungen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "konkrete_beispiele", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "bezug_neue_stelle", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "verantwortung", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "uebertragbare_kompetenzen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "kompetenzen": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "fachliche_kenntnisse", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "methoden_tools", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "fachliche_schwerpunkte", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "soft_skills", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "arbeitsweise", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "teamfuehrung", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "unternehmensbezug": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "warum_unternehmen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "interesse_produkte", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "branchenverstaendnis", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "aktuelle_entwicklungen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "sprache": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "klare_formulierungen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "aktiver_schreibstil", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "selbstbewusst", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "keine_floskeln", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "rechtschreibung", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "individuelle_ausdrucksweise", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "zukunft": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "konkreter_beitrag", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "ziele", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "entwicklungsperspektive", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "verantwortung_uebernehmen", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    },
    "schluss": {
      "score": <number 0-100>,
      "status": <"green"|"yellow"|"red">,
      "feedback": <string: 1-2 sentences>,
      "checks": [
        { "id": "abschlussformulierung", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "gespraechswunsch", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "verfuegbarkeit", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "grussformel", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> },
        { "id": "unterschrift", "label": <translated>, "status": <"pass"|"warn"|"fail">, "note": <max 8 words> }
      ]
    }
  },
  "top_improvements": [
    { "section": <string>, "original": <string: original text excerpt>, "improved": <string: improved version>, "reason": <string: why this is better> },
    { "section": <string>, "original": <string>, "improved": <string>, "reason": <string> },
    { "section": <string>, "original": <string>, "improved": <string>, "reason": <string> }
  ]
}`

export function buildCoverLetterPrompt(
  coverLetterText: string,
  jobText: string,
  locale: Locale
): { system: string; user: string } {
  const languageName = LANGUAGE_NAMES[locale]

  const system = `You are an expert career consultant and application coach with 15+ years of experience reviewing cover letters in the DACH region.
${currentDateLine()}

Your task: Analyze the provided cover letter against the job posting in detail across 9 categories. Provide concrete before/after improvements for the top 3 weakest points.

humanness_score: Rate how authentic and personal the letter sounds (0=very generic/robotic, 100=very individual and human).
success_probability: Assess the overall chance of getting an interview based on this cover letter.

For each check: "pass"=clearly fulfilled, "warn"=partially met, "fail"=not met.
Score thresholds: green=75-100, yellow=40-74, red=0-39.
All text fields must be in ${languageName}.
Respond ONLY as valid JSON matching this exact schema. No markdown. No explanations outside JSON.

${COVER_LETTER_SCHEMA}`

  const user = `Analyze this cover letter in the context of the job posting. Respond entirely in ${languageName}.

--- COVER LETTER ---
${coverLetterText}

--- JOB POSTING ---
${jobText}`

  return { system, user }
}

// ─── Fit Score ────────────────────────────────────────────────────────────────

const FIT_SCORE_SCHEMA = `{
  "overall_fit": <number 0-100>,
  "grade": <"A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F">,
  "skills_match": [
    { "skill": <string>, "has": <boolean>, "importance": <"must"|"nice">, "note": <string: max 10 words, optional> },
    ...
  ],
  "experience_fit": <number 0-100>,
  "motivation_fit": <number 0-100>,
  "culture_fit": <number 0-100>,
  "recommendation": <string: in requested language, e.g. "Starker Kandidat" / "Solider Kandidat" / "Außenseiter">,
  "recommendation_level": <"strong" | "good" | "weak">,
  "summary": <string: 2-3 sentences overall assessment>,
  "missing_critical": [<string>, ...]
}`

export function buildFitScorePrompt(
  cvText: string,
  jobText: string,
  coverLetterText: string | null,
  locale: Locale
): { system: string; user: string } {
  const languageName = LANGUAGE_NAMES[locale]

  const system = `You are a senior talent acquisition expert and career strategist with 15+ years placing candidates at top companies.
${currentDateLine()}

Your task: Provide a comprehensive fit score analysis combining CV, job posting, and optionally a cover letter. Evaluate how well the candidate matches the role across skills, experience, motivation and culture.

skills_match: List ALL relevant skills/requirements from the job posting and indicate if the candidate has them.
experience_fit: How well does the candidate's seniority and experience align with requirements (0-100)?
motivation_fit: Based on the cover letter (if provided), how strong and genuine is their motivation (0-100)? Use 50 if no cover letter.
culture_fit: How well does the candidate's profile align with the company culture (0-100)?
recommendation_level: "strong"=clear fit, "good"=solid candidate with some gaps, "weak"=significant mismatches.

Be honest and realistic. A score of 90+ should be rare and only for near-perfect matches.
All text fields must be in ${languageName}.
Respond ONLY as valid JSON matching this exact schema. No markdown. No explanations outside JSON.

${FIT_SCORE_SCHEMA}`

  const coverLetterSection = coverLetterText
    ? `\n--- COVER LETTER ---\n${coverLetterText}`
    : '\n(No cover letter provided)'

  const user = `Analyze the overall fit between this candidate and the job. Respond entirely in ${languageName}.

--- CV ---
${cvText}

--- JOB POSTING ---
${jobText}${coverLetterSection}`

  return { system, user }
}
