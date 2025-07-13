import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const nav = useNavigate()

  const handleGoBack = () => {
    nav('/', { replace: true })
  }
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <h1 className='text-[48px] font-bold'>404 ERROR</h1>
      <p className='mb-4'>The page you are looking for cannot be found.</p>
      <Button
        className='bg-red-600'
        onClick={handleGoBack}
      >Go Back Home
      </Button>
    </div>
  )
}

export default NotFoundPage
