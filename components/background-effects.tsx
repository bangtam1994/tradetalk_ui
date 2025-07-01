export function BackgroundEffects() {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-1000">
        <div className="absolute w-[800px] h-[800px] -left-[400px] top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#6dcbf9]/30 via-[#36cde1]/20 to-[#B766FF]/20 rounded-full blur-[100px]" />
      </div>
    )
  }