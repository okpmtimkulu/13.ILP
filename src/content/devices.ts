import type { DeviceId } from '../lib/progress'

export interface DeviceLayer {
  id: string
  label: string
  /** Short line for the “inner workings” panel */
  blurb: string
  /** Tie back to a finished lab */
  lessonCallout?: string
}

export interface DeviceDefinition {
  id: DeviceId
  name: string
  tagline: string
  layers: DeviceLayer[]
  /** Algorithm overlay options for Observe mode */
  overlays: { id: string; label: string; description: string }[]
}

export const deviceCatalog: DeviceDefinition[] = [
  {
    id: 'pc-starter',
    name: 'Starter PC',
    tagline: 'ATX tower you unlocked from the golden path.',
    layers: [
      { id: 'case', label: 'Case & airflow', blurb: 'Air in, heat out. Thermals decide how hard you can push clocks.' },
      { id: 'mb', label: 'Motherboard', blurb: 'Buses move memory, PCIe, and USB frames to the CPU.' },
      {
        id: 'cpu',
        label: 'CPU socket',
        blurb: 'Fetch, decode, execute: the rhythm you practiced in lesson 3.',
        lessonCallout: 'This is the chip you watched tick through fetch and decode in Foundations.',
      },
      { id: 'ram', label: 'RAM', blurb: 'Fast, volatile working memory sitting next to the core.' },
    ],
    overlays: [
      { id: 'fetch', label: 'Fetch and decode cycle', description: 'Same flow as the toy CPU, scaled to a real pipeline mentally.' },
      { id: 'cache', label: 'Cache hierarchy (preview)', description: 'L1, L2, L3 as distance from the core: latency versus capacity.' },
    ],
  },
  {
    id: 'phone-slim',
    name: 'Pocket phone',
    tagline: 'SoC: compute, modem, sensors in one package.',
    layers: [
      { id: 'shell', label: 'Glass & shell', blurb: 'Antenna windows and structural rigidity trade off.' },
      { id: 'soc', label: 'SoC floorplan', blurb: 'CPU clusters, GPU blocks, NPU for on-device ML.' },
      { id: 'radio', label: 'Cell / Wi‑Fi', blurb: 'RF chains turn bits into electromagnetic waves.' },
      { id: 'battery', label: 'Battery & PMIC', blurb: 'Power delivery shapes burst performance and heat.' },
    ],
    overlays: [
      { id: 'scheduler', label: 'CPU scheduler', description: 'Foreground vs background work on a power budget.' },
      { id: 'npu', label: 'NPU inference', description: 'Fixed-function ops for fast, efficient neural nets.' },
    ],
  },
  {
    id: 'server-home',
    name: 'Home server',
    tagline: 'Small box, always on, NAS and containers.',
    layers: [
      { id: 'chassis', label: 'Quiet chassis', blurb: 'Cooling at low noise for living-room placement.' },
      { id: 'storage', label: 'Storage pool', blurb: 'RAID and redundancy for photos and backups.' },
      {
        id: 'net',
        label: '1 to 10 GbE',
        blurb: 'Local bandwidth for backups and streaming.',
        lessonCallout: 'Same “bits across distance” story as the map lab, inside the house.',
      },
    ],
    overlays: [
      { id: 'filesystem', label: 'Filesystem', description: 'How data is named, journaled, and checked.' },
      { id: 'docker', label: 'Containers', description: 'One kernel, many isolated userlands.' },
    ],
  },
  {
    id: 'server-commercial',
    name: 'Commercial rack',
    tagline: 'Shared power, networking, and redundancy.',
    layers: [
      { id: 'rack', label: 'Rack & PDUs', blurb: 'Power feeds and failover paths.' },
      { id: 'blade', label: 'Blades / nodes', blurb: 'Horizontal scale-out for requests and jobs.' },
      { id: 'tor', label: 'Top-of-rack switch', blurb: 'East-west traffic between servers.' },
    ],
    overlays: [
      { id: 'lb', label: 'Load balancing', description: 'Spreading requests across healthy backends.' },
      { id: 'consensus', label: 'Consensus (preview)', description: 'Agreement across nodes when data must not split.' },
    ],
  },
  {
    id: 'robot-arm',
    name: 'Robot arm',
    tagline: 'Sensors, actuators, control loop.',
    layers: [
      { id: 'links', label: 'Links & joints', blurb: 'Kinematics maps joint angles to the end effector.' },
      { id: 'motor', label: 'Motors & gears', blurb: 'Torque, backlash, and acceleration limits.' },
      { id: 'control', label: 'Controller', blurb: 'PID or model-based loops close the gap to the target.' },
    ],
    overlays: [
      { id: 'ik', label: 'Inverse kinematics', description: 'From desired pose back to joint commands.' },
      { id: 'vision', label: 'Vision → plan', description: 'Pixels to object pose to motion.' },
    ],
  },
  {
    id: 'vacuum-tube',
    name: 'Vacuum-tube node',
    tagline: 'Historical skin: same logic, glowing glass.',
    layers: [
      { id: 'tubes', label: 'Triodes / pentodes', blurb: 'Grid voltage controls plate current for amplification and switching.' },
      { id: 'memory', label: 'Mercury delay lines', blurb: 'Early memory as waves in a medium (slow but stateful).' },
    ],
    overlays: [
      { id: 'same-logic', label: 'Same boolean story', description: 'AND/OR still combine; only the physics layer changed.' },
    ],
  },
]

export function getDevice(id: DeviceId): DeviceDefinition | undefined {
  return deviceCatalog.find((d) => d.id === id)
}
