import { type FC, useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Car,
  MapPin,
  DollarSign,
  Loader2,
  Search,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { supabase } from '@services/supabase';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
}

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  price_per_day: number;
  status: string;
}

interface BookingFormData {
  user_id: string;
  vehicle_id: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  return_location: string;
  status: 'pending' | 'confirmed' | 'active';
  payment_status: 'pending' | 'partial' | 'paid';
  deposit_paid: number;
  discount_amount: number;
  extras_price: number;
  notes: string;
}

const initialFormData: BookingFormData = {
  user_id: '',
  vehicle_id: '',
  pickup_date: '',
  return_date: '',
  pickup_location: 'Cebu City',
  return_location: 'Cebu City',
  status: 'confirmed',
  payment_status: 'pending',
  deposit_paid: 0,
  discount_amount: 0,
  extras_price: 0,
  notes: '',
};

const STEPS = [
  { id: 1, title: 'Select Customer', icon: User },
  { id: 2, title: 'Select Vehicle', icon: Car },
  { id: 3, title: 'Rental Period', icon: Calendar },
  { id: 4, title: 'Payment Details', icon: DollarSign },
];

/**
 * Add Booking Modal with Step-by-Step Wizard
 */
export const AddBookingModal: FC<AddBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(initialFormData);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  // Fetch customers and available vehicles
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch customers
        const { data: customersData } = await supabase
          .from('users')
          .select('id, full_name, email, phone_number')
          .eq('role', 'customer')
          .order('full_name');

        // Fetch available vehicles
        const { data: vehiclesData } = await supabase
          .from('vehicles')
          .select('id, brand, model, price_per_day, status')
          .eq('status', 'available')
          .order('brand');

        setCustomers(customersData || []);
        setVehicles(vehiclesData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Calculate pricing
  const calculatePricing = () => {
    if (!selectedVehicle || !formData.pickup_date || !formData.return_date) {
      return { days: 0, basePrice: 0, total: 0 };
    }

    const pickup = new Date(formData.pickup_date);
    const returnDate = new Date(formData.return_date);
    const days = Math.max(1, Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24)));
    const basePrice = days * selectedVehicle.price_per_day;
    const total = basePrice + formData.extras_price - formData.discount_amount;

    return { days, basePrice, total: Math.max(0, total) };
  };

  const pricing = calculatePricing();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));

    // Update selected vehicle when vehicle_id changes
    if (name === 'vehicle_id') {
      const vehicle = vehicles.find((v) => v.id === value);
      setSelectedVehicle(vehicle || null);
    }

    // Update selected customer when user_id changes
    if (name === 'user_id') {
      const customer = customers.find((c) => c.id === value);
      setSelectedCustomer(customer || null);
    }
  };

  const generateBookingNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BK-${year}-${random}`;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.user_id;
      case 2:
        return !!formData.vehicle_id;
      case 3:
        return !!(formData.pickup_date && formData.return_date);
      case 4:
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
      const messages: Record<number, string> = {
        1: 'Please select a customer',
        2: 'Please select a vehicle',
        3: 'Please select pickup and return dates',
      };
      setError(messages[currentStep] || 'Please fill in required fields');
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
      // Validation
      if (!formData.user_id) {
        throw new Error('Please select a customer');
      }
      if (!formData.vehicle_id) {
        throw new Error('Please select a vehicle');
      }
      if (!formData.pickup_date || !formData.return_date) {
        throw new Error('Please select pickup and return dates');
      }

      const bookingData = {
        booking_number: generateBookingNumber(),
        user_id: formData.user_id,
        vehicle_id: formData.vehicle_id,
        pickup_date: formData.pickup_date,
        return_date: formData.return_date,
        pickup_location: formData.pickup_location,
        return_location: formData.return_location,
        total_days: pricing.days,
        base_price: pricing.basePrice,
        extras_price: formData.extras_price,
        discount_amount: formData.discount_amount,
        total_price: pricing.total,
        deposit_paid: formData.deposit_paid,
        status: formData.status,
        payment_status: formData.payment_status,
        notes: formData.notes || null,
      };

      const { error: insertError } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (insertError) {
        throw insertError;
      }

      // Update vehicle status to rented if booking is confirmed/active
      if (formData.status === 'confirmed' || formData.status === 'active') {
        await supabase
          .from('vehicles')
          .update({ status: 'rented' })
          .eq('id', formData.vehicle_id);
      }

      // Reset and close
      setFormData(initialFormData);
      setSelectedVehicle(null);
      setSelectedCustomer(null);
      setCurrentStep(1);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setSelectedVehicle(null);
    setSelectedCustomer(null);
    setCurrentStep(1);
    setError(null);
    onClose();
  };

  // Filter customers
  const filteredCustomers = customers.filter(
    (c) =>
      c.full_name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone_number?.includes(customerSearch)
  );

  // Filter vehicles
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.brand.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.model.toLowerCase().includes(vehicleSearch.toLowerCase())
  );

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];
  const progress = (currentStep / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-4">
              Select the customer for this booking.
            </p>
            <Input
              placeholder="Search by name, email, or phone..."
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredCustomers.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-lg">
                  No customers found. Add customers first.
                </div>
              ) : (
                filteredCustomers.map((customer) => (
                  <label
                    key={customer.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer rounded-lg border transition-all ${
                      formData.user_id === customer.id
                        ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20'
                        : 'bg-white border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="user_id"
                      value={customer.id}
                      checked={formData.user_id === customer.id}
                      onChange={handleChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">
                        {customer.full_name || 'Unnamed Customer'}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {customer.email} {customer.phone_number && `• ${customer.phone_number}`}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-4">
              Choose an available vehicle for the rental.
            </p>
            <Input
              placeholder="Search by brand or model..."
              value={vehicleSearch}
              onChange={(e) => setVehicleSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {filteredVehicles.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-sm border border-dashed border-neutral-300 rounded-lg">
                  No available vehicles. Add vehicles to your fleet first.
                </div>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <label
                    key={vehicle.id}
                    className={`flex items-center gap-3 p-4 cursor-pointer rounded-lg border transition-all ${
                      formData.vehicle_id === vehicle.id
                        ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500/20'
                        : 'bg-white border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="vehicle_id"
                      value={vehicle.id}
                      checked={formData.vehicle_id === vehicle.id}
                      onChange={handleChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="text-sm text-primary-600 font-semibold">
                        ₱{vehicle.price_per_day.toLocaleString()}/day
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-4">
              Set the pickup and return dates for this booking.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Pickup Date *"
                name="pickup_date"
                type="date"
                value={formData.pickup_date}
                onChange={handleChange}
                min={today}
              />
              <Input
                label="Return Date *"
                name="return_date"
                type="date"
                value={formData.return_date}
                onChange={handleChange}
                min={formData.pickup_date || today}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Pickup Location"
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleChange}
                leftIcon={<MapPin className="h-4 w-4" />}
              />
              <Input
                label="Return Location"
                name="return_location"
                value={formData.return_location}
                onChange={handleChange}
                leftIcon={<MapPin className="h-4 w-4" />}
              />
            </div>
            {/* Pricing Preview */}
            {selectedVehicle && formData.pickup_date && formData.return_date && (
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    {pricing.days} day(s) × ₱{selectedVehicle.price_per_day.toLocaleString()}
                  </span>
                  <span className="font-semibold">₱{pricing.basePrice.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-4">
              Configure payment and booking status.
            </p>
            
            {/* Summary Card */}
            {selectedVehicle && selectedCustomer && (
              <div className="p-4 bg-neutral-900 rounded-lg text-white mb-4">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Booking Summary</h4>
                <p className="font-semibold">{selectedCustomer.full_name}</p>
                <p className="text-sm text-neutral-400">{selectedVehicle.brand} {selectedVehicle.model}</p>
                <p className="text-sm text-neutral-400">{formData.pickup_date} → {formData.return_date}</p>
                <div className="mt-3 pt-3 border-t border-neutral-700 flex justify-between">
                  <span>Total</span>
                  <span className="text-xl font-bold text-primary-500">₱{pricing.total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Booking Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Payment Status
                </label>
                <select
                  name="payment_status"
                  value={formData.payment_status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Deposit (₱)"
                name="deposit_paid"
                type="number"
                min={0}
                value={formData.deposit_paid}
                onChange={handleChange}
              />
              <Input
                label="Extras (₱)"
                name="extras_price"
                type="number"
                min={0}
                value={formData.extras_price}
                onChange={handleChange}
              />
              <Input
                label="Discount (₱)"
                name="discount_amount"
                type="number"
                min={0}
                value={formData.discount_amount}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Any special requests..."
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="md">
      {isLoadingData ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wide">
              Create New Booking
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
          <div className="min-h-[320px]">{renderStepContent()}</div>

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
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Create Booking
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AddBookingModal;
