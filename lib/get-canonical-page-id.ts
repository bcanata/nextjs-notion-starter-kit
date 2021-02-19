import { ExtendedRecordMap } from 'notion-types'
import { uuidToId } from 'notion-utils'
import { getBlockTitle } from 'notion-utils'
import { parsePageId } from 'notion-utils'

import { inversePageUrlOverrides } from './config'

/**
 * Gets the canonical, display-friendly version of a page's ID for use in URLs.
 */
export const getCanonicalPageIdImpl = (
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null => {
  if (!pageId || !recordMap) return null

  const id = uuidToId(pageId)
  const block = recordMap.block[pageId]?.value

  if (block) {
    const title = normalizeTitle(getBlockTitle(block, recordMap))

    if (title) {
      if (uuid) {
        return `${title}-${id}`
      } else {
        return title
      }
    }
  }

  return id
}

export const normalizeTitle = (title: string | null): string => {
  return (title || '')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/Ş/g, 's')
    .replace(/İ/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/ /g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/--/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '')
    .trim()
    .toLowerCase()
}

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | null {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return null
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    return getCanonicalPageIdImpl(pageId, recordMap, {
      uuid
    })
  }
}
