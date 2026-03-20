import { useEffect, useState } from 'react'

interface Skill {
  slug: string
  name: string
  description: string
  version: string
  installed: boolean
  hasUpdate: boolean
}

export default function Skills() {
  const [installedSkills, setInstalledSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'installed' | 'market'>('installed')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadSkills()
  }, [])

  async function loadSkills() {
    try {
      setLoading(true)
      // 模拟数据（实际需要调用 clawhub CLI）
      const skills: Skill[] = [
        { slug: 'feishu-doc', name: 'feishu-doc', description: '飞书文档读写操作', version: 'v2026.3.7', installed: true, hasUpdate: false },
        { slug: 'weather', name: 'weather', description: '获取天气和预报', version: 'v1.2.0', installed: true, hasUpdate: false },
        { slug: 'coding-agent', name: 'coding-agent', description: '委托编程任务给 AI 代理', version: 'v2.1.0', installed: true, hasUpdate: true },
        { slug: 'skill-creator', name: 'skill-creator', description: '创建和编辑 AgentSkills', version: 'v1.0.0', installed: true, hasUpdate: false },
        { slug: 'healthcheck', name: 'healthcheck', description: '系统安全加固和检查', version: 'v1.5.0', installed: true, hasUpdate: false },
        { slug: 'mcporter', name: 'mcporter', description: 'MCP 服务器管理工具', version: 'v0.8.0', installed: true, hasUpdate: true },
      ]
      setInstalledSkills(skills)
    } catch (err) {
      console.error('Failed to load skills:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredSkills = installedSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updateCount = installedSkills.filter(s => s.hasUpdate).length

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载中...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button 
          onClick={() => setView('installed')}
          className={`px-4 py-2 rounded ${view === 'installed' ? 'bg-primary text-white' : 'border border-border hover:bg-accent'}`}
        >
          已安装
        </button>
        <button 
          onClick={() => setView('market')}
          className={`px-4 py-2 rounded ${view === 'market' ? 'bg-primary text-white' : 'border border-border hover:bg-accent'}`}
        >
          浏览市场
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 搜索技能..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 bg-muted rounded border border-border"
      />

      {view === 'installed' ? (
        <>
          <h3 className="font-medium">已安装 ({filteredSkills.length})</h3>

          <div className="space-y-3">
            {filteredSkills.map((skill) => (
              <div key={skill.slug} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">⚡ {skill.name}</span>
                    <span className="text-sm text-muted-foreground">{skill.version}</span>
                    {skill.hasUpdate && (
                      <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">⬆️ 更新</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
                </div>
                <div className="flex gap-2">
                  {skill.hasUpdate ? (
                    <button className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary/90">
                      更新
                    </button>
                  ) : (
                    <span className="text-sm text-muted-foreground px-3 py-1.5">✓ 最新</span>
                  )}
                  <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent">
                    详情
                  </button>
                  <button className="px-3 py-1.5 text-sm border border-border rounded hover:bg-accent text-red-500">
                    卸载
                  </button>
                </div>
              </div>
            ))}
          </div>

          {updateCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">可更新 ({updateCount})</span>
              <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
                全部更新
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          <p className="text-muted-foreground">
            技能市场需要调用 clawhub CLI，请使用终端访问：
          </p>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm">
            <p className="text-muted-foreground mb-2"># 浏览市场</p>
            <p>clawhub explore</p>
            <p className="text-muted-foreground mt-4 mb-2"># 搜索技能</p>
            <p>clawhub search {"<查询>"}</p>
            <p className="text-muted-foreground mt-4 mb-2"># 安装技能</p>
            <p>clawhub install {"<slug>"}</p>
          </div>
          <a 
            href="https://clawhub.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            访问 ClawHub 在线市场 →
          </a>
        </div>
      )}
    </div>
  )
}
