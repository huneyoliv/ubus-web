import { Outlet, useLocation } from 'react-router-dom'
import BottomNav from './BottomNav'
import SideNav from './SideNav'

export default function AppLayout({ children }: { children?: React.ReactNode }) {
    const location = useLocation()
    const hiddenNavRoutes = ['/bilhete']
    const showNav = !hiddenNavRoutes.includes(location.pathname)

    return (
        <div className="w-full flex min-h-dvh" style={{ background: 'var(--color-bg)' }}>
            {showNav && <SideNav />}

            <div className="flex-1 flex flex-col min-w-0 relative">
                <div className={`flex-1 overflow-y-auto ${showNav ? 'pb-20 md:pb-0' : 'pb-0'}`}>
                    <div className="w-full max-w-2xl mx-auto px-0 md:px-6 md:py-6">
                        {children ?? <Outlet />}
                    </div>
                </div>
                {showNav && <BottomNav />}
            </div>
        </div>
    )
}
