export interface IFinishedProcess {
  title: string
  finishedStages: { prompt: string, answer: string }[]
}
