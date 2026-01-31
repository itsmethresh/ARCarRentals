import { type FC, useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  CreditCard,
  Download,
  Plus,
  UserCheck,
  UserX,
  Clock,
} from 'lucide-react';
import { Card, Button, Input, AddDriverModal, EditDriverModal, ConfirmDialog } from '@components/ui';
import { driverService, type Driver as DriverType, type DriverStats } from '@services/driverService';
import { supabase } from '@services/supabase';

const StatusBadge: FC<{ status: DriverType['status'] }> = ({ status }) => {
  const styles = {
    available: 'bg-green-100 text-green-700',
    on_duty: 'bg-blue-100 text-blue-700',
    unavailable: 'bg-neutral-100 text-neutral-600',
  };

  const labels = {
    available: 'Available',
    on_duty: 'On Duty',
    unavailable: 'Unavailable',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export const AdminDriversPage: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [stats, setStats] = useState<DriverStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (driver: DriverType) => {
    setSelectedDriver(driver);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (driver: DriverType) => {
    setSelectedDriver(driver);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDriver) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', selectedDriver.id);

      if (error) throw error;

      setIsDeleteDialogOpen(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const [driversRes, statsRes] = await Promise.all([
        driverService.getAll(),
        driverService.getStats(),
      ]);

      if (driversRes.data) {
        setDrivers(driversRes.data);
      }
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery || filterStatus !== 'all') {
        const statusFilter = filterStatus === 'all' ? undefined : (filterStatus as DriverType['status']);
        const result = await driverService.search(searchQuery, statusFilter);
        if (result.data) {
          setDrivers(result.data);
        }
      } else {
        const result = await driverService.getAll();
        if (result.data) {
          setDrivers(result.data);
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
          <h1 className="text-2xl font-bold text-neutral-900">Driver Management</h1>
          <p className="text-neutral-500">Manage your professional drivers</p>
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
            Add Driver
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
              <p className="text-sm text-neutral-500">Total Drivers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-green-600">{stats?.available || 0}</p>
              )}
              <p className="text-sm text-neutral-500">Available</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-blue-600">{stats?.on_duty || 0}</p>
              )}
              <p className="text-sm text-neutral-500">On Duty</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
              <UserX className="h-5 w-5 text-neutral-600" />
            </div>
            <div>
              {isLoading ? (
                <div className="h-8 w-12 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <p className="text-2xl font-bold text-neutral-600">{stats?.unavailable || 0}</p>
              )}
              <p className="text-sm text-neutral-500">Unavailable</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by name, phone, or license..."
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
              <option value="available">Available</option>
              <option value="on_duty">On Duty</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Drivers Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : drivers.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Users className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No drivers found</h3>
            <p className="text-neutral-500 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No drivers have been added yet'}
            </p>
            <Button 
              className="bg-primary-600 hover:bg-primary-700"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Driver
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Driver</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">License</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Experience</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-neutral-600">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-neutral-600">Rate/Day</th>
                  <th className="text-center py-4 px-6 text-sm font-semibold text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {driver.profile_photo ? (
                          <img
                            src={driver.profile_photo}
                            alt={driver.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold">
                            {driver.full_name?.charAt(0) || 'D'}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-neutral-900">{driver.full_name}</p>
                          {driver.specializations && driver.specializations.length > 0 && (
                            <p className="text-xs text-neutral-500">{driver.specializations[0]}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Phone className="h-4 w-4 text-neutral-400" />
                          <span>{driver.phone_number}</span>
                        </div>
                        {driver.email && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Mail className="h-4 w-4 text-neutral-400" />
                            <span className="truncate max-w-[150px]">{driver.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4 text-neutral-400" />
                        <div>
                          <p className="text-neutral-900">{driver.license_number}</p>
                          <p className="text-xs text-neutral-500">
                            Exp: {new Date(driver.license_expiry).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-neutral-900">{driver.years_of_experience} years</span>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={driver.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="font-semibold text-neutral-900">₱{driver.rate_per_day.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(driver)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-600" 
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(driver)}
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

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchDrivers}
      />

      {/* Edit Driver Modal */}
      <EditDriverModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDriver(null);
        }}
        onSuccess={fetchDrivers}
        driver={selectedDriver}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedDriver(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Driver"
        message={`Are you sure you want to delete ${selectedDriver?.full_name}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminDriversPage;
