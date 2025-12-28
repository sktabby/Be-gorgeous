import React from "react";
import { Routes, Route } from "react-router-dom";
import { ROUTES } from "../app/routes";

import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/public/Home";
import Category from "../pages/public/Category";
import Product from "../pages/public/Product";
import Cart from "../pages/public/Cart";
import NotFound from "../pages/public/NotFound";

import AdminLogin from "../pages/admin/AdminLogin";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import AddProduct from "../pages/admin/AddProduct";
import EditProduct from "../pages/admin/EditProduct";
import Categories from "../pages/admin/Categories";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.CATEGORY} element={<Category />} />
        <Route path={ROUTES.PRODUCT} element={<Product />} />
        <Route path={ROUTES.CART} element={<Cart />} />
      </Route>

      <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.ADMIN_DASH} element={<Dashboard />} />
        <Route path={ROUTES.ADMIN_PRODUCTS} element={<Products />} />
        <Route path={ROUTES.ADMIN_ADD_PRODUCT} element={<AddProduct />} />
        <Route path={ROUTES.ADMIN_EDIT_PRODUCT} element={<EditProduct />} />
        <Route path={ROUTES.ADMIN_CATEGORIES} element={<Categories />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
