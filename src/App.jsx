import React from "react";
import "./app.css";
import { Routes, Route } from "react-router-dom";
import SignIn from "./signup";
import Login from "./login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Blogs from "./Blogs";
import Myblogs from "./Mypost";
import MainLayout from "./Mainlayout";
import Mynewpost from "./Mynewpost";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/myblogs" element={<Myblogs />} />
          <Route path="/postblog" element={<Mynewpost />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
