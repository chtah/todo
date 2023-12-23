import classes from './Home.module.css'
import { Button, Input, Space, DatePicker, TimePicker } from 'antd'
import { useState } from 'react'
import type { DatePickerProps } from 'antd'
import type { Dayjs } from 'dayjs'
import useTodoCreate from '../hooks/useTodoCreate'

const Home = () => {
  const [newTodo, setTodo] = useState<string>('')
  const [newDate, setDate] = useState<string>('')
  const [newTime, setTime] = useState<string>('')
  const { Submit } = useTodoCreate()

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
    setDate(dateString)
  }

  const onTimeChange = (time: Dayjs | null, timeString: string) => {
    console.log(time, timeString)
    setTime(timeString)
  }

  const SubmitTodo = () => {
    if (newDate) {
      const combinedDateTime = new Date(`${newDate}T${newTime || '00:00:00'}Z`)
      console.log(combinedDateTime)
      Submit({ todo_list: newTodo, date: combinedDateTime })
    } else {
      console.error('Please select date.')
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
    </div>
  )
}

export default Home
