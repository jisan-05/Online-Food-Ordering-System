import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import CustomerDashboardLayout from '../layouts/CustomerDashboardLayout'
import MainLayout from '../layouts/MainLayout'
import OwnerDashboardLayout from '../layouts/OwnerDashboardLayout'
import FoodDetailsPage from '../pages/FoodDetailsPage'
import FoodsPage from '../pages/FoodsPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProfilePage from '../pages/ProfilePage'
import RegisterPage from '../pages/RegisterPage'
import CartPage from '../pages/dashboard/CartPage'
import CheckoutPage from '../pages/dashboard/CheckoutPage'
import DashboardHomePage from '../pages/dashboard/DashboardHomePage'
import DashboardPlaceholderPage from '../pages/dashboard/DashboardPlaceholderPage'
import OrderDetailsPage from '../pages/dashboard/OrderDetailsPage'
import OrderHistoryPage from '../pages/dashboard/OrderHistoryPage'
import AddFoodPage from '../pages/owner/AddFoodPage'
import ManageFoodsPage from '../pages/owner/ManageFoodsPage'
import ManageOrdersPage from '../pages/owner/ManageOrdersPage'
import OwnerAnalyticsPage from '../pages/owner/OwnerAnalyticsPage'
import OwnerDashboardPage from '../pages/owner/OwnerDashboardPage'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="foods" element={<FoodsPage />} />
        <Route path="foods/:id" element={<FoodDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <CustomerDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrderHistoryPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="wishlist" element={<DashboardPlaceholderPage />} />
        </Route>
        <Route
          path="owner"
          element={
            <ProtectedRoute>
              <OwnerDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OwnerDashboardPage />} />
          <Route path="add-food" element={<AddFoodPage />} />
          <Route path="foods" element={<ManageFoodsPage />} />
          <Route path="orders" element={<ManageOrdersPage />} />
          <Route path="analytics" element={<OwnerAnalyticsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
