import { Client, Databases, ID } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);

export { client, databases, ID };
