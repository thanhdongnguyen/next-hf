'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function RemoveImageBackground() {
  const [file, setFile] = useState<File | null>(null)
  const [model, setModel] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
      setOriginalImage(URL.createObjectURL(event.target.files[0]))
    }
  }

  const handleProcess = async () => {
    if (!file || !model) return

    setIsProcessing(true)
    setProgress(0)

    // Simulating processing
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Simulating processed image
    // In a real scenario, you would get this URL from your API
    setProcessedImage('/placeholder.svg?height=300&width=300')

    setIsProcessing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remove Image Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <Select onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="u2net">U2Net</SelectItem>
            <SelectItem value="deeplabv3">DeepLabV3</SelectItem>
            <SelectItem value="modnet">MODNet</SelectItem>
          </SelectContent>
        </Select>
        {originalImage && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Original Image</h3>
            <img src={originalImage} alt="Original" className="max-w-full h-auto" />
          </div>
        )}
        <Button onClick={handleProcess} disabled={!file || !model || isProcessing}>
          {isProcessing ? 'Processing...' : 'Remove Background'}
        </Button>
        {isProcessing && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Processing...</div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
        {processedImage && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Processed Image</h3>
            <img src={processedImage} alt="Processed" className="max-w-full h-auto" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}