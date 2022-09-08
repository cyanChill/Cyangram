# NextJS Instagram Clone

An implementation of Instagram utilizing NextJS - a React framework.

Live Demonstration: https://cyangram.vercel.app/ 

## Project Info

More about the project can be found at: https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/javascript-final-project

## Internal Documentation:

### User Input Constraints

| Category | Input Type  | Min Length | Max Length | Others Constraints                              |
| -------- | ----------- | ---------- | ---------- | ----------------------------------------------- |
| Profile  | Name        | 8          | 30         | Only letters, numbers, underscores, and periods |
|          | Username    | 8          | 30         | Only letters, numbers, underscores, and periods |
|          | Bio         | -          | 200        | Can't start & end with whitespace               |
| Account  | Password    | 6          | -          | Can't start & end with whitespace               |
| Post     | Description | -          | 200        | Can't start & end with whitespace               |
|          | Comment     | -          | 200        | Can't start & end with whitespace               |
| Messages | Message     | -          | 200        | Can't start & end with whitespace               |
| Images   | Image       | -          | 5MB        | Configurable in the environment variables.      |

### Admin Panel

When logged in as **the admin** user, going to `<site url>/admin` url will bring up the admin panel page. There, you can delete a user, post, or comment from knowing its id.

> **It's important to make sure you set the `ADMIN_ID` environment variable to the user that will have admin privileges.**

> The admin account will function like a normal account as well.

## Features

This utilizes NextJS which allows us to do both the back and frontend in the same project. The backend is done through the `/api` page routes. I utilized MongoDB for the general storage of everything and Firebase for image storage.

> **Currently, we limit the use of the app to authenticated users (ie: users with an account).**

> We also utilize **reCaptcha V3** to verify signup requests.

### Messaging

- "Realtime" Messaging — to prevent pinging our backend too much, we have it update every 30 seconds (this can be changed in `components/pageLayouts/messagingPages/conversation.js` file by changing the `REFRESH_TIME_MS` varaible).

### User Profile

- Edit profile (Profile Picture, Username, Name, Password, Bio, Delete Account)
- Follow/Unfollow People

### Posts

- Home feed with option to show posts from those we follow or a discover feed
- Create/delete posts
- Like & comment on posts
- Get sharable link for posts

### Search

- You can search for other users!

### Themes & Layout

- Supports Light/Dark Modes
- Mobile-friendly

# Installation & Setup

## Environment Variables

> Look in the `ENVFileInfo.md` file for more information.

# Running the App Locally

To run the app locally, run `npm run dev`;
