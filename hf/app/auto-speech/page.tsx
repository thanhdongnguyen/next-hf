'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { listModels } from "@huggingface/hub";


export default function AutoSpeech() {
  const [file, setFile] = useState<File | null>(null)
  const [model, setModel] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<{timestamp: string, text: string}[]>([])
  const [hfModel, setHFModel] = useState<string[]>([])
  const worker = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('./auto_speech.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e: any) => {
      switch (e.data.status) {
        case 'initiate':
          setReady(false);
          break;
        case 'ready':
          setReady(true);
          break;
        case 'complete':
          setResult(e.data.output[0])
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }
  
  const getListModels = async () => {
    const HF_TOKEN = "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"; // Replace with your Hugging Face token
    const resModel: string[] = [];
    for await (const model of listModels({search: {task: "automatic-speech-recognition"}, limit: 100 , accessToken: HF_TOKEN})) {
        resModel.push(model.name)
    }
    console.log({resModel})
    setHFModel(resModel);
    // const models = await listModels({
    //     search: {
    //         task: "automatic-speech-recognition"
    //     },
    //     accessToken: HF_TOKEN,
    // });
    // setHFModel(models)
    // console.log('models', models);
   
  }

  useEffect(() => {
    getListModels()
  }, [])

  const handleUpload = async () => {
    if (!file || !model) return

    setIsProcessing(true)
    setProgress(0)

    // Simulating processing
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i)
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Simulating results
    setResults([
      { timestamp: "00:00:05", text: "Hello, this is a sample text." },
      { timestamp: "00:00:10", text: "Generated from the audio file." },
      { timestamp: "00:00:15", text: "Using the selected model." },
    ])

    setIsProcessing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AutoSpeech</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <Select onValueChange={setModel}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {
                hfModel && hfModel.map(m => {
                    return (
                        <SelectItem key={m} value={m} >{m}</SelectItem>
                    )
                })
            }
          </SelectContent>
        </Select>
        <Button onClick={handleUpload} disabled={!file || !model || isProcessing}>
          {isProcessing ? 'Processing...' : 'Predict'}
        </Button>
        {isProcessing && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Processing...</div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
        {results.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Text</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.timestamp}</TableCell>
                  <TableCell>{result.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}