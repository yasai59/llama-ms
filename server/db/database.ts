import fs from 'fs';
import path from 'path';

const userPath = path.join(__dirname, '../user.json');

export const getUser = (id: string) => {
  // check if the file exists
  if (!fs.existsSync(userPath)) {
    console.log('User data file does not exist');
    return null;
  }

  // read the user data from the file
  const data = fs.readFileSync(userPath, 'utf8');
  const users = JSON.parse(data);

  // find the user by id
  const user = users.find((u: { id: string }) => u.id === id);
  if (!user) {
    console.log('User not found');
    return null;
  }

  return user;
}


export const updateUser = (user: {
  id: string;
  profile: string;
}) => {
  // read the existing user data
  let existingUsers = [];
  if (fs.existsSync(userPath)) {
    const data = fs.readFileSync(userPath, 'utf8');
    existingUsers = JSON.parse(data);
  }

  // check if the user already exists
  const existingUserIndex = existingUsers.findIndex((u: { id: string }) => u.id === user.id);
  if (existingUserIndex !== -1) {
    // if the user exists, remove them from the array
    existingUsers.splice(existingUserIndex, 1);
  }
  // add the new user to the array
  existingUsers.push(user);

  // write the updated user data back to the file
  fs.writeFileSync(userPath, JSON.stringify(existingUsers, null, 2), 'utf8');
  console.log('User data updated successfully');
  return existingUsers;
}