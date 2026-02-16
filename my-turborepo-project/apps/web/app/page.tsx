'use client';

import { useEffect, useState } from 'react';

const api = {
  users: {
    getAll: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      return res.json();
    },
    create: async (userData: { name: string; email: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return res.json();
    },
  },
};

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.users.getAll().then(setUsers);
  }, []);

  const handleCreate = async () => {
    if (!name || !email) return;
    
    setLoading(true);
    try {
      await api.users.create({ name, email });
      setName('');
      setEmail('');
      const updated = await api.users.getAll();
      setUsers(updated);
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 mr-2"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Creating...' : 'Add User'}
        </button>
      </div>

      <ul>
        {users.map((user) => (
          <li key={user._id} className="mb-2 p-2 border rounded">
            <span className="font-medium">{user.name}</span> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
