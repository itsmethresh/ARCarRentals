import { type FC, useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { supabase } from '@services/supabase';

// Flexible customer input type that accepts various shapes
interface CustomerInput {
  id: string;
  email?: string;
  full_name?: string;
  phone_number?: string;
  role?: string;
  is_active?: boolean;
  created_at?: string;
}

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  customer: CustomerInput | null;
}

interface CustomerFormData {
  full_name: string;
  phone_number: string;
  address: string;
  city: string;
  driver_license_number: string;
  driver_license_expiry: string;
  date_of_birth: string;
  role: 'customer' | 'staff' | 'admin';
  is_active: boolean;
}

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Contact', icon: Phone },
  { id: 3, title: 'Address', icon: MapPin },
  { id: 4, title: "Driver's License", icon: CreditCard },
];

/**
 * Edit Customer Modal with Step-by-Step Wizard
 */
export const EditCustomerModal: FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  customer,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CustomerFormData>({
    full_name: '',
    phone_number: '',
    address: '',
    city: 'Cebu City',
    driver_license_number: '',
    driver_license_expiry: '',
    date_of_birth: '',
    role: 'customer',
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load customer data when modal opens
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customer || !isOpen) return;

      setIsLoadingData(true);
      try {
        // Fetch profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', customer.id)
          .single();

        setFormData({
          full_name: customer.full_name || '',
          phone_number: customer.phone_number || '',
          address: profileData?.address || '',
          city: profileData?.city || 'Cebu City',
          driver_license_number: profileData?.driver_license_number || '',
          driver_license_expiry: profileData?.driver_license_expiry || '',
          date_of_birth: profileData?.date_of_birth || '',
          role: (customer.role as 'customer' | 'staff' | 'admin') || 'customer',
          is_active: customer.is_active !== false,
        });
      } catch (err) {
        console.error('Error fetching customer data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchCustomerData();
  }, [customer, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
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
        return !!formData.full_name;
      case 2:
        return true; // Optional
      case 3:
        return true; // Optional
      case 4:
        return true; // Optional
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
        1: 'Please enter customer full name',
      };
      setError(messages[currentStep] || 'Please fill in required fields');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!customer) return;

    setIsLoading(true);
    setError(null);

    try {
      const normalizedPhone = formData.phone_number 
        ? normalizePhoneNumber(formData.phone_number)
        : null;

      // Update user record
      const { error: userError } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          phone_number: normalizedPhone,
          role: formData.role,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customer.id);

      if (userError) {
        throw userError;
      }

      // Update profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: customer.id,
          full_name: formData.full_name,
          phone: normalizedPhone,
          address: formData.address || null,
          city: formData.city,
          driver_license_number: formData.driver_license_number || null,
          driver_license_expiry: formData.driver_license_expiry || null,
          date_of_birth: formData.date_of_birth || null,
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      setCurrentStep(1);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error updating customer:', err);
      setError(err.message || 'Failed to update customer. Please try again.');
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
    if (isLoadingData) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-3 text-neutral-600">Loading customer data...</span>
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Update the customer's basic information.
            </p>
            <Input
              label="Full Name *"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              leftIcon={<User className="h-4 w-4" />}
            />
            <Input
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
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
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Account Status
                </label>
                <select
                  name="is_active"
                  value={formData.is_active ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            {customer && (
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-500">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email: <span className="text-neutral-700">{customer.email}</span>
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Email cannot be changed. To change email, the customer must update it themselves.
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Update contact information.
            </p>
            <Input
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+63 9XX XXX XXXX"
              leftIcon={<Phone className="h-4 w-4" />}
              helperText="Will be normalized to +63 format"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Update address information.
            </p>
            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              leftIcon={<MapPin className="h-4 w-4" />}
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-neutral-500 text-sm mb-6">
              Update driver's license information.
            </p>
            <Input
              label="Driver's License Number"
              name="driver_license_number"
              value={formData.driver_license_number}
              onChange={handleChange}
              placeholder="License number"
              leftIcon={<CreditCard className="h-4 w-4" />}
            />
            <Input
              label="License Expiry Date"
              name="driver_license_expiry"
              type="date"
              value={formData.driver_license_expiry}
              onChange={handleChange}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full transition-all
                      ${isCompleted ? 'bg-green-500 text-white' : ''}
                      ${isActive ? 'bg-primary-600 text-white' : ''}
                      ${!isActive && !isCompleted ? 'bg-neutral-200 text-neutral-500' : ''}
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 h-1 mx-2 rounded ${
                        currentStep > step.id ? 'bg-green-500' : 'bg-neutral-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-neutral-900">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Step {currentStep} of {STEPS.length}
            </p>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[300px]">{renderStepContent()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button onClick={handleNext} disabled={isLoadingData}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Customer'
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EditCustomerModal;
