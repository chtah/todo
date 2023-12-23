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

  const onEdit = async () => {
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
          <TimePicker className={classes.inputTime} onChange={onTimeChange} format={'HH:mm'} />
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
                  <TodoCard todoPost={todo} onTodoDeleted={onDelete} onTodoEdited={onEdit} />
                </div>
              )
            })
          : todoData &&
            todoData.map((todo) => {
              return (
                <div key={todo.id}>
                  <TodoCard todoPost={todo} onTodoDeleted={onDelete} onTodoEdited={onEdit} />
                </div>
              )
            })}
      </div>
    </div>
  )
}

export default Home
