const { Server } = require("socket.io");
import { sql } from "@vercel/postgres";
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();
const KEY = "safasfgasgasasvasdfva";

let users = [{ id: "1", email: "user1@example.com" }];

export default async function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running, skipping");
    res.end();
    return;
  }
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("a user connected");

    //Adding users to online list
    socket.on("addUser", (email) => {
      console.log("User to add:", email);
      let ids = socket.id;
      const userToUpdate = users.find((user) => user.ids === ids);
      if (!userToUpdate) {
        users.push({ ids, email, socket });
        console.log("User added");
      } else {
        console.log("User already added");
      }
    });

    socket.on("getOnline", () => {
      console.log("Get online on socket.on ");
      const simplifiedUsers = users.map((user) => ({
        id: user.id,
        email: user.email,
      }));
      console.log(simplifiedUsers);
      socket.emit("updateOnline", simplifiedUsers);
    });

    //Send recieved messages
    socket.on("getRecievedMessages", async (email) => {
      if (!email || email === "" || email === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        const result =
          await sql`SELECT * FROM messages WHERE receiver_email LIKE ${email};`;
        io.emit("getRecievedMessages", result.rows, email);
      } catch (error) {
        console.log("Error cought on getRecievedMessages:", error);
      }
    });

    //Send sent messages
    socket.on("getSentMessages", async (email) => {
      if (!email || email === "" || email === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        const result =
          await sql`SELECT * FROM messages WHERE sender_email LIKE ${email};`;
        console.log("email to send back: ", email);
        io.emit("getSentMessages", result.rows, email);
      } catch (error) {
        console.log("Error counght on getSentMessages:", error);
      }
    });

    //Get Sent messages for admin
    socket.on("getSentMessagesAdmin", async (email) => {
      console.log("Email admin:", email);
      if (!email || email === "" || email === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        const result =
          await sql`SELECT * FROM messages WHERE sender_email LIKE ${email};`;
        console.log("sent messages to send back: ", result.rows);
        io.emit("getSentMessagesAdmin", result.rows, email);
      } catch (error) {
        console.log("Error counght on getSentMessages:", error);
      }
    });

    //Get recieved messages admin
    socket.on("getRecievedMessagesAdmin", async (email) => {
      console.log("Email Recieved:", email);
      if (!email || email === "" || email === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        const result =
          await sql`SELECT message_text, sender_email, reported_email as receiver_email, timestamp
        FROM reports
        
        UNION
        
        SELECT message_text, sender_email, receiver_email, timestamp
        FROM messages;`;
        console.log("recieved messages to send back: ", result.rows);
        io.emit("getRecievedMessagesAdmin", result.rows, email);
      } catch (error) {
        console.log("Error cought on getRecievedMessages:", error);
      }
    });

    socket.on("refreshOther", async (email3) => {
      console.log("Email on refresh:", email3);
      if (!email3 || email3 === "" || email3 === null) {
        console.log("Email empty");
        return "email not recieved on backend";
      }
      try {
        const result =
          await sql`SELECT * FROM messages WHERE receiver_email LIKE ${email3};`;

        for (const user of users) {
          if (user.email === email3) {
            user.socket.emit("refreshOther", result.rows, email3);
          }
        }
      } catch (error) {
        console.log("Error counght on getSentMessages:", error);
      }
    });

    socket.on("logout", (email) => {
      console.log("User logged out:", email);
      // Remove the user from the online list
      users = users.filter((user) => user.email !== email);
    });
    //Removing dicsonnected users from online list
    socket.on("disconnect", () => {
      console.log("user disconnected");
      users = users.filter((user) => user.ids !== socket.id);
    });
  });

  res.end();
}
