"use client";

import { useEffect, useState } from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
      setUsers(data.data || []);
      setMessage(`已加载 ${data.data?.length ?? 0} 位用户`);
    } catch {
      setMessage("加载用户失败");
    } finally {
      setLoading(false);
    }
  }

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setMessage("请输入姓名和邮箱");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Create failed");
      setName("");
      setEmail("");
      await fetchUsers();
      setMessage("用户创建成功");
    } catch {
      setMessage("创建用户失败");
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: string) {
    if (!editName.trim() || !editEmail.trim()) {
      setMessage("请输入姓名和邮箱");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");
      setEditingId(null);
      setEditName("");
      setEditEmail("");
      await fetchUsers();
      setMessage("用户更新成功");
    } catch {
      setMessage("更新用户失败");
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");
      await fetchUsers();
      setMessage("用户删除成功");
    } catch {
      setMessage("删除用户失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUsers();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* 顶部导航栏 */}
      <header style={{ 
        background: 'var(--mi-white)', 
        borderBottom: '1px solid var(--mi-border)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* 小米 Logo 样式 */}
              <div style={{
                width: '40px',
                height: '40px',
                background: 'var(--mi-orange)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>
                MI
              </div>
              <div>
                <h1 className="mi-page-title" style={{ fontSize: '20px' }}>用户管理系统</h1>
                <p className="mi-page-subtitle" style={{ fontSize: '12px', marginTop: '2px' }}>Law Console</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span style={{ color: 'var(--mi-text-tertiary)', fontSize: '14px' }}>
                {loading ? '加载中...' : message}
              </span>
              <button
                onClick={() => void fetchUsers()}
                disabled={loading}
                className="mi-btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                刷新
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* 左侧：创建用户 */}
          <div className="mi-card" style={{ padding: '24px', height: 'fit-content' }}>
            <div className="flex items-center gap-2 mb-6">
              <div style={{
                width: '32px',
                height: '32px',
                background: 'rgba(255, 105, 0, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--mi-orange)',
                fontSize: '16px'
              }}>
                +
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--mi-text-primary)' }}>
                新建用户
              </h2>
            </div>
            
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  color: 'var(--mi-text-secondary)', 
                  marginBottom: '8px' 
                }}>
                  姓名
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入用户姓名"
                  className="mi-input"
                />
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  color: 'var(--mi-text-secondary)', 
                  marginBottom: '8px' 
                }}>
                  邮箱
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱地址"
                  className="mi-input"
                  type="email"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="mi-btn-primary w-full"
                style={{ marginTop: '8px' }}
              >
                {loading ? '保存中...' : '创建用户'}
              </button>
            </form>
          </div>

          {/* 右侧：用户列表 */}
          <div className="mi-card" style={{ padding: '24px' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 105, 0, 0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--mi-orange)',
                  fontSize: '16px'
                }}>
                  👥
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--mi-text-primary)' }}>
                  用户列表
                </h2>
              </div>
              <span className="mi-tag">
                共 {users.length} 人
              </span>
            </div>

            <div className="space-y-3" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {users.length === 0 ? (
                <div className="mi-empty">
                  <div className="mi-empty-icon">📋</div>
                  <p style={{ fontSize: '14px' }}>暂无用户数据</p>
                  <p style={{ fontSize: '12px', marginTop: '8px' }}>请在左侧创建第一个用户</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="mi-list-item"
                  >
                    {editingId === user._id ? (
                      <div className="space-y-3">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="mi-input"
                          placeholder="姓名"
                        />
                        <input
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="mi-input"
                          placeholder="邮箱"
                          type="email"
                        />
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => void updateUser(user._id)}
                            disabled={loading}
                            className="mi-btn-primary"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            保存
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditName("");
                              setEditEmail("");
                            }}
                            disabled={loading}
                            className="mi-btn-secondary"
                            style={{ padding: '8px 16px', fontSize: '13px' }}
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* 用户头像 */}
                          <div style={{
                            width: '44px',
                            height: '44px',
                            background: 'linear-gradient(135deg, var(--mi-orange), #ff8533)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: '500'
                          }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ 
                              fontSize: '15px', 
                              fontWeight: '500', 
                              color: 'var(--mi-text-primary)' 
                            }}>
                              {user.name}
                            </p>
                            <p style={{ 
                              fontSize: '13px', 
                              color: 'var(--mi-text-secondary)', 
                              marginTop: '2px' 
                            }}>
                              {user.email}
                            </p>
                            <p style={{ 
                              fontSize: '12px', 
                              color: 'var(--mi-text-tertiary)', 
                              marginTop: '4px' 
                            }}>
                              创建于 {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(user._id);
                              setEditName(user.name);
                              setEditEmail(user.email);
                            }}
                            disabled={loading}
                            className="mi-action-btn mi-action-btn-edit"
                          >
                            编辑
                          </button>
                          <button
                            type="button"
                            onClick={() => void deleteUser(user._id)}
                            disabled={loading}
                            className="mi-action-btn mi-action-btn-delete"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 底部 */}
      <footer style={{ 
        borderTop: '1px solid var(--mi-border)', 
        marginTop: 'auto',
        padding: '24px 0',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '13px', color: 'var(--mi-text-tertiary)' }}>
          Next.js + MongoDB · 小米风格设计
        </p>
      </footer>
    </div>
  );
}
