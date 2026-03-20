import { useEffect, useState } from 'react'
import { platform } from '@/adapters'
import type { OpenClawConfig } from '@/lib/types'

export default function Config() {
  const [config, setConfig] = useState<OpenClawConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual')

  useEffect(() => {
    loadConfig()
  }, [])

  async function loadConfig() {
    try {
      setLoading(true)
      const cfg = await platform.getConfig()
      setConfig(cfg)
    } catch (err) {
      console.error('Failed to load config:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载中...</div>
  }

  if (!config) {
    return <div className="text-red-500">无法加载配置</div>
  }

  const gateway = config.gateway || {}
  const agents = config.agents || {}
  const defaults = agents.defaults || {}

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button 
          onClick={() => setViewMode('visual')}
          className={`px-4 py-2 rounded ${viewMode === 'visual' ? 'bg-primary text-white' : 'border border-border hover:bg-accent'}`}
        >
          可视化编辑
        </button>
        <button 
          onClick={() => setViewMode('json')}
          className={`px-4 py-2 rounded ${viewMode === 'json' ? 'bg-primary text-white' : 'border border-border hover:bg-accent'}`}
        >
          JSON 编辑器
        </button>
      </div>

      {viewMode === 'visual' ? (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          {/* 网关配置 */}
          <details open>
            <summary className="font-medium cursor-pointer">▼ 网关 (Gateway)</summary>
            <div className="mt-3 space-y-3 pl-4">
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm text-muted-foreground">端口:</label>
                <input 
                  type="number" 
                  value={gateway.port || 18789} 
                  className="px-3 py-1.5 bg-muted rounded border border-border w-32" 
                  readOnly 
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm text-muted-foreground">模式:</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={gateway.mode === 'local'} readOnly />
                    <span className="text-sm">本地</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" checked={gateway.mode === 'remote'} readOnly />
                    <span className="text-sm">远程</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm text-muted-foreground">绑定:</label>
                <select className="px-3 py-1.5 bg-muted rounded border border-border" disabled>
                  <option selected={gateway.bind === 'loopback'}>Loopback</option>
                  <option selected={gateway.bind === 'lan'}>LAN</option>
                  <option selected={gateway.bind === 'tailnet'}>Tailscale</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm text-muted-foreground">认证模式:</label>
                <select className="px-3 py-1.5 bg-muted rounded border border-border" disabled>
                  <option selected={gateway.auth?.mode === 'token'}>Token</option>
                  <option selected={gateway.auth?.mode === 'password'}>Password</option>
                  <option selected={gateway.auth?.mode === 'none'}>None</option>
                </select>
              </div>
            </div>
          </details>

          {/* 代理默认设置 */}
          <details open>
            <summary className="font-medium cursor-pointer">▼ 代理默认设置 (Agents Defaults)</summary>
            <div className="mt-3 space-y-3 pl-4">
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm text-muted-foreground">默认模型:</label>
                <input 
                  type="text" 
                  value={defaults.model?.primary || ''} 
                  className="px-3 py-1.5 bg-muted rounded border border-border flex-1" 
                  readOnly 
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm text-muted-foreground">最大并发:</label>
                <input 
                  type="number" 
                  value={defaults.maxConcurrent || 4} 
                  className="px-3 py-1.5 bg-muted rounded border border-border w-32" 
                  readOnly 
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-24 text-sm text-muted-foreground">工作区:</label>
                <input 
                  type="text" 
                  value={defaults.workspace || ''} 
                  className="flex-1 px-3 py-1.5 bg-muted rounded border border-border font-mono text-sm" 
                  readOnly 
                />
              </div>
            </div>
          </details>

          {/* 通道配置 */}
          <details>
            <summary className="font-medium cursor-pointer">▶ 通道 (Channels)</summary>
            <div className="mt-3 pl-4 text-sm text-muted-foreground">
              {config.channels ? Object.keys(config.channels).join(', ') : '无配置'}
            </div>
          </details>

          {/* 模型配置 */}
          <details>
            <summary className="font-medium cursor-pointer">▶ 模型 (Models)</summary>
            <div className="mt-3 pl-4 text-sm text-muted-foreground">
              {config.models?.providers ? Object.keys(config.models.providers).join(', ') : '无配置'}
            </div>
          </details>

          <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded">
            ⚠️ 当前为只读模式。配置修改功能将在后续版本中提供。
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-4">
          <pre className="text-sm font-mono overflow-auto max-h-[60vh] bg-muted p-4 rounded">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}

      <div className="flex gap-3">
        <button 
          onClick={loadConfig}
          className="px-4 py-2 border border-border rounded hover:bg-accent"
        >
          刷新
        </button>
        <button className="px-4 py-2 border border-border rounded hover:bg-accent">
          导出
        </button>
      </div>
    </div>
  )
}
