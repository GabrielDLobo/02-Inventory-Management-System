import { useEffect, useRef, useState, type RefObject } from 'react'

interface UseInViewResult {
  ref: RefObject<HTMLDivElement | null>
  inView: boolean
  hasBeenVisible: boolean
}

// Observa quando um elemento entra na viewport, para pausar trabalho caro
// (renderização 3D contínua) fora dela. `hasBeenVisible` fica true para
// sempre após a primeira interseção, o que serve para adiar o carregamento
// do bundle 3D até o elemento realmente aparecer na tela.
export function useInView(threshold = 0.1): UseInViewResult {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setHasBeenVisible(true)
      },
      { threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView, hasBeenVisible }
}
