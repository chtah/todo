import { useState } from 'react'
import { ITodoDTO } from '../dto/dto'
import useTodoDelete from '../hooks/useTodoDelete'
import useTodoEdit from '../hooks/useTodoEdit'
import classes from './todoCard.module.css'
import { Checkbox, Button, DatePicker, DatePickerProps, Input, Modal, TimePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

interface ITodoProps {
  todoPost: ITodoDTO
  onTodoDeleted: () => void
  onTodoEdited: () => void
  onTodoCheck: () => void
}

const TodoCard = ({ todoPost, onTodoDeleted, onTodoEdited, onTodoCheck }: ITodoProps) => {
  const showDate = dayjs(todoPost.date).utc().format('YYYY-MM-DD')
  const showTime = dayjs(todoPost.date).utc().format('HH:mm')
  const { SubmitDelete } = useTodoDelete()
  const { SubmitEdit } = useTodoEdit()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTodo, setTodo] = useState<string>(todoPost.todo_list)
  const [newDate, setDate] = useState<Dayjs>(dayjs(todoPost.date).utc())
  const [newTime, setTime] = useState<Dayjs>(dayjs(todoPost.date).utc())

  const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
    date !== null ? setDate(date) : null
  }

  const onTimeChange = (time: Dayjs | null, timeString: string) => {
    console.log(time, timeString)
    time !== null ? setTime(time) : null
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {
    try {
      const combinedDateTime = new Date(
        `${newDate.format('YYYY-MM-DD')}T${newTime.format('HH:mm:ss') || '00:00:00'}.000Z`,
      )
      const updatedTodo = { id: todoPost.id, todo_list: newTodo, date: combinedDateTime }
      await SubmitEdit(updatedTodo)
      onTodoEdited()
    } catch (error) {
      console.error('Error editing data', error)
    }
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const deleteButton = async (id: number) => {
    try {
      await SubmitDelete(id)
      onTodoDeleted()
    } catch (error) {
      console.error('Error delete data', error)
    }
  }

  const onCheckedChange = async () => {
    const updatedTodo = { id: todoPost.id, isDone: !todoPost.isDone }
    await SubmitEdit(updatedTodo)
    onTodoCheck()
  }

  return (
    <div className={classes.card}>
      <p className={todoPost.isDone ? `${classes.todoDone}` : `${classes.todoNotDone}`}>{todoPost.todo_list}</p>
      <p className={todoPost.isDone ? `${classes.todoDone}` : `${classes.todoNotDone}`}>{showDate}</p>
      <p className={todoPost.isDone ? `${classes.todoDone}` : `${classes.todoNotDone}`}>{showTime}</p>
      <Checkbox onChange={onCheckedChange} checked={todoPost.isDone} />
      <Button onClick={() => deleteButton(todoPost.id)}>Delete</Button>
      <Button onClick={showModal}>Edit</Button>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input
          onChange={(e) => {
            setTodo(e.target.value)
          }}
          defaultValue={newTodo}
          placeholder="Todo"
        />
        <DatePicker className={classes.inputDate} defaultValue={newDate} onChange={onDateChange} placeholder="Date" />
        <TimePicker className={classes.inputTime} defaultValue={newTime} onChange={onTimeChange} format={'HH:mm'} />
      </Modal>
    </div>
  )
}
export default TodoCard
