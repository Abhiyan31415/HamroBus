const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");

const collection = require("../models/auth");
const { stat } = require("fs");
const app = express();
const staticpath = path.join(__dirname, "..", "..", "client");
const statipath = path.join(__dirname, "..", "..", "admin");

const home = path.join(staticpath, "c-index.html");
const search = path.join(staticpath, "search.html");
const blog = path.join(staticpath, "blog.html");
const faq = path.join(staticpath, "faq.html");
const manage = path.join(staticpath, "manage.html");
const contact = path.join(staticpath, "contact.html");

console.log(statipath);

const login = path.join(statipath, "login.html");
const register = path.join(statipath, "register.html");
const dashboard = path.join(statipath, "dashboard.html");
const newbus = path.join(statipath, "newbus.html");

//convert data into json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticpath));
app.use("/admin", express.static(statipath));

app.get("/", (req, res) => {
    res.sendFile(home);
});

app.get("/search", (req, res) => {
    res.sendFile(search);
});

app.get("/blog", (req, res) => {
    res.sendFile(blog);
});

app.get("/faq", (req, res) => {
    res.sendFile(faq);
});

app.get("/manage", (req, res) => {
    res.sendFile(manage);
});

app.get("/contact", (req, res) => {
    res.sendFile(contact);
});

app.get("/login", (req, res) => {
    res.sendFile(login);
});

app.get("/register", (req, res) => {
    res.sendFile(register);
});

app.get("/dashboard", (req, res) => {
    res.sendFile(dashboard);
});

app.get("/newbus", (req, res) => {
    res.sendFile(newbus);
});

app.get("/contact", (req, res) => {
    res.sendFile(contact);
});

app.post("/api/register", async (req, res) => {
    const { username, email, contact, password } = req.body;
    const data = {
        username,
        email,
        contact,
        password,
    };
    //const userdata=await collection.insertMany(data);
    // Save the data to the database (or handle as needed)
    try {
        const userdata = await collection.insertMany(data);
        console.log("User registered:", data);
        res.status(200).json({ message: "Registration successful", data });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        isPasswordValid = false; 
        const { username, password } = req.body;
        //console.log('Login data:', req.body);
        // Find user by username or email
        const user = await collection.findOne({ username }); // Adjust if using email
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if(user.password==password){
            isPasswordValid=true;
        }
        // Check if the password is correct
        //const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Successful login - You can implement session or JWT here
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
