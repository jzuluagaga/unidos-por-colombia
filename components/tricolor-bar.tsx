export function TricolorBar() {
  return (
    <div
      aria-hidden="true"
      className="flex h-1.5 w-full"
      role="presentation"
    >
      <div className="h-full w-1/2 bg-[#fcd116]" />
      <div className="h-full w-1/4 bg-[#003893]" />
      <div className="h-full w-1/4 bg-[#ce1126]" />
    </div>
  )
}
