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

/*
  Get from server list of users this person is following
    - If the person viewing this is logged in, get the list of people
    they're following as well
      - Then, if they're mutually following, put those groups of people at the top of the list without the "following" button
    - If the person viewing this is the owner of this follow list, don't show
    the follow button


    Essentially, return 2 arrays, 1 with objects of people we've "mutually" 
    followed, and another list where we haven't followed
*/

/* 
  - Mutual Followers are those we have in common
  - Acquaintances Followers are followers the person have that we don't have
*/
export const getServerSideProps = async (context) => {
  /* 
    Returns array of objects containing:
      - Username
      - Name
      - Profile Picture
      - UserId
  */
  const DUMMY_MUTUAL = [
    {
      userId: "u1",
      username: "DevonGibson",
      name: "Devon Gibson",
      profileImg: "https://randomuser.me/api/portraits/men/29.jpg",
    },
    {
      userId: "u2",
      username: "VernonMccoy",
      name: "Vernon Mccoy",
      profileImg: "https://randomuser.me/api/portraits/men/96.jpg",
    },
    {
      userId: "u3",
      username: "EleanorHoffman",
      name: "Eleanor Hoffman",
      profileImg: "https://randomuser.me/api/portraits/women/89.jpg",
    },
    {
      userId: "u4",
      username: "BobbieRodriquez",
      name: "Bobbie Rodriquez",
      profileImg: "https://randomuser.me/api/portraits/women/37.jpg",
    },
  ];
  const DUMMY_ACQUAINTANCES = [
    {
      userId: "u5",
      username: "RobertaRyan",
      name: "Roberta Ryan",
      profileImg: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
      userId: "u6",
      username: "AmeliaGregory",
      name: "Amelia Gregory",
      profileImg: "https://randomuser.me/api/portraits/women/63.jpg",
    },
    {
      userId: "u7",
      username: "LeroyKuhn",
      name: "Leroy Kuhn 55555555555555555555555555555555",
      profileImg: "https://randomuser.me/api/portraits/men/98.jpg",
    },
    {
      userId: "u8",
      username: "ToniStanley5555555555555555555555555555555555",
      name: "Toni Stanley",
      profileImg: "https://randomuser.me/api/portraits/women/10.jpg",
    },
  ];

  // Keep for final product (fix what's assigned though)
  const fetchedMutual = DUMMY_MUTUAL;
  const fetchedAcquaintances = DUMMY_ACQUAINTANCES;

  return {
    props: { mutual: fetchedMutual, acquaintances: fetchedAcquaintances },
  };
};
