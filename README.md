How to install? 

1. Clone the repository:
git clone git@github.com:KarolisRZN/vilnius-tours.git

2. Install dependencies:
npm install

3. Install PostgreSQL on your local machine:

4. Create a database with using my backup file. (vilnius tours.backup): (Optional but recommended)
Create a database with name "vilniustours"
Right click -> Restore -> Format Custom or tar -> Filename (vilniustours.backup) -> Restore

5. Navigate to server -> .env file and change the required fields to the ones you have configured:
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password

Usage:

This is a fullstack project, meaning you will have to run both the client and the server. First, navigate to the server directory:

1. cd server
npm run start

2. cd client
npm run start

If there are no errors - you have configured everything correctly and the web-app is working.
