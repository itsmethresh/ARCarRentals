import { type FC, useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Loader2,
  Shield,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { supabase } from '@services/supabase';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CustomerFormData {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  address: string;
  city: string;
  driver_license_number: string;
  driver_license_expiry: string;
  date_of_birth: string;
  role: 'customer' | 'staff' | 'admin';
}

const initialFormData: CustomerFormData = {
  email: '',
  password: '',
  full_name: '',
  phone_number: '',
  address: '',
  city: 'Cebu City',
  driver_license_number: '',
  driver_license_expiry: '',
  date_of_birth: '',
  role: 'customer',
};

const STEPS = [
  { id: 1, title: 'Account Setup', icon: Shield },
  { id: 2, title: 'Personal Info', icon: User },
  { id: 3, title: 'Address', icon: MapPin },
  { id: 4, title: "Driver's License", icon: CreditCard },
];

/**
 * Add Customer Modal with Step-by-Step Wizard
 */
export const AddCustomerModal: FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Normalize phone number to +63 format
  const normalizePhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('09')) {
      cleaned = '+63' + cleaned.substring(1);
    } else if (cleaned.startsWith('9') && cleaned.length === 10) {
      cleaned = '+63' + cleaned;
    } else if (cleaned.startsWith('63') && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    } else if (!cleaned.startsWith('+63') && !cleaned.startsWith('+')) {
      if (cleaned.length === 10 && cleaned.startsWith('9')) {
        cleaned = '+63' + cleaned;
      }
    }
    
    return cleaned;
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.email && formData.password && formData.password.length >= 6);
      case 2:
        return !!formData.full_name;
      case 3:
        return true; // Optional step
      case 4:
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
      const messages: Record<number, string> = {
        1: 'Please enter email and password (min 6 characters)',
        2: 'Please enter customer full name',
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
      const normalizedPhone = formData.phone_number 
        ? normalizePhoneNumber(formData.phone_number)
        : null;

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user account');

      // Create user record in public.users
      const { error: userError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.full_name,
        phone_number: normalizedPhone,
        role: formData.role,
        is_active: true,
      });

      if (userError) {
        console.error('Error creating user record:', userError);
      }

      // Create profile record
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: formData.full_name,
        phone: normalizedPhone,
        address: formData.address || null,
        city: formData.city,
        driver_license_number: formData.driver_license_number || null,
        driver_license_expiry: formData.driver_license_expiry || null,
        date_of_birth: formData.date_of_birth || null,
      });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      setFormData(initialFormData);
      setCurrentStep(1);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error adding customer:', err);
      setError(err.message || 'Failed to add customer. Please try again.');
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
              Set up the login credentials for this customer.
            </p>
            <Input
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@email.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />
            <Input
              label="Password *"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              helperText="Customer will use this to log in"
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Account Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Enter the customer's personal information.
            </p>
            <Input
              label="Full Name *"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Juan Dela Cruz"
            />
            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="09XX XXX XXXX"
              leftIcon={<Phone className="h-4 w-4" />}
              helperText="Philippine format: 09XX or +639XX"
            />
            <Input
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              leftIcon={<Calendar className="h-4 w-4" />}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Add the customer's address details (optional).
            </p>
            <Input
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street, Barangay"
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Cebu City"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Add driver's license information (optional but recommended for rentals).
            </p>
            <Input
              label="License Number"
              name="driver_license_number"
              value={formData.driver_license_number}
              onChange={handleChange}
              placeholder="N01-23-456789"
            />
            <Input
              label="License Expiry Date"
              name="driver_license_expiry"
              type="date"
              value={formData.driver_license_expiry}
              onChange={handleChange}
            />
            
            {/* Summary Preview */}
            <div className="p-4 bg-neutral-900 rounded-lg text-white mt-6">
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 mb-2">Customer Summary</h4>
              <p className="font-semibold">{formData.full_name || 'Name not set'}</p>
              <p className="text-sm text-neutral-400">{formData.email}</p>
              {formData.phone_number && (
                <p className="text-sm text-neutral-400">{formData.phone_number}</p>
              )}
              <p className="text-xs text-primary-500 mt-2 capitalize">{formData.role} Account</p>
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
            Add New Customer
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
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Add Customer
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddCustomerModal;
