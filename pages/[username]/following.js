import UserList from "../../components/users/userlist/userlist";
import BackHeader from "../../components/ui/backheader/backHeader";

const UserFollowing = ({ mutual, acquaintances }) => {
  return (
    <div>
      <BackHeader text="Following" />
      <UserList shared={mutual} notShared={acquaintances} />
    </div>
  );
};

export default UserFollowing;

/* 
  Practically the same implementation as "followers.js"
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
      username: "BradWagner",
      name: "Brad Wagner",
      profileImg: "https://randomuser.me/api/portraits/men/16.jpg",
    },
    {
      userId: "u2",
      username: "GloriaKnight",
      name: "Gloria Knight",
      profileImg: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      userId: "u3",
      username: "WillardDunn",
      name: "Willard Dunn",
      profileImg: "https://randomuser.me/api/portraits/men/79.jpg",
    },
    {
      userId: "u4",
      username: "SerenityHicks",
      name: "Serenity Hicks",
      profileImg: "https://randomuser.me/api/portraits/women/42.jpg",
    },
  ];
  const DUMMY_ACQUAINTANCES = [
    {
      userId: "u5",
      username: "JoshuaDavis",
      name: "Joshua Davis",
      profileImg: "https://randomuser.me/api/portraits/men/58.jpg",
    },
    {
      userId: "u6",
      username: "RebeccaBaker",
      name: "Rebecca Baker",
      profileImg: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    {
      userId: "u7",
      username: "LeroyKuhn",
      name: "LeroyKuhn 55555555555555555555555555555555",
      profileImg: "https://randomuser.me/api/portraits/men/98.jpg",
    },
    {
      userId: "u8",
      username: "ToniStanley5555555555555555555555555555555555",
      name: "ToniStanley",
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
