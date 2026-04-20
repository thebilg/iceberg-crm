export const useApi = () => {
  const config = useRuntimeConfig()

  const base = config.public.apiBase || ''
  const buildUrl = (url: string) => {
    const normalizedBase = String(base).replace(/\/$/, '')
    const normalizedPath = url.startsWith('/') ? url : `/${url}`
    return `${normalizedBase}${normalizedPath}`
  }

  return {
    get: <T>(url: string) => $fetch<T>(buildUrl(url)),
    post: <T>(url: string, body: Record<string, any>) => $fetch<T>(buildUrl(url), { method: 'POST', body }),
    patch: <T>(url: string, body: Record<string, any>) => $fetch<T>(buildUrl(url), { method: 'PATCH', body }),
    delete: <T>(url: string) => $fetch<T>(buildUrl(url), { method: 'DELETE' })
  }
}