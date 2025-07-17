// AtmOverlay.jsx
"use client"

import { useState, useEffect } from "react"
import AudioManager from "../utils/AudioManager"
import ReturnButton from "../components/ui/ReturnButton"

export const AtmOverlay = ({ isVisible, onClose }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setMounted(true), 2300)
      return () => clearTimeout(timer)
    } else {
      AudioManager.play("transition")
      setMounted(false)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 pointer-events-auto">
      <div
        className={`relative w-full h-full p-8 overflow-y-auto transition-all duration-500 ${
          mounted ? "opacity-100" : " opacity-0"
        }`}
      >
        {/* Put the content here */}
        <div className="fixed inset-0 flex items-center justify-center pt-36">
          <div className=" w-[560px] h-[320px] bg-gray-200 flex items-center justify-center">
            <p className="text-center">Put Your Content here!</p>
          </div>
        </div>
        <ReturnButton onClick={onClose} variant="pink" className="!bottom-14">
          Return to Castle
        </ReturnButton>
      </div>
    </div>
  )
}

export default AtmOverlay
