import { type FC, useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Download,
  Plus,
} from 'lucide-react';
import { Card, Button, Input, AddCustomerModal, EditCustomerModal, ConfirmDialog } from '@components/ui';
import { customerService, type Customer as CustomerType, type CustomerStats } from '@services/customerService';
import { supabase } from '@services/supabase';

const StatusBadge: FC<{ status: 'active' | 'inactive' }> = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-neutral-100 text-neutral-600',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

/**
 * Admin Customers Management Page
 */
export const AdminCustomersPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;

    setIsDeleting(true);
    try {
      // Delete from users table (this will cascade or we delete profile first)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedCustomer.id);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', selectedCustomer.id);

      if (error) throw error;

      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const [customersRes, statsRes] = await Promise.all([
        customerService.getAll(),
        customerService.getStats(),
      ]);

      if (customersRes.data) {
        setCustomers(customersRes.data);
      }
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery || filterStatus !== 'all') {
        const statusFilter = filterStatus === 'all' ? undefined : (filterStatus as 'active' | 'inactive');
        const result = await customerService.search(searchQuery, statusFilter);
        if (result.data) {
          setCustomers(result.data);
        }
      } else {
        const result = await customerService.getAll();
        if (result.data) {
          setCustomers(result.data);
        }
      }
    };

    const debounce = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Customer Management</h1>
          <p className="text-neutral-500">View and manage your customer base</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            className="bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-neutral-900">{stats?.total || 0}</p>
              )}
              <p className="text-sm text-neutral-500">Total Customers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-green-600">{stats?.active || 0}</p>
              )}
              <p className="text-sm text-neutral-500">Active</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-primary-600">{stats?.avgBookingsPerCustomer || 0}</p>
              )}
              <p className="text-sm text-neutral-500">Avg. Bookings</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">₱</span>
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 w-16 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-blue-600">₱{((stats?.totalRevenue || 0) / 1000).toFixed(0)}K</p>
              )}
              <p className="text-sm text-neutral-500">Total Revenue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-neutral-400" />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Users className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No customers found</h3>
            <p className="text-neutral-500 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No customers have registered yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Location</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-neutral-600">Bookings</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-600">Total Spent</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-neutral-600">Status</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                          {customer.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{customer.full_name || 'Unknown'}</p>
                          <p className="text-sm text-neutral-500">
                            Since {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Mail className="h-4 w-4 text-neutral-400" />
                          <span>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Phone className="h-4 w-4 text-neutral-400" />
                          <span>{customer.phone_number || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <MapPin className="h-4 w-4 text-neutral-400" />
                        <span>
                          {Array.isArray(customer.profiles) && customer.profiles.length > 0
                            ? customer.profiles[0].city || 'N/A'
                            : customer.profiles && 'city' in customer.profiles
                            ? customer.profiles.city || 'N/A'
                            : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-neutral-900">{customer.booking_count || 0}</span>
                      {customer.last_booking_date && (
                        <p className="text-xs text-neutral-500">
                          Last: {new Date(customer.last_booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-neutral-900">₱{(customer.total_spent || 0).toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <StatusBadge status={customer.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(customer)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600" 
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(customer)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" 
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchCustomers}
      />

      {/* Edit Customer Modal */}
      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSuccess={fetchCustomers}
        customer={selectedCustomer}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Customer"
        message={`Are you sure you want to delete ${selectedCustomer?.full_name}? This will also delete their profile and cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />

      <style>{`
        /* Mobile responsive styles */
        @media (max-width: 768px) {
          .overflow-x-auto {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .overflow-x-auto table {
            min-width: 800px;
          }

          .grid.grid-cols-2 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }

        @media (max-width: 480px) {
          .grid.grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCustomersPage;
