import { describe, expect, it } from 'vitest'
import packageJson from '../package.json' with { type: 'json' }

describe('package.json', () => {
  it('should have the correct name', () => {
    expect(packageJson.name).toBe('hyllama')
  })
  it('should have a valid version', () => {
    expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+$/)
  })
  it('should have precise dependency versions', () => {
    const { devDependencies } = packageJson
    Object.values(devDependencies).forEach(version => {
      expect(version).toMatch(/^\d+\.\d+\.\d+$/)
    })
  })
  it('should have no dependencies', () => {
    expect('dependencies' in packageJson).toBe(false)
    expect('peerDependencies' in packageJson).toBe(false)
  })
})
