import cors from 'cors'

export const corsMiddleware = cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']
})
