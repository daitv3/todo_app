import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDCTCCAfGgAwIBAgIJfhiLg2I9oXZ8MA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNV
BAMTF2Rldi1kYWl0djMudXMuYXV0aDAuY29tMB4XDTI0MTIxMjE1MjY0N1oXDTM4
MDgyMTE1MjY0N1owIjEgMB4GA1UEAxMXZGV2LWRhaXR2My51cy5hdXRoMC5jb20w
ggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDD3F0Q5rn0cg0am5ynH87r
xSSGFm1XKpPJZsCMpXJEAhtNFvD3UjuZmW9CKPQ2fCQxg9dd39mpMMc39nhvZ+G6
Q6WqZiNNZ64mY9ibZsy4S1GBDQOMHVS4qd1+qGh0Q+c/QuWkhsc0jG3WlE5qWT6w
FEwLQINgQc3VxFu9gU+6/LTlJ2R5qaCXNQ1pjzW0hoxxyyCw813svu6TcqQpHVob
2wQVlio9eI6avd41y94nwKekovNWyqYCx6Lx1lmFgHqnqK73iTpVNduNFsO1p2PH
LDU7f2xei1DEPm4lI4fXvQ6+0HUdPBq9BfzQdru30qgBZtPeScDyDOCYDf1cSRqL
AgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFK2IpS0jX+TAIVpb
Mulf6QzUW14bMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAeVIZ
xclOd0jd43R+Io5AcZtSz4peNfvwbvm4ikUuM7JKzuQeIFzyAyEuktvsEkfhvZsL
JEvs7SVh52QD0JVZBgYddZoKLfl3zzPwhVNyoy9gbrU3ad4NbyPt0TTzdK5WGO8r
hV25KEwvV+Z5AvIbNlbKi3pk/z3SVuzTguXHwzWYC1+65uC6pqtrYuCUlfzCbAuY
/vzQ3nfeS/yndCp553QmvwKibzwJ7vWmc74fM0JEgC7YEBxS+ofJC08lHN7Bw+Uk
M4NZVJeobMml5PVb0MaYC/b9mcD6+YUdo9hEGfKaKe+432o5HUrbXARvDmiPL7Zs
iXVLLqrs5z4h+88BbQ==
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification -- done
  return jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] });
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
