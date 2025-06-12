import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/useAuth";
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

  return (
  <QueryClientProvider client={queryClient}>
  <AuthProvider>
    <Toaster />
   <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } />
      </Routes>
      </Layout>
    </Router>

    </AuthProvider>
    </QueryClientProvider>
  )
}

export default App