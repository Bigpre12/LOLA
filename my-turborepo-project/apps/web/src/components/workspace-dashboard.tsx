'use client';

import { useState, useEffect } from 'react';

const api = {
  workspaces: {
    getUserWorkspaces: async (userId: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/user/${userId}`);
      return res.json();
    },
    createWorkspace: async (name: string, ownerId: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, ownerId }),
      });
      return res.json();
    },
    inviteMember: async (workspaceId: string, email: string, role: string, invitedBy: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, invitedBy }),
      });
      return res.json();
    },
    getWorkspaceMembers: async (workspaceId: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workspaces/${workspaceId}/members`);
      return res.json();
    },
  },
};

export default function WorkspaceDashboard() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    // TODO: Get actual user ID from auth
    const userId = 'user-placeholder';
    const userWorkspaces = await api.workspaces.getUserWorkspaces(userId);
    setWorkspaces(userWorkspaces);
    if (userWorkspaces.length > 0) {
      setSelectedWorkspace(userWorkspaces[0]);
      loadMembers(userWorkspaces[0]._id);
    }
  };

  const loadMembers = async (workspaceId: string) => {
    const workspaceMembers = await api.workspaces.getWorkspaceMembers(workspaceId);
    setMembers(workspaceMembers);
  };

  const createWorkspace = async (name: string) => {
    // TODO: Get actual user ID from auth
    const userId = 'user-placeholder';
    const newWorkspace = await api.workspaces.createWorkspace(name, userId);
    setWorkspaces([...workspaces, newWorkspace]);
  };

  const inviteMember = async (email: string, role: string) => {
    // TODO: Get actual user ID from auth
    const invitedBy = 'user-placeholder';
    await api.workspaces.inviteMember(selectedWorkspace._id, email, role, invitedBy);
    loadMembers(selectedWorkspace._id);
    setShowInviteModal(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workspace</h1>
        <button
          onClick={() => createWorkspace('New Workspace')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Workspace
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Workspaces</h2>
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <div
                key={workspace._id}
                onClick={() => {
                  setSelectedWorkspace(workspace);
                  loadMembers(workspace._id);
                }}
                className={`p-3 rounded cursor-pointer ${
                  selectedWorkspace?._id === workspace._id
                    ? 'bg-blue-100 border-blue-500'
                    : 'bg-gray-50'
                }`}
              >
                <div className="font-medium">{workspace.name}</div>
                <div className="text-sm text-gray-600 capitalize">{workspace.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          {selectedWorkspace && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedWorkspace.name}</h2>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Invite Member
                </button>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member._id} className="flex justify-between items-center p-3 border rounded">
                        <div>
                          <div className="font-medium">{member.userId?.name || 'User'}</div>
                          <div className="text-sm text-gray-600">{member.userId?.email || 'email@example.com'}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                            {member.role}
                          </span>
                          {member.role !== 'owner' && (
                            <button className="text-red-500 hover:text-red-700">
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          onInvite={inviteMember}
        />
      )}
    </div>
  );
}

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (email: string, role: string) => void }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(email, role);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Send Invite
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
