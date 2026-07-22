import { getApiHealth } from '../lib/health.js'

export default function handler(_req, res) {
  res.status(200).json(getApiHealth())
}
