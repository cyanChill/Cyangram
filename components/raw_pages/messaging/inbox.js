import { useRouter } from "next/router";

import LoadImage from "../../ui/loadimage/loadimage";
import Card from "../../ui/card/card";
import classes from "./inbox.module.css";

const InboxPage = ({ conversationUsers }) => {
  const router = useRouter();

  return (
    <div className={classes.wrapper}>
      <Card shadow className={classes.cardStyles}>
        {!conversationUsers ? (
          <div className="center">You have no conversations currently.</div>
        ) : (
          <div className={classes.conversationList}>
            {conversationUsers.map((user) => (
              <div
                key={user._id}
                className={classes.userWrapper}
                onClick={() => router.push(`/t/${user._id}`)}
              >
                <div className={classes.img}>
                  <LoadImage
                    src={user.profilePic.url}
                    alt={`${user.name}'s Profile Picture`}
                    width="500"
                    height="500"
                    layout="responsive"
                    className={classes.rounded}
                  />
                </div>

                <div className={classes.userInfo}>
                  <p>{user.name}</p>
                  <p>@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default InboxPage;
