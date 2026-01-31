import { type FC, useState, useEffect } from 'react';
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

// Accept any vehicle shape that has at least an id
interface VehicleInput {
  id: string;
  brand?: string;
  model?: string;
  year?: number;
  license_plate?: string;
  plate_number?: string;
  color?: string | null;
  transmission?: string;
  fuel_type?: string;
  seats?: number;
  doors?: number;
  luggage_capacity?: number;
  features?: string[];
  thumbnail?: string | null;
  image_url?: string | null;
  price_per_day?: number;
  price_per_week?: number | null;
  price_per_month?: number | null;
  deposit_amount?: number | null;
  mileage?: number;
  status?: 'available' | 'rented' | 'maintenance';
  location?: string;
  type?: string;
  description?: string;
}

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  vehicle: VehicleInput | null;
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

const STEPS = [
  { id: 1, title: 'Basic Information', icon: Car },
  { id: 2, title: 'Specifications', icon: Settings2 },
  { id: 3, title: 'Appearance', icon: Image },
  { id: 4, title: 'Pricing', icon: DollarSign },
  { id: 5, title: 'Additional Info', icon: MapPin },
];

/**
 * Edit Vehicle Modal with Step-by-Step Wizard
 */
export const EditVehicleModal: FC<EditVehicleModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  vehicle,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<VehicleFormData>({
    brand: '',
    model: '',
    year: '',
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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load vehicle data when modal opens
  useEffect(() => {
    if (vehicle && isOpen) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        license_plate: vehicle.license_plate || vehicle.plate_number || '',
        color: vehicle.color || '',
        transmission: (vehicle.transmission as 'automatic' | 'manual') || 'automatic',
        fuel_type: (vehicle.fuel_type as 'gasoline' | 'diesel' | 'hybrid' | 'electric') || 'gasoline',
        seats: vehicle.seats?.toString() || '5',
        doors: vehicle.doors?.toString() || '4',
        luggage_capacity: vehicle.luggage_capacity?.toString() || '2',
        features: vehicle.features?.join(', ') || '',
        thumbnail: vehicle.thumbnail || vehicle.image_url || '',
        price_per_day: vehicle.price_per_day?.toString() || '',
        price_per_week: vehicle.price_per_week?.toString() || '',
        price_per_month: vehicle.price_per_month?.toString() || '',
        deposit_amount: vehicle.deposit_amount?.toString() || '',
        mileage: vehicle.mileage?.toString() || '0',
        status: vehicle.status || 'available',
        location: vehicle.location || 'Cebu City',
      });
      setCurrentStep(1);
    }
  }, [vehicle, isOpen]);

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
        return true;
      case 4:
        return !!formData.price_per_day;
      case 5:
        return true;
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
    if (!vehicle) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const featuresArray = formData.features
        ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
        : [];

      const { error: updateError } = await supabase
        .from('vehicles')
        .update({
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
        })
        .eq('id', vehicle.id);

      if (updateError) throw updateError;

      setCurrentStep(1);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error updating vehicle:', err);
      setError(err.message || 'Failed to update vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
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
              Update the basic details of this vehicle.
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
              Update the vehicle specifications.
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
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Update appearance details.
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
              Update rental pricing.
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
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Update additional information.
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
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
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
                placeholder="GPS, Bluetooth, Backup Camera"
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
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wide">
            Edit Vehicle
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
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditVehicleModal;
