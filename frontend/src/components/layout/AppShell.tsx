
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
export default function AppShell(){
  return (
    <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', minHeight:'100vh' }}>
      <Sidebar />
      <div style={{ display:'grid', gridTemplateRows:'64px 1fr' }}>
        <Topbar />
        <div style={{ padding: 16, overflow:'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
