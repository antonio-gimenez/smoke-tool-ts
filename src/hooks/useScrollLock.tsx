import { useEffect } from 'react'

// This is a map of all the documents that have had their scroll locked
const overflows = new Map<Document, { count: number }>()

function useScrollLock(doc: Document | null, shouldBeLocked: boolean) {
  let entry = doc ? overflows.get(doc) : undefined
  let locked = entry ? entry.count > 0 : false

  useEffect(() => {
    if (!doc || !shouldBeLocked) {
      return
    }


    overflows.set(doc, { count: (entry ? entry.count : 0) + 1 })
    Object.assign(doc.body.style, { overflow: 'hidden' })

    return () => {
      let entry = overflows.get(doc)
      if (!entry) {
        return
      }

      overflows.set(doc, { count: entry.count - 1 })
      if (entry.count === 1) {
        Object.assign(doc.body.style, { overflow: '' })
      }
    }

  }, [shouldBeLocked, doc])

  return locked
}


export default useScrollLock