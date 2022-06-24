# NextJS Instagram Clone

An implementation of Instagram utilizing NextJS - a React framework.

Live Demonstration: https://cyanchill-instagram.herokuapp.com/

## Project Info

More about the project can be found at: https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/javascript-final-project

## Internal Documentation:

### User Input Constraints

| Category | Input Type  | Min Length | Max Length | Others Constraints                              |
| -------- | ----------- | ---------- | ---------- | ----------------------------------------------- |
| Profile  | Name        | 3          | 30         | Only letters, numbers, underscores, and periods |
|          | Username    | 3          | 30         | Only letters, numbers, underscores, and periods |
|          | Bio         | -          | 200        | Can't start & end with whitespace               |
| Account  | Password    | 6          | -          | Can't start & end with whitespace               |
| Post     | Description | -          | 200        | Can't start & end with whitespace               |
|          | Comment     | -          | 200        | Can't start & end with whitespace               |
| Messages | Message     | -          | 200        | Can't start & end with whitespace               |
| Images   | Image       | -          | 5MB        | -                                               |

### Environment Variables

> Look in the `ENVFileInfo.md` file for more information.

## Features

This utilizes NextJS which allows us to do both the back and frontend in the same project. The backend is done through the `/api` page routes. I utilized MongoDB for the general storage of everything and Firebase for image storage.

> **Currently, we limit the use of the app to authenticated users (ie: users with an account).**

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
