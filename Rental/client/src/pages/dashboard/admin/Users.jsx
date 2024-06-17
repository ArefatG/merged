import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaTrashAlt, FaUser, FaUsers } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Users = () => {
    const axiosSecure = useAxiosSecure();
    const { refetch, data: users = [] } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    const handleMakeAdmin = (user) => {
        axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
            alert(`${user.name} is now an admin`);
            refetch();
        });
    };

    const handleApproveUser = (user) => {
        axiosSecure.patch(`/users/approve/${user._id}`).then((res) => {
            alert(`${user.name} is approved`);
            refetch();
        });
    };

    const handleDisapproveUser = (user) => {
        axiosSecure.patch(`/users/disapprove/${user._id}`).then((res) => {
            alert(`${user.name} is disapproved`);
            refetch();
        });
    };

    const handleDeleteUser = (user) => {
        axiosSecure.delete(`/users/${user._id}`).then((res) => {
            alert(`${user.name} is removed from the database`);
            refetch();
        });
    };

    return (
        <div className="container mx-auto my-10">
            <div className="flex items-center justify-between m-4">
                <h5 className="text-lg font-bold">All Users</h5>
                <h5 className="text-lg font-bold">Total Users: {users.length}</h5>
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead className="bg-deepblue text-white">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>License</th>
                            <th>Approval</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.role === 'admin' ? (
                                        'Admin'
                                    ) : (
                                        <button
                                            onClick={() => handleMakeAdmin(user)}
                                            className="btn btn-xs btn-outline btn-primary"
                                        >
                                            <FaUsers /> Make Admin
                                        </button>
                                    )}
                                </td>
                                <td>
                                    {user.license ? (
                                        <a href={user.license} target="_blank" rel="noopener noreferrer" className="btn btn-xs btn-outline btn-secondary">
                                            View License
                                        </a>
                                    ) : 'No License'}
                                </td>
                                <td>
                                    {user.isApproved ? (
                                        <button
                                            onClick={() => handleDisapproveUser(user)}
                                            className="btn btn-xs btn-outline btn-error"
                                        >
                                            Disapprove
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleApproveUser(user)}
                                            className="btn btn-xs btn-outline btn-success"
                                        >
                                            Approve
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="btn btn-xs btn-outline btn-error"
                                    >
                                        <FaTrashAlt /> Delete
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

export default Users;
