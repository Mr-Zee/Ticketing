
import { Card, CardContent, Grid, Typography } from '@mui/material'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const ticketsPerDay = [
  { name: 'Mon', tickets: 12 },
  { name: 'Tue', tickets: 18 },
  { name: 'Wed', tickets: 9 },
  { name: 'Thu', tickets: 22 },
  { name: 'Fri', tickets: 17 }
]

const byStatus = [
  { name: 'OPEN', value: 7 },
  { name: 'PENDING', value: 5 },
  { name: 'RESOLVED', value: 9 },
  { name: 'CLOSED', value: 3 }
]

export default function Analytics(){
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card><CardContent>
          <Typography variant="h6">Tickets per Day</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={ticketsPerDay}><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="tickets" /></LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card><CardContent>
          <Typography variant="h6">By Status</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byStatus}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </Grid>
    </Grid>
  )
}
