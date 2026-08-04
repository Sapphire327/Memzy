export default (key?: string | null): string | null => {
  if (!key) return null
  const publicUrl = useRuntimeConfig().public.s3?.publicUrl
  if (!publicUrl) return key
  return `${publicUrl}/${key}`
}