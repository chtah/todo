import axios from 'axios'
import { IEditDTO } from '../dto/dto'
import toast from 'react-hot-toast'

const useTodoDelete = () => {
  const SubmitDelete = async (id: number) => {
    const notifySubmit = () => {
      toast.success('Deleted', { position: 'top-center', duration: 1500 })
    }

    const notifyError = () => {
      toast.error('Cannot Submit', { position: 'top-center', duration: 2000 })
    }

    try {
      await axios.delete<IEditDTO>(`http://localhost:8080/delete`, { data: { id: id } })
      setTimeout(() => {
        notifySubmit()
      }, 500)
    } catch (err) {
      setTimeout(() => {
        notifyError()
      }, 500)
      console.error(err)
    }
  }

  return { SubmitDelete }
}

export default useTodoDelete
