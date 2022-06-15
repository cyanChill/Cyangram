import { getSession } from "next-auth/react";

import UserList from "../../components/users/userlist/userlist";
import BackHeader from "../../components/ui/backheader/backHeader";

const UserFollowers = ({ mutual, acquaintances }) => {
  return (
    <div>
      <BackHeader text="Followers" />
      <UserList shared={mutual} notShared={acquaintances} />
    </div>
  );
};

export default UserFollowers;

export const getServerSideProps = async (context) => {
  const username = context.query.username;
  const session = await getSession({ req: context.req });
  if (!session) {
    return { redirect: { destination: "/accounts/login" } };
  }

  /* Get the list of people following the person we're viewing */
  const req = await fetch(
    `${process.env.NEXTAUTH_URL}api/users/${username}/followers`
  );
  const data = await req.json();

  /* Get the list of people we are following */
  const req2 = await fetch(
    `${process.env.NEXTAUTH_URL}api/users/${session.user.username}/following`
  );
  const data2 = await req2.json();

  /* 
    - Mutual Followers are those we have in common
    - Acquaintances Followers are followers the person have that we don't have
  */
  const fetchedMutual = [];
  const fetchedAcquaintances = [];

  data.users.forEach((user) => {
    if (
      data2.users.some(
        (user2) => user._id === user2._id || user._id === session.user.dbId
      )
    ) {
      fetchedMutual.push(user);
    } else {
      fetchedAcquaintances.push(user);
    }
  });

  return {
    props: { mutual: fetchedMutual, acquaintances: fetchedAcquaintances },
  };
};
