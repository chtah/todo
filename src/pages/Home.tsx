import classes from './Home.module.css'
import { Button, Input, Space, DatePicker, TimePicker } from 'antd'
import { useState } from 'react'
import type { DatePickerProps } from 'antd'
import type { Dayjs } from 'dayjs'
import useTodoCreate from '../hooks/useTodoCreate'
import useTodoGet from '../hooks/useTodoGet'
import TodoCard from '../components/todoCard'
import { ITodoDTO } from '../dto/dto'

const Home = () => {
  const [newTodo, setTodo] = useState<string>('')
  const [newDate, setDate] = useState<string>('')
  const [newTime, setTime] = useState<string>('')
  const { Submit } = useTodoCreate()
  const { todoData, fetchData } = useTodoGet()
  const [newTodoList, setTodoList] = useState<ITodoDTO[] | null>(todoData)

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
    setDate(dateString)
  }

  const onTimeChange = (time: Dayjs | null, timeString: string) => {
    console.log(time, timeString)
    setTime(timeString)
  }

  const SubmitTodo = async () => {
    if (newDate) {
      try {
        const combinedDateTime = new Date(`${newDate}T${newTime || '00:00:00'}Z`)
        await Submit({ todo_list: newTodo, date: combinedDateTime })
        const newData = await fetchData()
        newData && newData ? setTodoList(newData) : null
      } catch (error) {
        console.error('Submit data error', error)
      }
    } else {
      console.error('Please select date.')
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

  return (
    <div>
      <h1 className={classes.title}>TODO LIST</h1>
      <div className={classes.container}>
        <Space.Compact className={classes.inputTodo}>
          <Input
            onChange={(e) => {
              setTodo(e.target.value)
            }}
            placeholder="Todo"
          />
          <DatePicker className={classes.inputDate} onChange={onDateChange} placeholder="Date" />
          <TimePicker className={classes.inputTime} onChange={onTimeChange} />
          <Button type="primary" onClick={SubmitTodo}>
            Submit
          </Button>
        </Space.Compact>
      </div>
      <div className={classes.card}>
        {newTodoList !== null
          ? newTodoList.map((todo) => {
              return (
                <div key={todo.id}>
                  <TodoCard todoPost={todo} onTodoDeleted={onDelete} />
                </div>
              )
            })
          : todoData &&
            todoData.map((todo) => {
              return (
                <div key={todo.id}>
                  <TodoCard todoPost={todo} onTodoDeleted={onDelete} />
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default Home
