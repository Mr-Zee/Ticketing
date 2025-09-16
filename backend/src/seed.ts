
import 'dotenv/config'
import fetch from 'node-fetch'

const base = `http://localhost:${process.env.PORT || 8080}`

async function run(){
  const mk = (title:string, priority='LOW') =>
    fetch(`${base}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, priority })
    }).then(r=>r.json())

  await mk('Seed via script: Example ticket A', 'HIGH')
  await mk('Seed via script: Example ticket B', 'MEDIUM')
  console.log('Seeded')
}

run().catch(e=>{ console.error(e); process.exit(1) })
