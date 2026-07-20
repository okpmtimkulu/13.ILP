import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Devices } from './pages/Devices'
import { Foundations } from './pages/Foundations'
import { FundamentalsPage } from './pages/Fundamentals'
import { Home } from './pages/Home'
import { LLM } from './pages/LLM'
import { Networks } from './pages/Networks'
import { IPRouting } from './pages/IPRouting'
import { NetServices } from './pages/NetServices'
import { Memory } from './pages/Memory'
import { OS } from './pages/OS'
import { Web } from './pages/Web'
import { Compilers } from './pages/Compilers'
import { MathCS } from './pages/MathCS'
import { DSA } from './pages/DSA'
import { Databases } from './pages/Databases'
import { Security } from './pages/Security'
import { Paradigms } from './pages/Paradigms'
import { SWE } from './pages/SWE'
import { Distributed } from './pages/Distributed'
import { CloudFoundations } from './pages/CloudFoundations'
import { CloudIdentity } from './pages/CloudIdentity'
import { CloudNetworking } from './pages/CloudNetworking'
import { CloudProduction } from './pages/CloudProduction'
import { Ethics } from './pages/Ethics'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="learn/fundamentals" element={<FundamentalsPage />} />
        <Route path="learn/foundations" element={<Foundations />} />
        <Route path="learn/networks" element={<Networks />} />
        <Route path="learn/iprouting" element={<IPRouting />} />
        <Route path="learn/netservices" element={<NetServices />} />
        <Route path="learn/llm" element={<LLM />} />
        <Route path="learn/memory" element={<Memory />} />
        <Route path="learn/os" element={<OS />} />
        <Route path="learn/web" element={<Web />} />
        <Route path="learn/compilers" element={<Compilers />} />
        <Route path="learn/math" element={<MathCS />} />
        <Route path="learn/dsa" element={<DSA />} />
        <Route path="learn/databases" element={<Databases />} />
        <Route path="learn/security" element={<Security />} />
        <Route path="learn/paradigms" element={<Paradigms />} />
        <Route path="learn/swe" element={<SWE />} />
        <Route path="learn/distributed" element={<Distributed />} />
        <Route path="learn/cloud-foundations" element={<CloudFoundations />} />
        <Route path="learn/cloud-identity" element={<CloudIdentity />} />
        <Route path="learn/cloud-networking" element={<CloudNetworking />} />
        <Route path="learn/cloud-production" element={<CloudProduction />} />
        <Route path="learn/ethics" element={<Ethics />} />
        <Route path="devices" element={<Devices />} />
        {/* Redirect old /world route */}
        <Route path="world" element={<Navigate to="/learn/networks" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
