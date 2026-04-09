import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const lines = {
  intro:
    "Welcome to AMHRL. This is a guided client acquisition experience. Scroll down and I’ll walk you through what I build, how it works, and what the right system could look like for your business.",

  hero:
    "This is where the experience begins. AMHRL is designed to feel like a real product, not a static landing page. It introduces the offer with clarity, tone, and intent.",

  services:
    "Here you choose what you actually need. Whether it is a website, a web app, or an AI system, the goal is to shape the build around your business instead of forcing your business into a generic template.",

  deliverables:
    "The deliverables are not random assets. You get a complete system built to attract attention, guide the visitor, and move the right people toward action.",

  process:
    "This section explains how the work gets done. First we define the right system, then we design the experience, then we build the product around what makes the most sense to launch first.",

  proof:
    "This works because the interface, the story, and the offer all align. When those pieces are coherent, the product feels stronger and the business feels more trustworthy.",

  cta:
    "This is the decision point. You can explore more work, or book a call and I will help you map out what your business actually needs to build next.",
}

const outputDir = path.resolve('public/audio')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

for (const [key, text] of Object.entries(lines)) {
  console.log(`Generating ${key}...`)

  const speech = await openai.audio.speech.create({
    model: 'gpt-4o-mini-tts',
    voice: 'alloy',
    input: text,
    response_format: 'mp3',
  })

  const buffer = Buffer.from(await speech.arrayBuffer())
  fs.writeFileSync(path.join(outputDir, `${key}.mp3`), buffer)
}

console.log('Done.')