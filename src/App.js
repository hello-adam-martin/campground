import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import { CampgroundProvider } from './context/CampgroundContext';
import CampgroundKiosk from './components/CampgroundKiosk';
import CheckIn from './components/CheckIn';
import MakeReservation from './components/MakeReservation';
import PayForStay from './components/PayForStay';
import ManageReservation from './components/ManageReservation';
import CheckOut from './components/CheckOut';
import PurchaseExtras from './components/PurchaseExtras';
import SiteAvailability from './components/SiteAvailability';

function App() {
  return (
    <CampgroundProvider>
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<CampgroundKiosk />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/make-reservation" element={<MakeReservation />} />
          <Route path="/pay-for-stay" element={<PayForStay />} />
          <Route path="/manage-reservation" element={<ManageReservation />} />
          <Route path="/check-out" element={<CheckOut />} />
          <Route path="/purchase-extras" element={<PurchaseExtras />} />
          <Route path="/site-availability" element={<SiteAvailability />} />
        </Routes>
      </div>
    </Router>
    </CampgroundProvider>
  );
}

export default App;