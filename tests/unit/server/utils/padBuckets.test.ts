import { describe, expect, it } from 'vitest'
import padBuckets from '~~/server/utils/padBuckets'
import type { LevelBucket } from '#shared/schemas'

describe('padBuckets', () => {
  it('дополняет недостающие ключи нулями от 1 до maxKey', () => {
    const buckets: LevelBucket[] = [{ key: 2, count: 3 }]
    expect(padBuckets(buckets, 4)).toEqual([
      { key: 1, count: 0 },
      { key: 2, count: 3 },
      { key: 3, count: 0 },
      { key: 4, count: 0 },
    ])
  })

  it('сохраняет существующие количества', () => {
    const buckets: LevelBucket[] = [
      { key: 1, count: 5 },
      { key: 6, count: 2 },
    ]
    expect(padBuckets(buckets, 6)).toEqual([
      { key: 1, count: 5 },
      { key: 2, count: 0 },
      { key: 3, count: 0 },
      { key: 4, count: 0 },
      { key: 5, count: 0 },
      { key: 6, count: 2 },
    ])
  })

  it('с пустым массивом возвращает все нули', () => {
    expect(padBuckets([], 3)).toEqual([
      { key: 1, count: 0 },
      { key: 2, count: 0 },
      { key: 3, count: 0 },
    ])
  })
})