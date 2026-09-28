/**
 * Shrink a photo to a small square JPEG data URL before storing it: localStorage
 * only holds about 5 MB in total, and a phone photo alone can be larger than that.
 */
export const resizeImage = (file: File, size = 200): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = canvas.height = size
      const side = Math.min(img.width, img.height) // crop to a centred square
      canvas
        .getContext("2d")!
        .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("That file couldn't be read as an image."))
    }
    img.src = url
  })

let audioCtx: AudioContext | null = null

/** A short, quiet tick for the last seconds of a question. Synthesised, so no audio file is needed. */
export const tick = () => {
  try {
    audioCtx ??= new AudioContext()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15)
    osc.connect(gain).connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.15)
  } catch {
    // Sound is optional; ignore browsers that block it.
  }
}
