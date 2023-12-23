import { useState } from 'react'
import { ITodoDTO } from '../dto/dto'
import useTodoDelete from '../hooks/useTodoDelete'
import useTodoEdit from '../hooks/useTodoEdit'
import classes from './todoCard.module.css'
import { Checkbox, Button, DatePicker, DatePickerProps, Input, Modal, TimePicker } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

dayjs.extend(utc)

interface ITodoProps {
  todoPost: ITodoDTO
  onTodoDeleted: () => void
  onTodoEdited: () => void
  onTodoCheck: () => void
}

const TodoCard = ({ todoPost, onTodoDeleted, onTodoEdited, onTodoCheck }: ITodoProps) => {
  const showDate = dayjs(todoPost.date).utc().format('DD-MM-YYYY')
  const showTime = dayjs(todoPost.date).utc().format('HH:mm')
  const { SubmitDelete } = useTodoDelete()
  const { SubmitEdit } = useTodoEdit()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTodo, setTodo] = useState<string>(todoPost.todo_list)
  const [newDate, setDate] = useState<Dayjs>(dayjs(todoPost.date).utc())
  const [newTime, setTime] = useState<Dayjs>(dayjs(todoPost.date).utc())

  const onDateChange: DatePickerProps['onChange'] = (date) => {
    date !== null ? setDate(date) : null
  }

  const onTimeChange = (time: Dayjs | null) => {
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
    <div className={`${classes.card} ${todoPost.isDone ? classes.todoDone : null}`}>
      <div className={classes.left}>
        <Checkbox onChange={onCheckedChange} checked={todoPost.isDone} />
        <div className={classes.textContainer}>
          <p className={`${todoPost.isDone ? classes.todoDone : null}`}>{todoPost.todo_list}</p>
          <div className={classes.dateAndTimeContainer}>
            <p className={`${todoPost.isDone ? classes.todoDone : null}`}>{`Date ${showDate}`}</p>
            <p className={`${todoPost.isDone ? classes.todoDone : null}`}>{`Time ${showTime}`}</p>
          </div>
        </div>
      </div>

      <div className={classes.right}>
        <Button
          style={{ border: 'none', boxShadow: 'none' }}
          icon={<EditOutlined />}
          onClick={showModal}
          disabled={todoPost.isDone}
        />
        <Button
          style={{ border: 'none', boxShadow: 'none' }}
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteButton(todoPost.id)}
        />
      </div>

      <Modal title="Edit" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className={classes.modalContainer}>
          <Input
            className={classes.inputTodo}
            onChange={(e) => {
              setTodo(e.target.value)
            }}
            defaultValue={newTodo}
            placeholder="Todo"
          />
          <div className={classes.dateAndTime}>
            <DatePicker
              className={classes.inputDate}
              defaultValue={newDate}
              onChange={onDateChange}
              placeholder="Date"
            />
            <TimePicker className={classes.inputTime} defaultValue={newTime} onChange={onTimeChange} format={'HH:mm'} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default TodoCard
