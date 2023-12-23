import classes from './Home.module.css'
import { Button, Input, Space, DatePicker, TimePicker } from 'antd'
import { useState } from 'react'
import type { DatePickerProps } from 'antd'
import type { Dayjs } from 'dayjs'
import useTodoCreate from '../hooks/useTodoCreate'
import useTodoGet from '../hooks/useTodoGet'
import TodoCard from '../components/todoCard'
import { ITodoDTO } from '../dto/dto'
import dayjs from 'dayjs'

const Home = () => {
  const [newTodo, setTodo] = useState<string>('')
  const [newDate, setDate] = useState<Dayjs | null>(null)
  const [newTime, setTime] = useState<Dayjs | null>(null)
  const { Submit } = useTodoCreate()
  const { todoData, fetchData } = useTodoGet()
  const [newTodoList, setTodoList] = useState<ITodoDTO[] | null>(todoData)

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
    date !== null ? setDate(date) : null
  }

  const onTimeChange = (time: Dayjs | null, timeString: string) => {
    console.log(time, timeString)
    time !== null ? setTime(time) : null
  }

  const SubmitTodo = async () => {
    if (newDate) {
      try {
        const combinedDateTime = new Date(
          `${newDate.format('YYYY-MM-DD')}T${(newTime && newTime.format('HH:mm:ss')) || '00:00:00'}.000Z`,
        )
        await Submit({ todo_list: newTodo, date: combinedDateTime })
        const newData = await fetchData()
        newData && newData ? setTodoList(newData) : null
      } catch (error) {
        console.error('Submit data error', error)
      }
    } else {
      //handle dont input date and time
      await Submit({ todo_list: newTodo, date: new Date(dayjs().utc().startOf('day').toISOString()) })
      const newData = await fetchData()
      newData && newData ? setTodoList(newData) : null
    }
  }

  const onDelete = async () => {
    try {
      await fetchData()
      const newData = await fetchData()
      newData && newData ? setTodoList(newData) : null
    } catch (error) {
      console.error('Error delete data', error)
    }
  }

  const onEdit = async () => {
    try {
      await fetchData()
      const newData = await fetchData()
      newData && newData ? setTodoList(newData) : null
    } catch (error) {
      console.error('Error delete data', error)
    }
  }

  const onCheck = async () => {
    try {
      await fetchData()
      const newData = await fetchData()
      newData && newData ? setTodoList(newData) : null
    } catch (error) {
      console.error('Error delete data', error)
    }
  }

  const completedTodos = (
    newTodoList ? newTodoList.filter((todo) => todo.isDone) : todoData ? todoData.filter((todo) => todo.isDone) : []
  ).sort((todo1, todo2) => todo1.id - todo2.id)

  const pendingTodos = (
    newTodoList ? newTodoList.filter((todo) => !todo.isDone) : todoData ? todoData.filter((todo) => !todo.isDone) : []
  ).sort((todo1, todo2) => todo1.id - todo2.id)

  return (
    <div>
      <h1 className={classes.title}>TODO LIST</h1>
      <div className={classes.inputContainer}>
        <Space.Compact className={classes.inputTodo}>
          <Input
            onChange={(e) => {
              setTodo(e.target.value)
            }}
            placeholder="Todo"
          />
          <DatePicker className={classes.inputDate} onChange={onDateChange} placeholder="Date" />
          <TimePicker className={classes.inputTime} onChange={onTimeChange} format={'HH:mm'} />
          <Button type="primary" onClick={SubmitTodo}>
            Submit
          </Button>
        </Space.Compact>
      </div>

      <div className={classes.cardContainer}>
        {pendingTodos.length > 0 && (
          <>
            {pendingTodos.map((todo) => (
              <div key={todo.id}>
                <TodoCard todoPost={todo} onTodoDeleted={onDelete} onTodoEdited={onEdit} onTodoCheck={onCheck} />
              </div>
            ))}
          </>
        )}

        {completedTodos.length > 0 && (
          <>
            <hr className={classes.horizontalLine} />
            <h3 className={classes.titleHistory}>History</h3>
            {completedTodos.map((todo) => (
              <div key={todo.id}>
                <TodoCard todoPost={todo} onTodoDeleted={onDelete} onTodoEdited={onEdit} onTodoCheck={onCheck} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
