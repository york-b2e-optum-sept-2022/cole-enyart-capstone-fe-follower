export interface IProcess {
  id: number
  title: string
  stage: { id: number, prompt: string, type: string, choice: { id: number, text: string } [] }[]
}
