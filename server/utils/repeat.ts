export const MAX_LEVEL = 4
export const MAX_STAGE = 6

export const STAGE_INTERVALS_MS: Record<number, number> = {
  1: 25 * 60 * 1000,
  2: 24 * 60 * 60 * 1000,
  3: 3 * 24 * 60 * 60 * 1000,
  4: 7 * 24 * 60 * 60 * 1000,
  5: 14 * 24 * 60 * 60 * 1000,
  6: 30 * 24 * 60 * 60 * 1000,
}

export function intervalMs(stage: number): number {
  return STAGE_INTERVALS_MS[stage] ?? 30 * 24 * 60 * 60 * 1000
}

export interface RepeatState {
  level: number | null
  stage: number | null
}

export interface RepeatResult {
  level: number
  stage: number
  nextRepeat: Date
}

export function calculateRepeatResult(current: RepeatState | undefined, isRight: boolean, now: Date): RepeatResult {
  let level: number
  let stage: number
  if (isRight) {
    const baseLevel = current ? (current.level ?? 0) : 1
    level = Math.min(MAX_LEVEL, baseLevel + 1)
    stage = Math.min(MAX_STAGE, (current?.stage ?? 0) + 1)
  } else {
    stage = 1
    level = Math.max(1, (current?.level ?? 1) - 1)
  }
  const nextRepeat = new Date(now.getTime() + intervalMs(stage))
  return { level, stage, nextRepeat }
}