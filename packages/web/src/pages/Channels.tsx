import { useEffect, useState } from 'react'
import { platform } from '@/adapters'
import type { OpenClawConfig } from '@/lib/types'

export default function Channels() {
  const [config, setConfig] = useState<OpenClawConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const cfg = await platform.getConfig()
      setConfig(cfg)
    } catch (err) {
      console.error('Failed to load channels:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载中...</div>
  }

  const channels = config?.channels || {}

  // 通道类型定义
  const channelTypes = [
    { id: 'feishu', name: '飞书', icon: '📌', description: 'Lark/Feishu 机器人' },
    { id: 'telegram', name: 'Telegram', icon: '✈️', description: 'Telegram Bot API' },
    { id: 'discord', name: 'Discord', icon: '💬', description: 'Discord Bot' },
    { id: 'whatsapp', name: 'WhatsApp', icon: '📱', description: 'WhatsApp Web API' },
    { id: 'signal', name: 'Signal', icon: '🔐', description: 'Signal CLI' },
    { id: 'slack', name: 'Slack', icon: '💼', description: 'Slack App' },
  ]

  // 获取已配置的通道
  function getConfiguredChannels() {
    const result: Array<{ type: string; typeName: string; icon: string; accounts: any[]; enabled: boolean }> = []
    
    for (const [type, ch] of Object.entries(channels)) {
      const typeInfo = channelTypes.find(t => t.id === type) || { name: type, icon: '📡' }
      const chData = ch as any
      
      if (chData.accounts) {
        const accounts = Object.entries(chData.accounts).map(([id, acc]: [string, any]) => ({
          id,
          ...acc
        }))
        result.push({
          type,
          typeName: typeInfo.name,
          icon: typeInfo.icon,
          accounts,
          enabled: chData.enabled !== false
        })
      }
    }
    
    return result
  }

  const configuredChannels = getConfiguredChannels()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">通道管理</h1>
        <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
          + 添加通道
        </button>
      </div>

      {/* 已配置的通道 */}
      {configuredChannels.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">已配置</h3>
          {configuredChannels.map((ch) => (
            <div key={ch.type} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{ch.icon}</span>
                  <span className="font-medium">{ch.typeName}</span>
                  <span className={`w-2 h-2 rounded-full ${ch.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent">
                    配置
                  </button>
                </div>
              </div>
              
              {/* 账号列表 */}
              <div className="space-y-2">
                {ch.accounts.map((acc: any) => (
                  <div key={acc.id} className="flex items-center justify-between pl-6 py-1.5 border-l-2 border-border">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${acc.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      <span className="text-sm font-medium">{acc.name || acc.id}</span>
                      {acc.groupPolicy === 'disabled' && (
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded">群聊已禁用</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-2 py-1 text-xs border border-border rounded hover:bg-accent">
                        编辑
                      </button>
                      <button className="px-2 py-1 text-xs border border-border rounded hover:bg-accent text-red-500">
                        移除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 可添加的通道 */}
      <div className="space-y-3">
        <h3 className="font-medium">添加新通道</h3>
        {channelTypes
          .filter(type => !channels[type.id])
          .map((type) => (
            <div key={type.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{type.icon}</span>
                <div>
                  <span className="font-medium">{type.name}</span>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary/90">
                设置
              </button>
            </div>
          ))}
        
        {channelTypes.filter(type => !channels[type.id]).length === 0 && (
          <p className="text-sm text-muted-foreground">所有通道类型已配置</p>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        💡 通道配置需要编辑配置文件或使用 CLI 命令，请前往「配置」页面或使用终端
      </div>
    </div>
  )
}
