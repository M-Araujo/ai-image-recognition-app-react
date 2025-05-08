// src/setupTests.ts
import '@testing-library/jest-dom'
import { Canvas, Image, ImageData as NodeImageData } from 'canvas'

// tell ESLint “I know what I’m doing here”
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).HTMLCanvasElement = Canvas
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).HTMLImageElement  = Image
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).ImageData         = NodeImageData
