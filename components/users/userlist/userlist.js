import User from "./user";

const UserList = ({ shared, notShared, updateFollowCount }) => {
  const sharedUsers = shared.map((user) => (
    <User key={user._id} user={user} updateFollowCount={updateFollowCount} />
  ));

  const notSharedUsers = notShared.map((user) => (
    <User
      key={user._id}
      user={user}
      showActions
      updateFollowCount={updateFollowCount}
    />
  ));

  return (
    <div>
      {sharedUsers}
      {notSharedUsers}
    </div>
  );
};

export default UserList;
