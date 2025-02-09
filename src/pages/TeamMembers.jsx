import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import styles from '../styles/modules/team.module.css';

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'editor'
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
      alert('Error loading team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('team_members')
        .insert([{
          ...newMember,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      await loadTeamMembers();
      setNewMember({ name: '', email: '', role: 'editor' });
      alert('Team member added successfully!');
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Error adding team member');
    }
  };

  const removeMember = async (id) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadTeamMembers();
    } catch (error) {
      console.error('Error removing team member:', error);
      alert('Error removing team member');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.teamMembers}>
      <div className={styles.addMemberSection}>
        <h2>Add Team Member</h2>
        <form onSubmit={handleAddMember} className={styles.addMemberForm}>
          <div className={styles.formGroup}>
            <label>Name</label>
            <input
              type="text"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={newMember.email}
              onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Role</label>
            <select
              value={newMember.role}
              onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <button type="submit" className={styles.addButton}>
            Add Team Member
          </button>
        </form>
      </div>

      <div className={styles.membersList}>
        <h2>Team Members</h2>
        <table className={styles.membersTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>{new Date(member.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeMember(member.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamMembers;
