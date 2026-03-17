import { useEffect, useRef, useState } from 'react'

function useContainerSize(initialWidth = 760, initialHeight = 320) {
  const ref = useRef(null)
  const [size, setSize] = useState({
    width: initialWidth,
    height: initialHeight,
  })

  useEffect(() => {
    if (!ref.current) {
      return undefined
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) {
        return
      }

      const nextWidth = Math.max(entry.contentRect.width, 320)
      const nextHeight = Math.max(entry.contentRect.height, initialHeight)

      setSize({
        width: nextWidth,
        height: nextHeight,
      })
    })

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [initialHeight])

  return [ref, size]
}

export default useContainerSize
