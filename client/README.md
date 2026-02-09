# QuickChat

Real-time chat app with authentication, online presence, and media sharing.

**Features**
- Email/password sign up and login with JWT.
- Real-time 1:1 messaging with Socket.IO.
- Online/offline presence and unread message counts.
- Image sharing with Cloudinary and a media gallery.
- Profile editing (name, bio, avatar).
- User search.

**Tech Stack**
- Frontend: React, Vite, React Router, Tailwind CSS, Axios, Socket.IO client.
- Backend: Node.js, Express, MongoDB/Mongoose, Socket.IO, JWT, Cloudinary.
- Tooling: ESLint, Nodemon.

**Project Structure**
- client/ React app (Vite).
- server/ Express API + Socket.IO server.

**Environment Variables**
- server/.env
~~~
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster-host>
PORT=5000
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
~~~
- client/.env
~~~
VITE_BACKEND_URL=http://localhost:5000
~~~

**Run Locally**
1. cd server
2. npm install
3. npm run server
4. cd ../client
5. npm install
6. npm run dev

**Build**
- Client: npm run build from client/.
- Server: npm start from server/.

**API Overview**
- GET /api/status health check.
- POST /api/auth/signup create account.
- POST /api/auth/login login.
- GET /api/auth/check verify auth.
- PUT /api/auth/update-profile update profile.
- GET /api/messages/users list users and unread counts.
- GET /api/messages/:id get messages with a user.
- PUT /api/messages/mark/:id mark message as seen.
- POST /api/messages/send/:id send a message or image.

**Socket Events**
- getOnlineUsers emits current online user IDs.
- newMessage pushes new messages to the recipient.

**Notes**
- Protected routes expect a token header with the JWT.
- The backend appends /chat-app to MONGODB_URL when connecting.
