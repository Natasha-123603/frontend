"use client";

import { useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import StatusPill from "@/components/common/StatusPill";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import BookingCalendar from "@/components/modules/BookingCalendar";
import { getAllBookings, createBooking, updateBooking } from "@/lib/api";
import { getAllProperties } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";

export default function BookingsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [bookingsData, setBookingsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [bookings, properties] = await Promise.all([
          getAllBookings(),
          getAllProperties()
        ]);
        setBookingsData(Array.isArray(bookings) ? bookings : []);
        setPropertiesData(Array.isArray(properties) ? properties : []);
      } catch (err) {
        setError(err.message || "Failed to load data");
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated]);

  const handleCreateBooking = async (formData) => {
    try {
      const newBooking = await createBooking(formData);
      setBookingsData((prev) => [...prev, newBooking]);
      setCreateOpen(false);
    } catch (err) {
      setError(err.message || "Failed to create booking");
    }
  };

  const handleUpdateBooking = async (id, formData) => {
    try {
      const updatedBooking = await updateBooking(id, formData);
      setBookingsData((prev) =>
        prev.map((booking) => (booking.id === id || booking._id === id ? updatedBooking : booking))
      );
      setSelectedBooking(null);
    } catch (err) {
      setError(err.message || "Failed to update booking");
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-slate-600">
        Checking your access…
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-slate-600">
        Loading bookings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-100 bg-rose-50/80 p-8 text-center text-rose-600">
        {error}
      </div>
    );
  }

  // Transform bookings data for calendar view - aggregate by date and count
  const bookingCalendarMap = {};
  bookingsData.forEach((booking) => {
    const date = booking.checkIn || booking.startDate;
    if (date) {
      bookingCalendarMap[date] = (bookingCalendarMap[date] || 0) + 1;
    }
  });
  
  // Get next 7 days from today
  const today = new Date();
  const bookingCalendar = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    return {
      date: dateStr,
      count: bookingCalendarMap[dateStr] || 0
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Reservations
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Bookings</h1>
          <p className="text-sm text-slate-500">
            Table + calendar view for quick occupancy planning.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            onClick={() => setCreateOpen(true)}
          >
            Add booking
          </button>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Export CSV
          </button>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <DataTable
          headers={["ID", "Guest", "Property", "Dates", "Total", "Status", ""]}
          rows={bookingsData.map((booking, index) => {
            const bookingId = booking.id || booking._id || `booking-${index}`;
            return {
              id: bookingId,
              cells: [
                bookingId,
                <div key={`guest-${bookingId}`} className="font-semibold text-slate-800">
                  {booking.guestName || booking.guest || "N/A"}
                </div>,
                booking.propertyName || booking.property || "N/A",
                `${booking.checkIn || booking.startDate || "N/A"} → ${booking.checkOut || booking.endDate || "N/A"}`,
                `$${booking.total || booking.amount || 0}`,
                <StatusPill key={`status-${bookingId}`} label={booking.status || "Pending"} />,
                <button
                  key={`edit-${bookingId}`}
                  className="text-sm text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
                  onClick={() => setSelectedBooking(booking)}
                >
                  Edit
                </button>,
              ],
            };
          })}
        />
        <BookingCalendar data={bookingCalendar} />
      </section>

      <Modal
        title="Edit booking"
        description="Update booking details without leaving the dashboard."
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
      >
        <FormField label="Guest name" defaultValue={selectedBooking?.guestName || selectedBooking?.guest} />
        <FormField
          label="Property"
          as="select"
          defaultValue={selectedBooking?.propertyName || selectedBooking?.property}
          options={propertiesData.map((property) => property.name || property.propertyName)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Check-in" type="date" defaultValue={selectedBooking?.checkIn || selectedBooking?.startDate} />
          <FormField label="Check-out" type="date" defaultValue={selectedBooking?.checkOut || selectedBooking?.endDate} />
        </div>
        <FormField label="Status" as="select" defaultValue={selectedBooking?.status} options={["Confirmed", "Pending", "Cancelled"]} />
        <FormField label="Total" defaultValue={selectedBooking?.total?.toString().replace("$", "") || selectedBooking?.amount} />
      </Modal>

      <Modal
        title="Add booking"
        description="Fast-create booking requests from phone or walk-ins."
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        primaryActionLabel="Create booking"
      >
        <FormField label="Guest name" placeholder="Guest full name" />
        <FormField
          label="Property"
          as="select"
          defaultValue={propertiesData[0]?.name || propertiesData[0]?.propertyName}
          options={propertiesData.map((property) => property.name || property.propertyName)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Check-in" type="date" />
          <FormField label="Check-out" type="date" />
        </div>
        <FormField label="Total (USD)" type="number" placeholder="0.00" />
        <FormField
          label="Status"
          as="select"
          defaultValue="Pending"
          options={["Pending", "Confirmed", "Cancelled"]}
        />
      </Modal>
    </div>
  );
}

