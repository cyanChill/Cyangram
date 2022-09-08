# Information About Environment Variables

We use the following environment variables:

| Variable Name | Value |
| ------------- | ----- |
| MONGODB_URI | The link to your MongoDB database. |
| NEXTAUTH_URL | The URL of the site this will be hosted on (required for Next-Auth for authentication). |
| NEXTAUTH_SECRET | Used to encrypt the JWT for NextAuth. |
| FIREBASE_ADMIN_PRIVATE_KEY | Follow the following steps [here](https://firebase.google.com/docs/admin/setup#initialize-sdk) to get the JSON file with our key and paste the key's value here. |
| FIREBASE_ADMIN_CLIENT_EMAIL | Can be obtained from the step above. |
| FIREBASE_ADMIN_PROJECTID | Can be obtained from the firebase config object. |
| FIREBASE_ADMIN_PRIVATE_KEY | Can be obtained from the firebase config object. |
| NEXT_PUBLIC_BASE_URL | The URL of the site this will be hosted on (make sure it doesn't end with a `/`). |
| NEXT_PUBLIC_DEFAULT_PROFILEPIC_URL | URL of default profile picture used from Firebase storage. |
| NEXT_PUBLIC_DEFAULT_PROFILEPIC_IDENTIFIER | Name of the default profile picture file. |
| NEXT_PUBLIC_RECAPTCHA_SITE_KEY | Follow the following steps [here](https://firebase.google.com/docs/app-check/web/recaptcha-provider) to get the **reCAPTCHA V3** Site Key for making sure requests come from your site. |
| RECAPTCHA_SECRET_KEY | Obtained with the site key from above. |
| SITE_HOST_NAME | Host name of your site. |
| ADMIN_ID | Set this value to the id of the user we want to assign the admin role. |
| NEXT_PUBLIC_MAX_IMG_MB | A positive integer value dictating how big of an image users can upload. |
