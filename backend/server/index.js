const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const cors = require('cors');
//const dotenv = require('dotenv');
const busRoutes = require("../routes/busRoutes"); // Importing bus routes

//dotenv.config();

const bus = require("../models/Bus");
const { collection, ticket } = require("../models/auth");
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
const busdetails = path.join(statipath, "busdetails.html");
//convert data into json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/client/", express.static(staticpath));
app.use("/admin/", express.static(statipath));

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
app.get("/busdetails", (req, res) => {
    res.sendFile(busdetails);
});
app.get("/api/buses", async (req, res) => {
    try {
        const buses = await bus.find(); // Assuming you have a Bus model
        res.status(200).json(buses);
    } catch (err) {
        console.error("Error fetching buses:", err);
        res.status(500).json({ message: "Failed to fetch buses" });
    }
});

app.get("/contact", (req, res) => {
    res.sendFile(contact);
});
// Get tickets by username and contact from request body
app.post("/api/tickets/search", async (req, res) => {
    const { username, contact } = req.body;

    try {
        // Search for tickets by both username and contact
        const tickets = await ticket.findOne({ username, contact });

        if (tickets.length === 0) {
            return res.status(404).json({
                message: "No tickets found for this user and contact",
            });
        }
        res.status(200).json(tickets);
    } catch (err) {
        console.error("Error fetching tickets:", err);
        res.status(500).json({ message: "Failed to fetch tickets" });
    }
});

app.post("/api/register", async (req, res) => {
    const { username, email, contact, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const data = {
        username,
        email,
        contact,
        password: hashedPassword,
    };
    const data1 = {
        username,
        contact,
    };
    //console.log("Data received:", req.body);
    //const userdata=await collection.insertMany(data);
    // Save the data to the database (or handle as needed)
    try {
        const userdata = await collection.insertMany(data);
        await ticket.insertMany(data1);
        console.log("User registered:", data);
        res.status(200).json({ message: "Registration successful", data });
        //res.redirect("/admin/login.html");
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        let isPasswordValid = false;
        const { username, password } = req.body;
        //console.log('Login data:', req.body);
        // Find user by username or email
        const user = await collection.findOne({ username }); // Adjust if using email
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        // if (user.password == password) {
        //     isPasswordValid = true;
        // }
        // Check if the password is correct
        isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        //res.redirect('/client/c-index.html');
        // Successful login - You can implement session or JWT here
        res.status(200).json({ message: "Login successful", user });
        //res.redirect('/client/c-index.html');
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
app.get("/api/users/count", async (req, res) => {
    try {
        const userCount = await collection.countDocuments(); // Count documents in the User collection
        res.json({ userCount });
    } catch (error) {
        console.error("Error fetching user count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
app.get("/api/bus/total-booked-seats", async (req, res) => {
    try {
        const buses = await bus.find(); // Fetch all bus documents

        let totalBookedSeats = 0;
        let totalAvailableSeats = 0;

        buses.forEach((bus) => {
            if (bus.seats) {
                totalBookedSeats += bus.seats.length; // Count booked seats based on the length of the array
            }
            // Access available seats directly from the bus object
            totalAvailableSeats += bus.availableSeats || 0; // Add the available seats for each bus
        });

        res.json({ totalBookedSeats, totalAvailableSeats }); // Send the response
    } catch (error) {
        console.error("Error fetching total booked seats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/api/newbus", async (req, res) => {
    const {
        rowNumber,
        busName,
        originLocation,
        destination,
        departureTime,
        seatCapacity,
        routeNumber,
        fare,
        date,
        fdate,
        arrivalTime,
    } = req.body;
    console.log("Data received:", req.body);
    // Connect to the MongoDB database
    const newBus = new bus({
        routeNumber: routeNumber,
        rowNumber: rowNumber,
        busName: busName,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        availableSeats: seatCapacity,
        price: fare,
        fromLocation: capitalizeFirstOnly(originLocation),
        toLocation: capitalizeFirstOnly(destination),
        travelDate: changeDateFormat(date),
        arrivalDate: fdate,
        seats: [],
    });

    try {
        const savedBus = await newBus.save();
        console.log("New bus added:", savedBus);
        res.status(200).json({
            message: "New bus added successfully",
            savedBus,
        });
    } catch (err) {
        console.error("Error adding new bus:", err);
        res.status(500).json({ message: "Failed to add new bus" });
    }
});
app.delete("/api/buses/row/:rowNumber", async (req, res) => {
    const { rowNumber } = req.params;
    try {
        const deletedBus = await bus.findOneAndDelete({ rowNumber });
        if (!deletedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json({
            message: "Bus deleted successfully",
            deletedBus,
        });
    } catch (err) {
        console.error("Error deleting bus:", err);
        res.status(500).json({ message: "Failed to delete bus" });
    }
});
// Express example for the update endpoint
app.put("/api/buses/:id", async (req, res) => {
    const rowNumber = req.params.id; // Get bus ID from URL
    const updatedData = req.body; // Get updated data from request body

    // Here, you'd perform your database update logic
    // For example:
    try {
        // Assuming you have a method to update the bus in your database
        await bus.updateOne({ rowNumber }, updatedData);
        res.status(200).json({
            message: "Bus information updated successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating bus information.",
            error: error.message,
        });
    }
});
app.post("/api/busdetails", async (req, res) => {
    const { routeNumber } = req.body;
    console.log("Bus details requested for row number:", routeNumber);
    try {
        const busDetails = await bus.findOne({
            routeNumber,
        });
        console.log("Bus details:", busDetails);
        if (!busDetails) {
            return res.status(404).json({ message: "Bus not found" });
        }
        res.status(200).json(busDetails);
    } catch (err) {
        console.error("Error fetching bus details:", err);
        res.status(500).json({ message: "Failed to fetch bus details" });
    }
});

app.post("/api/buses/book", async (req, res) => {
    const { routeNumber, cseats, username, contact } = req.body;

    // Assuming buses data is stored in a database or an in-memory object

    const buses = await bus.updateOne(
        { routeNumber },
        { $push: { seats: cseats } }
    );
    const updatePromises = cseats.map((sea) => {
        return bus.updateOne(
            { routeNumber },
            { $push: { seatsInfo: { sea, username, contact } } }
        );
    });

    try {
        await Promise.all(updatePromises);
        console.log("All seat information updated successfully.");
    } catch (error) {
        console.error("Error updating seats:", error);
    }

    const buse = await bus.findOne({ routeNumber });
    console.log(buses);
    console.log(username, contact);
    const tickets = await ticket.updateOne(
        { username, contact },
        {
            $push: {
                routeNumber: routeNumber,
                busName: buse.busName,
                departureTime: buse.departureTime,
                arrivalTime: buse.arrivalTime,
                fromLocation: buse.fromLocation,
                toLocation: buse.toLocation,
                travelDate: buse.travelDate,
                bookedSeats: cseats,
            },
        }
    );

    if (!buses) {
        return res.status(404).json({ message: "Bus route not found" });
    }

    res.status(200).json({
        message: "Seats successfully booked!",
        //bookedSeats: bus.bookedSeats,
    });
});

app.use("/api", busRoutes);

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
function capitalizeFirstOnly(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function changeDateFormat(dateStr) {
    // Split the date by '/' to get [MM, DD, YYYY]
    let dateParts = dateStr.split("/");

    // Join the date parts using '-' to form the new date
    return dateParts.join("-");
}
