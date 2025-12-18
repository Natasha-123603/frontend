"use client";

import { useState, useEffect } from "react";
import PhotoCarousel from "@/components/modules/PhotoCarousel";
import DataTable from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormField from "@/components/common/FormField";
import StatusPill from "@/components/common/StatusPill";
import { getAllProperties, createProperty, updateProperty, deleteProperty } from "@/lib/api";
import { useRequireAuth } from "@/hooks/useAuth";

export default function PropertiesPage() {
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [propertiesData, setPropertiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    console.log("🟢 PropertiesPage: useEffect triggered, calling getAllProperties");
    const loadProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("🟢 PropertiesPage: Starting API call...");
        const data = await getAllProperties();
        console.log("🟢 PropertiesPage: API call successful, data received:", data);
        setPropertiesData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("🔴 PropertiesPage: API call failed:", err);
        setError(err.message || "Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [isAuthenticated]);

  const handleCreateProperty = async (formData) => {
    try {
      const newProperty = await createProperty(formData);
      setPropertiesData((prev) => [...prev, newProperty]);
      setCreateOpen(false);
    } catch (err) {
      setError(err.message || "Failed to create property");
    }
  };

  const handleUpdateProperty = async (id, formData) => {
    try {
      const updatedProperty = await updateProperty(id, formData);
      setPropertiesData((prev) =>
        prev.map((prop) => (prop.id === id || prop._id === id ? updatedProperty : prop))
      );
      setSelectedProperty(null);
    } catch (err) {
      setError(err.message || "Failed to update property");
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
        Loading properties…
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
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Portfolio
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Properties
          </h1>
          <p className="text-sm text-slate-500">
            Manage units, track occupancy, and keep photos fresh.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            onClick={() => setCreateOpen(true)}
          >
            Add property
          </button>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Import from Airbnb
          </button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {propertiesData.map((property) => {
          const propertyId = property.id || property._id;
          const photos = property.photos || (property.photo ? [property.photo] : []);
          return (
          <div
            key={propertyId}
            className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400">
                  {propertyId}
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  {property.name || property.propertyName}
                </h3>
                <p className="text-sm text-slate-500">{property.location || property.address}</p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>Occupancy</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {property.occupancy || 0}%
                </p>
                <p>${property.nightlyRate || property.price || 0}/night</p>
              </div>
            </div>
            {photos.length > 0 && <PhotoCarousel photos={photos} />}
            <div className="flex items-center justify-between text-sm text-slate-500">
              <StatusPill label={property.status || "Listed"} />
              <button
                className="text-slate-900 underline-offset-2 hover:underline"
                onClick={() => setSelectedProperty(property)}
              >
                Edit details
              </button>
            </div>
          </div>
        );
        })}
      </section>

      <section>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Portfolio table</h2>
            <p className="text-sm text-slate-500">Full CRUD coming soon</p>
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Search property..."
              className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 focus:outline-none"
            />
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm">
              Filters
            </button>
          </div>
        </div>
        <div className="mt-4">
          <DataTable
            headers={[
              "ID",
              "Name",
              "Location",
              "Status",
              "Occupancy",
              "Nightly rate",
            ]}
            rows={propertiesData.map((property) => {
              const propertyId = property.id || property._id;
              return {
                id: propertyId,
                cells: [
                  propertyId,
                  property.name || property.propertyName,
                  property.location || property.address,
                  <StatusPill key="status" label={property.status || "Listed"} />,
                  `${property.occupancy || 0}%`,
                  `$${property.nightlyRate || property.price || 0}`,
                ],
              };
            })}
          />
        </div>
      </section>

      <Modal
        title={selectedProperty ? "Edit property" : "Create property"}
        description="Modals are using frontend-only data for now."
        isOpen={Boolean(selectedProperty)}
        onClose={() => setSelectedProperty(null)}
      >
        <FormField label="Property name" defaultValue={selectedProperty?.name} />
        <FormField label="Location" defaultValue={selectedProperty?.location} />
        <FormField label="Status" as="select" defaultValue={selectedProperty?.status} options={["Listed", "Maintenance", "Offline"]} />
        <FormField
          label="Nightly rate"
          type="number"
          defaultValue={selectedProperty?.nightlyRate}
        />
        <FormField
          label="Notes"
          as="textarea"
          rows={4}
          defaultValue="Great condition, trending on Airbnb."
        />
      </Modal>

      <Modal
        title="Add property"
        description="Collect key property details to onboard quickly."
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        primaryActionLabel="Create property"
      >
        <FormField label="Property name" placeholder="e.g. Desert Bloom Villa" />
        <FormField label="Location" placeholder="City, Country" />
        <FormField
          label="Status"
          as="select"
          defaultValue="Listed"
          options={["Listed", "Maintenance", "Offline"]}
        />
        <FormField label="Nightly rate" type="number" placeholder="350" />
        <FormField label="Photo URL" placeholder="https://..." />
      </Modal>
    </div>
  );
}

