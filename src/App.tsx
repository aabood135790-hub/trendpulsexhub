/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { CodesList } from './pages/CodesList';
import { Community } from './pages/Community';
import { NewsList } from './pages/NewsList';
import { ModsList } from './pages/ModsList';
import { Search } from './pages/Search';
import { PostView } from './pages/PostView';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { ContactUs } from './pages/ContactUs';

import { AdminLayout } from './components/layout/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminEditor } from './pages/admin/AdminEditor';
import { AuthProvider } from './context/AuthContext';
import { RewardModalProvider } from './context/RewardModalContext';
import { AdProvider } from './context/AdContext';

export default function App() {
  return (
    <AuthProvider>
      <RewardModalProvider>
        <AdProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Home />} />
                <Route path="codes" element={<CodesList />} />
                <Route path="codes/:slug" element={<PostView />} />
                <Route path="community" element={<Community />} />
                <Route path="news" element={<NewsList />} />
                <Route path="news/:slug" element={<PostView />} />
                <Route path="mods" element={<ModsList />} />
                <Route path="mods/:slug" element={<PostView />} />
                <Route path="search" element={<Search />} />
                <Route path="post/:slug" element={<PostView />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsOfService />} />
                <Route path="contact" element={<ContactUs />} />
              </Route>
              
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="new" element={<AdminEditor />} />
                <Route path="edit/:id" element={<AdminEditor />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AdProvider>
      </RewardModalProvider>
    </AuthProvider>
  );
}


