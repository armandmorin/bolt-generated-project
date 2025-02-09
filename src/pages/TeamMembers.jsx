import React, { useState, useEffect } from 'react';
    import styles from '../styles/modules/team.module.css';

    const TeamMembers = () => {
      const [members, setMembers] = useState(() => {
        return JSON.parse(localStorage.getItem('teamMembers') || '[]');
      });

      const [newMember, setNewMember] = useState({
        name: '',
        email: '',
        role: 'editor'
      });

      const handleAddMember = (e) => {
        e.preventDefault();
        const updatedMembers = [...members, {
          ...newMember,
          id: Date.now(),
          dateAdded: new Date().toISOString()
        }];
        setMembers(updatedMembers);
        localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
        setNewMember({ name: '', email: '', role: 'editor' });
        // Here you would typically send an invitation email
        alert('Team member invited successfully!');
      };

      const removeMember = (id) => {
        const updatedMembers = members.filter(member => member.id !== id);
        setMembers(updatedMembers);
        localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
      };

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
                    <td>{new Date(member.dateAdded).toLocaleDateString()}</td>
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
