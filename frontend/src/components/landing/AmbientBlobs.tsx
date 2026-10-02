/**
 * Decorative ambient glow blobs — positioned behind hero/sections
 * for that premium TUF-inspired glowing background effect.
 */
export function AmbientBlobs() {
  return (
    <div className="ambient-layer" aria-hidden="true">
      <span className="ambient-blob ambient-blob-a" />
      <span className="ambient-blob ambient-blob-b" />
      <span className="ambient-blob ambient-blob-c" />
      <span className="ambient-blob ambient-blob-d" />
    </div>
  )
}
