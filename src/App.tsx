import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Beranda from "./pages/Beranda";
import DetailProduk from "./pages/DetailProduk";
import KatalogProduk from "./pages/KatalogProduk";
import Keranjang from "./pages/Keranjang";
import Tentang from "./pages/Tentang";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PaymentConfirmationPage from "./pages/HalamanKonfirmasi";
import UserProfilePage from "./pages/Profil";
import EditProfilePage from "./pages/EditProfil";
import UserLikedProductsPage from "./pages/Like";
import PurchaseHistory from "./pages/RiwayatPembelian";
import OrderDetailPage from "./pages/DetailOrder";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Beranda />
          </Layout>
        }
      />
      <Route
        path="/produk/:slug"
        element={
          <Layout>
            <DetailProduk />
          </Layout>
        }
      />
      <Route
        path="/katalog"
        element={
          <Layout>
            <KatalogProduk />
          </Layout>
        }
      />
      <Route
        path="/keranjang"
        element={
          <Layout>
            <Keranjang />
          </Layout>
        }
      />
      <Route
        path="/tentang"
        element={
          <Layout>
            <Tentang />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/payment/confirmation/:token"
        element={
          <Layout>
            <PaymentConfirmationPage />
          </Layout>
        }
      />
      <Route
        path="/profil"
        element={
          <Layout>
            <UserProfilePage />
          </Layout>
        }
      />
      <Route
        path="/profil/edit"
        element={
          <Layout>
            <EditProfilePage />
          </Layout>
        }
      />
      <Route
        path="/profil/favorit"
        element={
          <Layout>
            <UserLikedProductsPage />
          </Layout>
        }
      />
      <Route
        path="profil/riwayat-pembelian"
        element={
          <Layout>
            <PurchaseHistory />
          </Layout>
        }
      />
      <Route 
        path="profil/riwayat-pembelian/:id"
        element={
          <Layout>
            <OrderDetailPage/>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
