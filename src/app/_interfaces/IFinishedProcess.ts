export interface IFinishedProcess {
  title: string
  finishedStages: { prompt: string, answer: string, finishedChoices: { text: string, "value": string } [] }[]
}
