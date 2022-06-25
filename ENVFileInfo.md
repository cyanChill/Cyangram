# Information About Environment Variables

We use the following environment variables:

| Variable Name                             | Value                                                                                                                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MONGODB_URI                               | The link to your MongoDB database.                                                                                                                                                  |
| NEXTAUTH_URL                              | The URL of the site this will be hosted on (required for Next-Auth for authentication).                                                                                             |
| NEXTAUTH_SECRET                           | Used to encrypt the JWT for NextAuth.                                                                                                                                               |
| FIREBASE_ADMIN_PRIVATE_KEY                | Follow the following steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to get the JSON file with our key and paste the key's value here.                    |
| FIREBASE_ADMIN_CLIENT_EMAIL               | Can be obtained from the step above.                                                                                                                                                |
| NEXT_PUBLIC_FIREBASE_API_KEY              | The firebase public api key that can be obtained from the firebase config object.                                                                                                   |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN          | Can be obtained from the firebase config object.                                                                                                                                    |
| NEXT_PUBLIC_FIREBASE_PROJECTID            | Can be obtained from the firebase config object.                                                                                                                                    |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET       | Can be obtained from the firebase config object.                                                                                                                                    |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDERID   | Can be obtained from the firebase config object.                                                                                                                                    |
| NEXT_PUBLIC_FIREBASE_APPID                | Can be obtained from the firebase config object.                                                                                                                                    |
| NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY   | Follow the following steps [here](https://firebase.google.com/docs/app-check/web/recaptcha-provider) to get the reCAPTCHA v3 Site Key for making sure requests come from your site. |
| NEXT_PUBLIC_BASE_URL                      | The URL of the site this will be hosted on (make sure it doesn't end with a `/`).                                                                                                   |
| NEXT_PUBLIC_DEFAULT_PROFILEPIC_URL        | URL of default profile picture used from Firebase storage.                                                                                                                          |
| NEXT_PUBLIC_DEFAULT_PROFILEPIC_IDENTIFIER | Name of the default profile picture file.                                                                                                                                           |
| ADMIN_ID                                  | Set this value to the id of the user we want to assign the admin role.                                                                                                              |
