import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/public/Home";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AllDestinations from "./pages/public/AllDestinations";
import DestinationDetail from "./pages/public/DestinationDetail";

import UserDashboard from "./pages/user/UserDashboard";
import Booking from "./pages/user/Booking";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Contact from "./pages/public/Contact";

import Gallery from "./pages/public/Gallery";
import ArticleList from "./pages/public/ArticleList";
import ArticleDetail from "./pages/public/ArticleDetail";

import AdminWisataList from "./pages/admin/wisata/AdminWisataList";
import AdminWisataForm from "./pages/admin/wisata/AdminWisataForm";
import AdminArticleList from "./pages/admin/articles/AdminArticleList";
import AdminArticleForm from "./pages/admin/articles/AdminArticleForm";
import AdminTicketList from "./pages/admin/tickets/AdminTicketList";
import AdminUserList from "./pages/admin/users/AdminUserList";

import History from "./pages/user/History";

const NotFound = () => <div className="pt-5 mt-5 container text-center"><h1>404 Not Found</h1></div>;

// Layout Component
const PublicLayout = () => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="flex-grow-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/destinations" element={<AllDestinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/articles" element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
      </Route>

      {/* User Routes (Disabled for debugging) */}
      {/* 
      <Route path="/user" element={<PublicLayout />}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="profile" element={<div className="pt-5 mt-5 container"><h1>User Profile</h1></div>} />
        <Route path="history" element={<History />} />
      </Route>

      <Route path="/booking" element={<Booking />} />
      */}

      {/* Admin Routes (Disabled for debugging) */}
      {/* 
      <Route path="/admin" element={<PublicLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="wisata" element={<AdminWisataList />} />
        <Route path="wisata/create" element={<AdminWisataForm />} />
        <Route path="wisata/edit/:id" element={<AdminWisataForm />} />

        <Route path="articles" element={<AdminArticleList />} />
        <Route path="articles/create" element={<AdminArticleForm />} />
        <Route path="articles/edit/:id" element={<AdminArticleForm />} />

        <Route path="tickets" element={<AdminTicketList />} />
        <Route path="users" element={<AdminUserList />} />
      </Route>
      */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
