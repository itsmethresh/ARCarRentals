import { type FC, useState } from 'react';
import {
  Car,
  DollarSign,
  Users,
  Settings2,
  Image,
  MapPin,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { supabase } from '@services/supabase';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface VehicleFormData {
  brand: string;
  model: string;
  year: string;
  license_plate: string;
  color: string;
  transmission: 'automatic' | 'manual';
  fuel_type: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  seats: string;
  doors: string;
  luggage_capacity: string;
  features: string;
  thumbnail: string;
  price_per_day: string;
  price_per_week: string;
  price_per_month: string;
  deposit_amount: string;
  mileage: string;
  status: 'available' | 'rented' | 'maintenance';
  location: string;
}

const initialFormData: VehicleFormData = {
  brand: '',
  model: '',
  year: new Date().getFullYear().toString(),
  license_plate: '',
  color: '',
  transmission: 'automatic',
  fuel_type: 'gasoline',
  seats: '5',
  doors: '4',
  luggage_capacity: '2',
  features: '',
  thumbnail: '',
  price_per_day: '',
  price_per_week: '',
  price_per_month: '',
  deposit_amount: '',
  mileage: '0',
  status: 'available',
  location: 'Cebu City',
};

const STEPS = [
  { id: 1, title: 'Basic Information', icon: Car },
  { id: 2, title: 'Specifications', icon: Settings2 },
  { id: 3, title: 'Appearance', icon: Image },
  { id: 4, title: 'Pricing', icon: DollarSign },
  { id: 5, title: 'Additional Info', icon: MapPin },
];

/**
 * Add Vehicle Modal with Step-by-Step Wizard
 */
export const AddVehicleModal: FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.brand && formData.model && formData.year && formData.license_plate);
      case 2:
        return !!(formData.transmission && formData.fuel_type);
      case 3:
        return true; // Optional step
      case 4:
        return !!formData.price_per_day;
      case 5:
        return true; // Optional step
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const featuresArray = formData.features
        ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
        : [];

      const { error: insertError } = await supabase.from('vehicles').insert({
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year),
        license_plate: formData.license_plate.toUpperCase(),
        color: formData.color || null,
        transmission: formData.transmission,
        fuel_type: formData.fuel_type,
        seats: parseInt(formData.seats) || 5,
        doors: parseInt(formData.doors) || 4,
        luggage_capacity: parseInt(formData.luggage_capacity) || 2,
        features: featuresArray,
        thumbnail: formData.thumbnail || null,
        price_per_day: parseFloat(formData.price_per_day),
        price_per_week: formData.price_per_week ? parseFloat(formData.price_per_week) : null,
        price_per_month: formData.price_per_month ? parseFloat(formData.price_per_month) : null,
        deposit_amount: formData.deposit_amount ? parseFloat(formData.deposit_amount) : null,
        mileage: parseInt(formData.mileage) || 0,
        status: formData.status,
        location: formData.location || 'Cebu City',
      });

      if (insertError) throw insertError;

      setFormData(initialFormData);
      setCurrentStep(1);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      setError(err.message || 'Failed to add vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setError(null);
    onClose();
  };

  const progress = (currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Enter the basic details of the vehicle you want to add to your fleet.
            </p>
            <Input
              label="Brand *"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Toyota, Honda, Ford"
            />
            <Input
              label="Model *"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., Camry, Civic, Mustang"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Year *"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                placeholder="2024"
              />
              <Input
                label="License Plate *"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                placeholder="ABC 1234"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Select the vehicle specifications and capacity details.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Transmission *
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Fuel Type *
                </label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Seats"
                name="seats"
                type="number"
                value={formData.seats}
                onChange={handleChange}
                leftIcon={<Users className="h-4 w-4" />}
              />
              <Input
                label="Doors"
                name="doors"
                type="number"
                value={formData.doors}
                onChange={handleChange}
              />
              <Input
                label="Luggage"
                name="luggage_capacity"
                type="number"
                value={formData.luggage_capacity}
                onChange={handleChange}
                helperText="Number of bags"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Add appearance details and vehicle image (optional).
            </p>
            <Input
              label="Color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g., White, Black, Silver"
            />
            <Input
              label="Thumbnail URL"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/car-image.jpg"
              helperText="Direct link to vehicle image"
            />
            {formData.thumbnail && (
              <div className="mt-4 rounded-lg overflow-hidden border border-neutral-200">
                <img
                  src={formData.thumbnail}
                  alt="Vehicle preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Set the rental pricing for this vehicle.
            </p>
            <Input
              label="Price Per Day (₱) *"
              name="price_per_day"
              type="number"
              value={formData.price_per_day}
              onChange={handleChange}
              placeholder="2500"
              leftIcon={<DollarSign className="h-4 w-4" />}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price Per Week (₱)"
                name="price_per_week"
                type="number"
                value={formData.price_per_week}
                onChange={handleChange}
                placeholder="15000"
              />
              <Input
                label="Price Per Month (₱)"
                name="price_per_month"
                type="number"
                value={formData.price_per_month}
                onChange={handleChange}
                placeholder="50000"
              />
            </div>
            <Input
              label="Security Deposit (₱)"
              name="deposit_amount"
              type="number"
              value={formData.deposit_amount}
              onChange={handleChange}
              placeholder="5000"
              helperText="Refundable deposit amount"
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Additional information about the vehicle.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Cebu City"
              />
              <Input
                label="Current Mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Initial Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="available">Available</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Features
              </label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="GPS, Bluetooth, Backup Camera, Leather Seats"
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 min-h-[100px]"
              />
              <p className="mt-1 text-xs text-neutral-500">Separate features with commas</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="md">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wide">
            Add New Vehicle
          </h2>
          {/* Progress Bar */}
          <div className="mt-4 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Title */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            {(() => {
              const StepIcon = STEPS[currentStep - 1].icon;
              return <StepIcon className="h-5 w-5 text-primary-600" />;
            })()}
            {STEPS[currentStep - 1].title}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[280px]">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4 border-t border-neutral-200">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-primary-600 hover:bg-primary-700"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 bg-primary-600 hover:bg-primary-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Vehicle...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Add Vehicle
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddVehicleModal;
