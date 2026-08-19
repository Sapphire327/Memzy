import type { LevelBucket } from '#shared/schemas'

export default function padBuckets(buckets: LevelBucket[], maxKey: number): LevelBucket[] {
  const countByKey = new Map(buckets.map((bucket) => [bucket.key, bucket.count]))
  const result: LevelBucket[] = []
  for (let key = 1; key <= maxKey; key++) {
    result.push({ key, count: countByKey.get(key) ?? 0 })
  }
  return result
}