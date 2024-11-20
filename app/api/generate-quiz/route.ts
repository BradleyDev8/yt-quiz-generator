import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is not configured')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function downloadVideo(url: string, outputPath: string): Promise<void> {
  try {
    const command = `yt-dlp -x --audio-format mp3 --audio-quality 0 -o "${outputPath}" "${url}"`
    console.log('Running command:', command)
    
    const { stdout, stderr } = await execAsync(command)
    
    if (stderr) {
      console.log('yt-dlp stderr:', stderr)
    }
    if (stdout) {
      console.log('yt-dlp stdout:', stdout)
    }
    
    // Verify the file exists
    if (!fs.existsSync(outputPath)) {
      throw new Error('Downloaded file not found at expected location');
    }
    
    console.log('Download completed successfully')
  } catch (error) {
    console.error('Error downloading video:', error)
    throw error
  }
}

export async function POST(request: Request) {
  let audioPath: string | null = null;
  let convertedAudioPath: string | null = null;

  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      )
    }

    console.log('Processing URL:', url)

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) {
      console.log('Creating temp directory:', tempDir)
      fs.mkdirSync(tempDir)
    }

    // Generate a unique filename using timestamp
    const timestamp = Date.now()
    audioPath = path.join(tempDir, `${timestamp}.mp3`)
    console.log('Audio path:', audioPath)
    
    console.log('Downloading video...')
    
    // Add a timeout for the download
    const downloadTimeout = 120000; // 2 minutes
    await Promise.race([
      downloadVideo(url, audioPath),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Download timed out')), downloadTimeout)
      )
    ]);

    // Double check file exists before proceeding
    if (!fs.existsSync(audioPath)) {
      throw new Error('Audio file not found after download');
    }

    console.log('Video downloaded successfully');
    console.log('Converting audio...')
    
    // Convert audio to format compatible with OpenAI's Whisper API
    convertedAudioPath = path.join(tempDir, `${timestamp}-converted.mp3`)
    const { stdout, stderr } = await execAsync(
      `ffmpeg -i "${audioPath}" -ar 16000 -ac 1 -c:a libmp3lame "${convertedAudioPath}"`
    );
    
    if (stderr) {
      console.log('FFmpeg stderr:', stderr);
    }

    console.log('Audio converted successfully');
    console.log('Transcribing audio...')

    // Check if the converted file exists and has content
    if (!fs.existsSync(convertedAudioPath) || fs.statSync(convertedAudioPath).size === 0) {
      throw new Error('Converted audio file is missing or empty');
    }

    // Transcribe audio using OpenAI's Whisper API
    const audioFile = fs.createReadStream(convertedAudioPath)
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    })

    console.log('Audio transcribed successfully');
    console.log('Generating quiz questions...')

    // Generate quiz questions using GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI that generates quiz questions based on video transcripts. Generate 5 multiple-choice questions with 4 options each. Format the response as a JSON array of objects, where each object has a "question", "options" (array of 4 strings), and "correctAnswer" (index of correct option, 0-based) properties.',
        },
        {
          role: 'user',
          content: transcription.text,
        },
      ],
    })

    // Clean up temporary files
    console.log('Cleaning up temporary files...')
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath)
    }
    if (convertedAudioPath && fs.existsSync(convertedAudioPath)) {
      fs.unlinkSync(convertedAudioPath)
    }

    // Parse the quiz questions from the GPT-4 response
    const quizQuestions = JSON.parse(completion.choices[0].message.content || '[]')
    console.log('Quiz generation complete')

    return NextResponse.json({ questions: quizQuestions })
  } catch (error) {
    console.error('Error generating quiz:', error)
    
    // Clean up temporary files in case of error
    try {
      if (audioPath && fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath)
      }
      if (convertedAudioPath && fs.existsSync(convertedAudioPath)) {
        fs.unlinkSync(convertedAudioPath)
      }
    } catch (cleanupError) {
      console.error('Error cleaning up files:', cleanupError)
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}
