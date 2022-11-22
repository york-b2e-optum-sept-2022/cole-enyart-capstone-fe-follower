export interface IProcess {
  id: number
  title: string
  stages: { id: number, prompt: string, type: string, choices: { id: number, text: string } [] }[]
}
