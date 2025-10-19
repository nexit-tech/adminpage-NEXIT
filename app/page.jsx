'use client'
import withAuth from '../HOC/withAuth'

function Home() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao sistema de gestão empresarial!</p>
    </div>
  )
}

export default withAuth(Home)