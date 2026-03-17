import { useEffect, useRef } from 'react'

function useDragScroll() {
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return undefined
    }

    let active = false
    let startX = 0
    let startScrollLeft = 0

    function handlePointerDown(event) {
      active = true
      startX = event.clientX
      startScrollLeft = element.scrollLeft
      element.setPointerCapture?.(event.pointerId)
      element.classList.add('is-dragging')
    }

    function handlePointerMove(event) {
      if (!active) {
        return
      }

      const delta = event.clientX - startX
      element.scrollLeft = startScrollLeft - delta
    }

    function stopDragging(event) {
      active = false
      element.releasePointerCapture?.(event.pointerId)
      element.classList.remove('is-dragging')
    }

    element.addEventListener('pointerdown', handlePointerDown)
    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerup', stopDragging)
    element.addEventListener('pointerleave', stopDragging)
    element.addEventListener('pointercancel', stopDragging)

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown)
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerup', stopDragging)
      element.removeEventListener('pointerleave', stopDragging)
      element.removeEventListener('pointercancel', stopDragging)
    }
  }, [])

  return ref
}

export default useDragScroll
