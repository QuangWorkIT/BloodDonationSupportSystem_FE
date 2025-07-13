import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
function Forbidden() {
  const nav = useNavigate()

  const handleGoBack = () => {
    nav('/', { replace: true })
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className='text-[48px] font-bold'>403-Forbidden</h1>
      <p className='mb-4'>Sorry, you don't have permission to access this page.</p>
      <Button
        className='bg-red-600'
        onClick={handleGoBack}
      >Go Back Home
      </Button>
    </div>
  )
}

export default Forbidden
