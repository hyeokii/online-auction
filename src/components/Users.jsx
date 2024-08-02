import { useState, useEffect } from "react";
import useStore from "../store";
const Users = () => {
  // 상태 가져오기
  const users = useStore((state) => state.users);

  // 액션 가져오기
  const fetchUsers = useStore((state) => state.fetchUsers);

  const addUser = useStore((state) => state.addUser);
  const removeUser = useStore((state) => state.removeUser);

  // 입력 상태
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.email})
            <button onClick={() => removeUser(user.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
        placeholder="Password"
      />
      <button
        onClick={() => {
          addUser({
            id: Date.now(),
            username: userName,
            email: userEmail,
            password: userPassword,
            created_date: new Date().toISOString(),
            updated_date: new Date().toISOString(),
          });
          setUserName("");
          setUserEmail("");
          setUserPassword("");
        }}
      >
        Add User
      </button>
    </div>
  );
};

export default Users;
