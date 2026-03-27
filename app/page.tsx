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
  const [message, setMessage] = useState("Ready");

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
      setUsers(data.data || []);
      setMessage(`Loaded ${data.data?.length ?? 0} users`);
    } catch {
      setMessage("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function createUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setMessage("Name and email are required");
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
      setMessage("User created successfully");
    } catch {
      setMessage("Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  async function updateUser(id: string) {
    if (!editName.trim() || !editEmail.trim()) {
      setMessage("Name and email are required");
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
      setMessage("User updated successfully");
    } catch {
      setMessage("Failed to update user");
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
      setMessage("User deleted successfully");
    } catch {
      setMessage("Failed to delete user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchUsers();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.24),transparent_30%),radial-gradient(circle_at_60%_85%,rgba(16,185,129,0.2),transparent_30%)]" />
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 animate-pulse rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-28 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl float-slow" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="glass-card rounded-3xl p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-cyan-300">Next.js + MongoDB</p>
          <h1 className="text-3xl font-semibold sm:text-5xl">
            Law Console
            <span className="ml-3 bg-gradient-to-r from-cyan-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
              Neon Dashboard
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            A sleek front page connected to your local MongoDB API. Create users instantly and inspect real-time records.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="glass-card rounded-3xl p-6">
            <h2 className="mb-4 text-xl font-medium">Quick Create</h2>
            <form onSubmit={createUser} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-cyan-300"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 outline-none transition focus:border-cyan-300"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 font-medium text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => void fetchUsers()}
                  disabled={loading}
                  className="cursor-pointer rounded-xl border border-slate-600 px-5 py-2.5 transition hover:border-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Refresh
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm text-slate-300">{message}</p>
          </div>

          <div className="glass-card rounded-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-medium">Users</h2>
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                {users.length} records
              </span>
            </div>

            <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
              {users.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-700 p-5 text-sm text-slate-400">
                  No data yet. Create your first user on the left.
                </p>
              ) : (
                users.map((user) => (
                  <article
                    key={user._id}
                    className="rounded-xl border border-slate-700/80 bg-slate-900/50 p-4 transition hover:border-cyan-400/60"
                  >
                    {editingId === user._id ? (
                      <div className="space-y-3">
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none transition focus:border-cyan-300"
                        />
                        <input
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none transition focus:border-cyan-300"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => void updateUser(user._id)}
                            disabled={loading}
                            className="rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-medium text-slate-950 disabled:opacity-60"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditName("");
                              setEditEmail("");
                            }}
                            disabled={loading}
                            className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-slate-100">{user.name}</p>
                          <p className="text-sm text-slate-300">{user.email}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-slate-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(user._id);
                                setEditName(user.name);
                                setEditEmail(user.email);
                              }}
                              disabled={loading}
                              className="rounded-lg border border-cyan-400/50 px-2.5 py-1 text-xs text-cyan-200 disabled:opacity-60"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteUser(user._id)}
                              disabled={loading}
                              className="rounded-lg border border-rose-400/50 px-2.5 py-1 text-xs text-rose-200 disabled:opacity-60"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
