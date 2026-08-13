import type { H3Event } from 'h3'
import getUserViewPack from '~~/server/utils/getUserViewPack'

export default async function getUserRepeatPack(event: H3Event) {
  const { pack, userId } = await getUserViewPack(event)
  return { pack, userId }
}
