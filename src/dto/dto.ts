export interface ITodoDTO {
  id: number
  todo_list: string
  date: Date
  isDone: boolean
}

export interface ICreateDTO {
  todo_list: string
  date: Date | null
}

export interface IEditDTO {
  todo_list?: string
  date?: Date
  isDone?: boolean
}
