export interface ProfileUser {
  login: string
  createdAt: Date
}

export interface LevelBucket {
  key: number
  count: number
}

export interface ProfilePackProgress {
  id: number
  name: string
  isPublic: boolean
  totalQuests: number
  learnedQuests: number
  lastRepeat?: Date
  nextRepeat?: Date
}

export interface ProfileDashboard {
  user: ProfileUser | null
  dueCount: number
  learningCount: number
  inProgressCount: number
  fullyLearnedCount: number
  lastTraining: Date | null
  levelDistribution: LevelBucket[]
  stageDistribution: LevelBucket[]
  packs: ProfilePackProgress[]
}
