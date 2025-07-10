import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'appwrite';
import { Client, Databases } from 'appwrite'; // ✅ FIXED: Removed 'Realtime'
import './dashbord.css';

// ✅ Appwrite setup
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('6864c522003108b9b279');

const databases = new Databases(client);
const databaseId = '6864c596000a79f621ee'; 
const collectionId = '6864c74c000479f76901'; 

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [competitorCount, setCompetitorCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // ✅ Fetch competitor count
  const fetchCompetitorCount = async () => {
  try {
    // Fetch total
    const res = await databases.listDocuments(databaseId, collectionId);
    setCompetitorCount(res.total ?? res.documents.length);

    // Fetch confirmed directly
    const confirmedRes = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("status", ["confirmed"])
    ]);
    setConfirmedCount(confirmedRes.total ?? confirmedRes.documents.length);
  } catch (err) {
    console.error("Error fetching competitors:", err);
  }
};

  useEffect(() => {
    fetchCompetitorCount();

    // ✅ Real-time subscription using the client
    const unsubscribe = client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.documents`,
      (event) => {
        const shouldUpdate = event.events.some(e => 
          e.includes("create") || e.includes("update") || e.includes("delete")
        );
        if (shouldUpdate) fetchCompetitorCount();
      }
    );

    return () => {
      unsubscribe(); 
    };
  }, []);

  const cards = [
    {
      title: "Total Number of competitors",
      value: competitorCount,
      className: "card red",
      link: "/competitors"
    },
    {
      title: "Total Number of confirmed competitors",
      value: confirmedCount,
      className: "card blue",
      link: "/confirmed-competitors"
    },
    {
      title: "Total Number of events",
      value: 0,
      className: "card yellow",
      link: "/events"
    },
    {
      title: "New Appointments",
      value: 0,
      className: "card lightblue",
      link: "/appointments"
    },
    {
      title: "Received Feedback",
      value: 0,
      className: "card green",
      link: "/feedback"
    },
    {
      title: "Cancelled Applications",
      value: 0,
      className: "card orange",
      link: "/cancelled-applications"
    },
  ];

  return (
    <div className="dashboard-container">
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul className="nav">
          <li>Dashboard</li>
          <li>Create Events</li>
          <li>create a Competitions</li>
          <li>Participants</li>
          <li>
  <Link to="/ticketing" onClick={closeSidebar}>
    Manage Tickets
  </Link>
</li>

          <li>Payments</li>
          <li>Statistics</li>
        </ul>
      </aside>

      <main className="main">
        <div className="top-bar-mobile">
          <button className="toggle-button" onClick={toggleSidebar}>☰</button>
        </div>

        <div className="header">
          <h1>Dashboard</h1>
          <div className="welcome">Welcome Back! 👋 T-Roger Admin Dashboard</div>
        </div>

        <div className="cards">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className={card.className + " card-link"}
              style={{ textDecoration: "none" }}
            >
              <div className="card-value">{card.value}</div>
              <div className="card-title">{card.title}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
