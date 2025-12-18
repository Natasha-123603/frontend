"use client";

import { useMemo, useState, useEffect } from "react";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import { getAllGuests, createGuest, updateGuest } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";

const PAGE_SIZE = 5;

export default function GuestsPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [guestsData, setGuestsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadGuests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllGuests();
        setGuestsData(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load guests");
        console.error("Error loading guests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGuests();
  }, [isAuthenticated]);

  const filtered = useMemo(() => {
    return guestsData.filter(
      (guest) =>
        (guest.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (guest.email || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [query, guestsData]);

  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleCreateGuest = async (formData) => {
    try {
      const newGuest = await createGuest(formData);
      setGuestsData((prev) => [...prev, newGuest]);
      setCreateOpen(false);
    } catch (err) {
      setError(err.message || "Failed to create guest");
    }
  };

  const handleUpdateGuest = async (id, formData) => {
    try {
      const updatedGuest = await updateGuest(id, formData);
      setGuestsData((prev) =>
        prev.map((guest) => (guest.id === id || guest._id === id ? updatedGuest : guest))
      );
      setSelectedGuest(null);
    } catch (err) {
      setError(err.message || "Failed to update guest");
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
        Loading guests…
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Guests
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Guest directory</h1>
          <p className="text-sm text-slate-500">Search, filter, and manage loyalty tiers.</p>
        </div>
        <button
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => setCreateOpen(true)}
        >
          Add guest
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(0);
          }}
          placeholder="Search guests by name or email..."
          className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
        />
        <div className="flex gap-2 text-sm">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 disabled:opacity-30"
          >
            Prev
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>

      <DataTable
        headers={["Name", "Email", "Phone", "Tier", "Bookings", ""]}
        rows={paginated.map((guest, index) => {
          const guestId = guest.id || guest._id || `guest-${index}`;
          return {
            id: guestId,
            cells: [
              <div key={`name-${guestId}`} className="flex flex-col">
                <span className="font-semibold text-slate-900">{guest.name || "N/A"}</span>
                <span className="text-xs text-slate-400">{guestId}</span>
              </div>,
              guest.email || "N/A",
              guest.phone || guest.phoneNumber || "N/A",
              <span key={`tier-${guestId}`} className="rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold text-slate-600">
                {guest.loyaltyTier || guest.tier || "Member"}
              </span>,
              guest.totalBookings || guest.bookingCount || 0,
              <button
                key={`edit-${guestId}`}
                className="text-sm text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
                onClick={() => setSelectedGuest(guest)}
              >
                Edit
              </button>,
            ],
          };
        })}
        emptyLabel="No guests match your search."
      />

      <p className="text-center text-xs text-slate-500">
        Page {page + 1} of {Math.max(totalPages, 1)}
      </p>

      <Modal
        title="Edit guest"
        description="Update loyalty details instantly."
        isOpen={Boolean(selectedGuest)}
        onClose={() => setSelectedGuest(null)}
      >
        <FormField label="Full name" defaultValue={selectedGuest?.name} />
        <FormField label="Email" defaultValue={selectedGuest?.email} />
        <FormField label="Phone" defaultValue={selectedGuest?.phone} />
        <FormField
          label="Tier"
          as="select"
          defaultValue={selectedGuest?.loyaltyTier}
          options={["Platinum", "Gold", "Silver", "Member"]}
        />
      </Modal>

      <Modal
        title="Add guest"
        description="Quick-create guest profiles for concierge use."
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        primaryActionLabel="Save guest"
      >
        <FormField label="Full name" placeholder="Guest name" />
        <FormField label="Email" placeholder="guest@email.com" />
        <FormField label="Phone" placeholder="+1 555 000 0000" />
        <FormField
          label="Tier"
          as="select"
          defaultValue="Member"
          options={["Member", "Silver", "Gold", "Platinum"]}
        />
      </Modal>
    </div>
  );
}

