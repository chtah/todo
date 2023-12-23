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
import toast, { Toaster } from 'react-hot-toast'

const Home = () => {
  const [newTodo, setTodo] = useState<string>('')
  const [newDate, setDate] = useState<Dayjs | null>(null)
  const [newTime, setTime] = useState<Dayjs | null>(null)
  const { Submit } = useTodoCreate()
  const { todoData, fetchData } = useTodoGet()
  const [newTodoList, setTodoList] = useState<ITodoDTO[] | null>(todoData)

  const onDateChange: DatePickerProps['onChange'] = (date) => {
    date !== null ? setDate(date) : null
  }

  const onTimeChange = (time: Dayjs | null) => {
    time !== null ? setTime(time) : null
  }

  const SubmitTodo = async () => {
    const notifyError = () => toast.error('Enter Todo', { position: 'top-center', duration: 1500 })
    if (newDate) {
      if (newTodo === '') {
        return setTimeout(() => {
          resetField()
          notifyError()
        }, 500)
      }
      try {
        const combinedDateTime = new Date(
          `${newDate.format('YYYY-MM-DD')}T${(newTime && newTime.format('HH:mm:ss')) || '00:00:00'}.000Z`,
        )
        await Submit({ todo_list: newTodo, date: combinedDateTime })
        const newData = await fetchData()
        newData && newData ? setTodoList(newData) : null

        resetField()
      } catch (error) {
        console.error('Submit data error', error)
      }
    } else {
      if (newTodo === '' && newDate === null && newTime === null) {
        return setTimeout(() => {
          resetField()
          notifyError()
        }, 500)
      }
      //handle dont input date and time
      await Submit({ todo_list: newTodo, date: new Date(dayjs().utc().startOf('day').toISOString()) })
      const newData = await fetchData()
      newData && newData ? setTodoList(newData) : null

      resetField()
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
    const notifySubmit = () => {
      toast.success('Edited', { position: 'top-center', duration: 1500 })
    }

    const notifyError = () => {
      toast.success('Cannot Edit', { position: 'top-center', duration: 1500 })
    }
    try {
      await fetchData()
      const newData = await fetchData()
      newData && newData ? setTodoList(newData) : null
      setTimeout(() => {
        notifySubmit()
      }, 500)
    } catch (error) {
      setTimeout(() => {
        notifyError()
      }, 500)
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

  const resetField = () => {
    setTodo('')
    setDate(null)
    setTime(null)
  }

  const pendingTodo = (
    newTodoList ? newTodoList.filter((todo) => !todo.isDone) : todoData ? todoData.filter((todo) => !todo.isDone) : []
  ).sort((todo1, todo2) => todo1.id - todo2.id)

  const completedTodo = (
    newTodoList ? newTodoList.filter((todo) => todo.isDone) : todoData ? todoData.filter((todo) => todo.isDone) : []
  ).sort((todo1, todo2) => todo1.id - todo2.id)

  return (
    <div>
      <Toaster />
      <h1 className={classes.title}>TODO LIST</h1>
      <div className={classes.inputContainer}>
        <Space.Compact className={classes.inputTodo}>
          <Input
            onChange={(e) => {
              setTodo(e.target.value)
            }}
            placeholder="Enter Todo"
            value={newTodo}
          />
          <DatePicker className={classes.inputDate} onChange={onDateChange} placeholder="Date" value={newDate} />
          <TimePicker className={classes.inputTime} onChange={onTimeChange} format={'HH:mm'} value={newTime} />
          <Button type="primary" onClick={SubmitTodo}>
            Submit
          </Button>
        </Space.Compact>
      </div>

      <div className={classes.cardContainer}>
        {pendingTodo.length > 0 && (
          <>
            {pendingTodo.map((todo) => (
              <div key={todo.id}>
                <TodoCard todoPost={todo} onTodoDeleted={onDelete} onTodoEdited={onEdit} onTodoCheck={onCheck} />
              </div>
            ))}
          </>
        )}

        {completedTodo.length > 0 && (
          <>
            <hr className={classes.horizontalLine} />
            <h3 className={classes.titleHistory}>Done</h3>
            {completedTodo.map((todo) => (
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
