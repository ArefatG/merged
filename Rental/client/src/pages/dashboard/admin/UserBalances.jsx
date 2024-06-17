import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UsersBalances = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState({});
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem("access-token");

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:6001/users/balances', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users with balances", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleWithdraw = async (userId) => {
    if (!withdrawAmount[userId] || withdrawAmount[userId] <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Please enter a valid amount to withdraw',
      });
      return;
    }

    try {
      await axios.post('http://localhost:6001/users/withdraw', { userId, amount: withdrawAmount[userId] }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Balance withdrawn successfully',
      });
      setWithdrawAmount({});
      fetchUsers();
    } catch (error) {
      console.error("Error withdrawing balance", error);
      Swal.fire({
        icon: 'error',
        title: 'Withdrawal Failed',
        text: 'There was an error withdrawing the balance',
      });
    }
  };

  const handleSort = () => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setFilteredUsers(sortedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const searchResults = users.filter(user =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      user.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(searchResults);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Users & Balances</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          className="input input-bordered w-full max-w-xs"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button onClick={handleSort} className="btn btn-primary">
          Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-deepblue text-white">
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Balance</th>
              <th>Withdraw</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>${user.balance.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    className="input input-bordered w-full max-w-xs"
                    value={withdrawAmount[user._id] || ''}
                    onChange={(e) => setWithdrawAmount({ ...withdrawAmount, [user._id]: e.target.value })}
                    placeholder="Amount"
                  />
                  <button onClick={() => handleWithdraw(user._id)} className="btn bg-deepblue text-white mt-3 ml-2">Withdraw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersBalances;
