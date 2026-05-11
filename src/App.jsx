import { DataProvider } from './contexts/DataContext.jsx'
import Layout from './components/Layout.jsx'
import { useHashRoute, parseRoute } from './hooks/useHashRoute.js'
import Dashboard from './views/Dashboard.jsx'
import BeansLibrary from './views/BeansLibrary.jsx'
import LogEspresso from './views/LogEspresso.jsx'
import LogDrip from './views/LogDrip.jsx'
import BrewLog from './views/BrewLog.jsx'
import Trends from './views/Trends.jsx'
import DataManagement from './views/DataManagement.jsx'

function Router({ hash }) {
  const { path, params } = parseRoute(hash)
  switch (path) {
    case '/':
    case '': return <Dashboard />
    case '/beans': return <BeansLibrary />
    case '/log-espresso': return <LogEspresso cloneId={params.get('clone')} />
    case '/log-drip': return <LogDrip cloneId={params.get('clone')} />
    case '/brews': return <BrewLog />
    case '/trends': return <Trends />
    case '/data': return <DataManagement />
    default: return <Dashboard />
  }
}

export default function App() {
  const hash = useHashRoute()
  const { path } = parseRoute(hash)
  return (
    <DataProvider>
      <Layout currentPath={path}>
        <Router hash={hash} />
      </Layout>
    </DataProvider>
  )
}
