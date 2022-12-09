import dynamic from 'next/dynamic'
import { NextPage } from 'next'

const App = dynamic(() => import('../components/app'), {
  ssr: false,
})

const Home: NextPage = () => {
  return (
    <App />
  )
}

export default Home
