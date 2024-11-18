import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { User } from './types/types';
import styles from './style/AdminPanel.module.css';
import { toast } from 'react-toastify';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/api/users/all');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleEditClick = (user: User) => {
        setIsEditing(true);
        setEditedUser(user);
    };

    const handleSaveClick = async () => {
        if (editedUser) {
            try {
                const formData = new FormData();
    
                if (editedUser.username) formData.append('username', editedUser.username);
                if (editedUser.email) formData.append('email', editedUser.email);
                if (editedUser.name) formData.append('name', editedUser.name);
                if (editedUser.surname) formData.append('surname', editedUser.surname);
                if (editedUser.gender) formData.append('gender', editedUser.gender);
                if (editedUser.role) formData.append('role', editedUser.role);
                if (editedUser.dateOfBirth) formData.append('dateOfBirth', editedUser.dateOfBirth.toString());
                if (editedUser.avatarUrl) formData.append('avatar', editedUser.avatarUrl);
    
                const response = await axiosInstance.patch(`/api/users/update/${editedUser.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
    
                toast.success('User updated successfully');
                setUsers(users.map((u) => (u.id === editedUser.id ? response.data : u)));
                setIsEditing(false);
                setEditedUser(null);
            } catch (error) {
                console.error('Error updating user:', error);
                toast.error('Failed to update user');
            }
        }
    };
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
        if (editedUser) {
            setEditedUser({ ...editedUser, [field]: e.target.value });
        }
    };

    return (
        <div className={styles['admin-panel']}>
            <h2>Admin Panel</h2>

            <div className={styles.userCardsContainer}>
                {users.map((user) => (
                    <div className={styles.userCard} key={user.id}>
                        <h3>{user.username}</h3>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Surname:</strong> {user.surname}</p>
                        <p><strong>Gender:</strong> {user.gender}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <button className={styles.editButton} onClick={() => handleEditClick(user)}>Edit</button>
                    </div>
                ))}
            </div>

            <div className={styles.userGridContainer}>
                <div className={styles.userGridHeader}>
                    <div className={styles.gridItem}>Username</div>
                    <div className={styles.gridItem}>Email</div>
                    <div className={styles.gridItem}>Name</div>
                    <div className={styles.gridItem}>Surname</div>
                    <div className={styles.gridItem}>Gender</div>
                    <div className={styles.gridItem}>Role</div>
                    <div className={styles.gridItem}>Action</div>
                </div>
                {users.map((user) => (
                    <div className={styles.userGridRow} key={user.id}>
                        <div className={styles.gridItem}>{user.username}</div>
                        <div className={styles.gridItem}>{user.email}</div>
                        <div className={styles.gridItem}>{user.name}</div>
                        <div className={styles.gridItem}>{user.surname}</div>
                        <div className={styles.gridItem}>{user.gender}</div>
                        <div className={styles.gridItem}>{user.role}</div>
                        <div className={styles.gridItem}>
                            <button className={styles.editButton} onClick={() => handleEditClick(user)}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && editedUser && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h3>Edit User</h3>
                        <div className={styles.field}>
                            <label>Username:</label>
                            <input type="text" value={editedUser.username} onChange={(e) => handleChange(e, 'username')} />
                        </div>
                        <div className={styles.field}>
                            <label>Email:</label>
                            <input type="email" value={editedUser.email} onChange={(e) => handleChange(e, 'email')} />
                        </div>
                        <div className={styles.field}>
                            <label>Name:</label>
                            <input type="text" value={editedUser.name} onChange={(e) => handleChange(e, 'name')} />
                        </div>
                        <div className={styles.field}>
                            <label>Surname:</label>
                            <input type="text" value={editedUser.surname} onChange={(e) => handleChange(e, 'surname')} />
                        </div>
                        <div className={styles.field}>
                            <label>Gender:</label>
                            <select value={editedUser.gender} onChange={(e) => handleChange(e, 'gender')}>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Role:</label>
                            <select value={editedUser.role} onChange={(e) => handleChange(e, 'role')}>
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className={styles['modal-buttons']}>
                            <button onClick={handleSaveClick} className={styles['save-button']}>Save</button>
                            <button onClick={() => setIsEditing(false)} className={styles['cancel-button']}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;