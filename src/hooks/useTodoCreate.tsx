import axios from 'axios'
import { ICreateDTO } from '../dto/dto'
import toast from 'react-hot-toast'

const useTodoCreate = () => {
  const notifySubmit = () => {
    toast.success('Created', { position: 'top-center', duration: 2000 })
  }

  const notifyError = () => {
    toast.error('Cannot Create', { position: 'top-center', duration: 2000 })
  }

  const Submit = async (todo: ICreateDTO) => {
    try {
      await axios.post<ICreateDTO>(`http://localhost:8080/create`, todo)
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

  return { Submit }
}

export default useTodoCreate
